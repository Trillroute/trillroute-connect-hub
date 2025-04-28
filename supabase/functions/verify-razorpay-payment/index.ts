
import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";
import * as crypto from "https://deno.land/std@0.188.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.188.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

interface VerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  payment_id: string;
  user_id: string;
  course_id: string;
}

// Helper function for logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

// Function to create Supabase client
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
};

// Function to verify Razorpay signature
const verifyRazorpaySignature = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    logStep("Verifying signature", { orderId, paymentId });
    
    const body = orderId + "|" + paymentId;
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
    
    if (!secret) {
      logStep("ERROR: RAZORPAY_KEY_SECRET is not defined in environment variables");
      return false;
    }
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const message = encoder.encode(body);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      message
    );
    
    const generatedSignature = hexEncode(new Uint8Array(signatureBytes));
    
    logStep("Signature comparison", {
      generated: generatedSignature,
      received: signature,
      match: generatedSignature === signature
    });

    return generatedSignature === signature;
  } catch (error) {
    logStep("Error during signature verification", { error: error.message });
    return false;
  }
};

// Function to update course enrollment
const updateCourseEnrollment = async (
  supabase: any,
  courseId: string,
  userId: string
): Promise<boolean> => {
  try {
    logStep("Updating course enrollment", { courseId, userId });
    
    // Get current course data
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("student_ids, students")
      .eq("id", courseId)
      .single();

    if (courseError) {
      logStep("Error fetching course", courseError);
      return false;
    }

    // Check if student is already enrolled
    const currentStudentIds = courseData.student_ids || [];
    if (currentStudentIds.includes(userId)) {
      logStep("Student already enrolled in course");
      return true;
    }

    // Add student to course
    const { error: updateError } = await supabase
      .from("courses")
      .update({
        student_ids: [...currentStudentIds, userId],
        students: (courseData.students || 0) + 1
      })
      .eq("id", courseId);

    if (updateError) {
      logStep("Error updating course enrollment", updateError);
      return false;
    }

    logStep("Course enrollment updated successfully");
    return true;
  } catch (error) {
    logStep("Exception in updateCourseEnrollment", { error: error.message });
    return false;
  }
};

// Function to update payment status
const updatePaymentStatus = async (
  supabase: any,
  paymentId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  courseId: string,
  userId: string
): Promise<boolean> => {
  try {
    logStep("Updating payment status", { paymentId, razorpayPaymentId });
    
    // Check if payment record exists
    const { data: existingPayment, error: checkError } = await supabase
      .from("payments")
      .select("id")
      .eq("razorpay_payment_id", razorpayPaymentId)
      .maybeSingle();
    
    if (checkError) {
      logStep("Error checking existing payment", checkError);
    }
    
    // If payment record exists, update it
    if (existingPayment) {
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "completed",
          razorpay_signature: razorpaySignature,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingPayment.id);
      
      if (updateError) {
        logStep("Error updating existing payment", updateError);
        return false;
      }
      
      logStep("Existing payment updated successfully");
      return true;
    } 
    
    // If payment record doesn't exist or paymentId is unknown, create a new one
    const { error: insertError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        course_id: courseId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: paymentId,
        razorpay_signature: razorpaySignature,
        status: "completed",
        amount: 0, // We don't know the amount here
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      logStep("Error creating new payment record", insertError);
      return false;
    }
    
    logStep("New payment record created successfully");
    return true;
  } catch (error) {
    logStep("Exception in updatePaymentStatus", { error: error.message });
    return false;
  }
};

// Function to log user activity
const logUserActivity = async (
  supabase: any,
  userId: string,
  courseId: string,
  paymentId: string
): Promise<void> => {
  try {
    logStep("Logging user activity", { userId, courseId });
    
    const { error: logError } = await supabase
      .from("user_activity_logs")
      .insert({
        user_id: userId,
        action: "payment_completed",
        component: "course_enrollment",
        entity_id: courseId,
        page_url: `/courses/${courseId}`
      });

    if (logError) {
      logStep("Error logging user activity", logError);
    } else {
      logStep("User activity logged successfully");
    }
  } catch (error) {
    logStep("Exception in logUserActivity", { error: error.message });
  }
};

// Main request handler
serve(async (req) => {
  logStep("Function started");
  
  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    logStep("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders, 
      status: 204 
    });
  }

  const responseHeaders = {
    ...corsHeaders,
    "Content-Type": "application/json"
  };

  try {
    const requestData: VerificationRequest = await req.json();
    logStep("Request data received", requestData);

    if (!requestData.razorpay_payment_id || !requestData.razorpay_order_id || 
        !requestData.razorpay_signature) {
      logStep("Missing required parameters");
      return new Response(
        JSON.stringify({ error: "Missing required Razorpay verification parameters" }),
        { headers: responseHeaders, status: 400 }
      );
    }
    
    if (!requestData.user_id || !requestData.course_id) {
      logStep("Missing user_id or course_id");
      return new Response(
        JSON.stringify({ error: "Missing user_id or course_id parameters" }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Verify Razorpay signature
    const isSignatureValid = await verifyRazorpaySignature(
      requestData.razorpay_order_id,
      requestData.razorpay_payment_id,
      requestData.razorpay_signature
    );

    if (!isSignatureValid) {
      logStep("Invalid signature");
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        { headers: responseHeaders, status: 400 }
      );
    }

    logStep("Signature verified successfully");
    
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    // Update payment status
    const paymentUpdateSuccess = await updatePaymentStatus(
      supabase,
      requestData.payment_id,
      requestData.razorpay_payment_id,
      requestData.razorpay_signature,
      requestData.course_id,
      requestData.user_id
    );
    
    if (!paymentUpdateSuccess) {
      logStep("Failed to update payment status");
      // Continue anyway - this is not critical
    }
    
    // Update course enrollment
    const enrollmentSuccess = await updateCourseEnrollment(
      supabase,
      requestData.course_id,
      requestData.user_id
    );

    if (!enrollmentSuccess) {
      logStep("Failed to update course enrollment");
      return new Response(
        JSON.stringify({ error: "Failed to update course enrollment" }),
        { headers: responseHeaders, status: 500 }
      );
    }

    // Log user activity
    await logUserActivity(
      supabase,
      requestData.user_id,
      requestData.course_id,
      requestData.payment_id
    );

    logStep("Payment verification and enrollment completed successfully");

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Payment verification and enrollment completed successfully",
        redirectUrl: `/courses/${requestData.course_id}?enrollment=success&payment=verified`
      }),
      { headers: responseHeaders, status: 200 }
    );
  } catch (error) {
    logStep("Error in payment verification", { 
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ error: error.message || "Payment verification failed" }),
      { headers: responseHeaders, status: 400 }
    );
  }
});
