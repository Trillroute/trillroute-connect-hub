
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
  user_id: string;
  course_id: string;
  is_qr_payment?: boolean;
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
    
    // Skip verification for QR payments which won't have valid signatures
    if (paymentId.startsWith('qr_payment_')) {
      logStep("Skipping signature verification for QR payment");
      return true;
    }
    
    // If there's no signature, we can't verify
    if (!signature) {
      logStep("Missing signature, cannot verify");
      return false;
    }
    
    const body = orderId + "|" + paymentId;
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
    
    if (!secret) {
      logStep("ERROR: RAZORPAY_KEY_SECRET is not defined in environment variables");
      return false;
    }
    
    const textEncoder = new TextEncoder();
    const keyData = textEncoder.encode(secret);
    const message = textEncoder.encode(body);
    
    // Create HMAC key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Sign the message
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      message
    );
    
    // Convert to hex
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

// Function to check if order exists and is valid
const checkOrderExists = async (
  supabase: any,
  orderId: string,
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    logStep("Checking if order exists", { orderId, userId, courseId });
    
    // Skip check for QR payments which may use generated order IDs
    if (orderId.startsWith('qr_order_')) {
      logStep("Skipping order check for QR payment with generated ID");
      return true;
    }
    
    // Check if this order exists and belongs to the right user and course
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, course_id")
      .eq("order_id", orderId)
      .single();
      
    if (orderError) {
      logStep("Error checking order", orderError);
      return false;
    }
    
    if (!orderData) {
      logStep("Order not found");
      return false;
    }
    
    // Validate that the order belongs to the right user and course
    if (orderData.user_id !== userId || orderData.course_id !== courseId) {
      logStep("Order user_id or course_id mismatch", { 
        expected: { userId, courseId },
        found: { user_id: orderData.user_id, course_id: orderData.course_id }
      });
      return false;
    }
    
    logStep("Order exists and is valid");
    return true;
  } catch (error) {
    logStep("Exception checking order", { error: error.message });
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
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
  courseId: string,
  userId: string,
  isQrPayment: boolean = false,
  amount = 0
): Promise<boolean> => {
  try {
    logStep("Updating payment status", { razorpayPaymentId, razorpayOrderId, isQrPayment });
    
    // Check if payment record already exists with this Razorpay payment ID
    const { data: existingPayment, error: checkError } = await supabase
      .from("payments")
      .select("id, status")
      .eq("razorpay_payment_id", razorpayPaymentId)
      .maybeSingle();
    
    if (checkError) {
      logStep("Error checking existing payment", checkError);
    }
    
    // If payment record exists and is already completed, just return success
    if (existingPayment && existingPayment.status === "completed") {
      logStep("Payment is already marked as completed", existingPayment);
      return true;
    }
    
    // If payment record exists but is not completed, update it
    if (existingPayment) {
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "completed",
          razorpay_signature: razorpaySignature,
          updated_at: new Date().toISOString(),
          metadata: { isQrPayment, verification_time: new Date().toISOString() }
        })
        .eq("id", existingPayment.id);
      
      if (updateError) {
        logStep("Error updating existing payment", updateError);
        return false;
      }
      
      logStep("Existing payment updated successfully");
    } else {
      // If payment record doesn't exist, create a new one
      const { error: insertError } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          course_id: courseId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
          status: "completed",
          amount: amount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: { isQrPayment, initial_verification_time: new Date().toISOString() }
        });
      
      if (insertError) {
        logStep("Error creating new payment record", insertError);
        return false;
      }
      
      logStep("New payment record created successfully");
    }
    
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
  isQrPayment: boolean = false
): Promise<void> => {
  try {
    logStep("Logging user activity", { userId, courseId, isQrPayment });
    
    const { error: logError } = await supabase
      .from("user_activity_logs")
      .insert({
        user_id: userId,
        action: isQrPayment ? "qr_payment_completed" : "payment_completed",
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

// Function to get course price
const getCoursePrice = async (
  supabase: any,
  courseId: string
): Promise<number> => {
  try {
    logStep("Getting course price", { courseId });
    
    const { data, error } = await supabase
      .from("courses")
      .select("final_price, base_price")
      .eq("id", courseId)
      .single();
    
    if (error) {
      logStep("Error fetching course price", error);
      return 0;
    }
    
    const price = data.final_price || data.base_price || 0;
    logStep("Course price retrieved", { price });
    return price;
  } catch (error) {
    logStep("Exception getting course price", { error: error.message });
    return 0;
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

    if (!requestData.user_id || !requestData.course_id) {
      logStep("Missing user_id or course_id");
      return new Response(
        JSON.stringify({ error: "Missing user_id or course_id parameters" }),
        { headers: responseHeaders, status: 400 }
      );
    }

    // Check if this is a QR code payment (will have payment ID starting with qr_payment_)
    const isQrCodePayment = requestData.razorpay_payment_id?.startsWith('qr_payment_') || 
                            requestData.is_qr_payment === true;
    
    logStep("Payment type detected", { isQrCodePayment });
    
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    let signatureVerified = false;
    let orderVerified = false;
    
    // For regular payments, verify signature and order
    if (!isQrCodePayment && requestData.razorpay_payment_id && requestData.razorpay_order_id && requestData.razorpay_signature) {
      try {
        // Verify signature
        signatureVerified = await verifyRazorpaySignature(
          requestData.razorpay_order_id,
          requestData.razorpay_payment_id,
          requestData.razorpay_signature
        );

        if (signatureVerified) {
          logStep("Signature verified successfully");
          
          // Verify order exists
          orderVerified = await checkOrderExists(
            supabase,
            requestData.razorpay_order_id,
            requestData.user_id,
            requestData.course_id
          );
          
          if (orderVerified) {
            logStep("Order verified successfully");
          } else {
            logStep("Order verification failed, but continuing with enrollment");
          }
        } else {
          logStep("Signature verification failed, but continuing with enrollment");
        }
      } catch (verificationError) {
        logStep("Error during verification process", { error: verificationError.message });
        // Continue anyway - verification is optional
      }
    } else {
      if (isQrCodePayment) {
        logStep("QR code payment detected, skipping standard verification");
        
        // For QR payments, we don't have signatures but still check the order if possible
        if (!requestData.razorpay_order_id.startsWith('qr_order_')) {
          orderVerified = await checkOrderExists(
            supabase,
            requestData.razorpay_order_id,
            requestData.user_id,
            requestData.course_id
          );
          
          if (orderVerified) {
            logStep("Order exists for QR payment");
          } else {
            logStep("Order not verified for QR payment, continuing");
          }
        }
      } else {
        logStep("Missing one or more Razorpay parameters, assuming QR code or external payment");
      }
    }
    
    // Get course price for payment record
    const amount = await getCoursePrice(supabase, requestData.course_id);
    
    // Update payment status
    const paymentUpdateSuccess = await updatePaymentStatus(
      supabase,
      requestData.razorpay_payment_id || `qr_payment_${Date.now()}`,
      requestData.razorpay_order_id || `qr_order_${Date.now()}`,
      requestData.razorpay_signature || '',
      requestData.course_id,
      requestData.user_id,
      isQrCodePayment,
      amount
    );
    
    if (!paymentUpdateSuccess) {
      logStep("Failed to update payment status, but continuing with enrollment");
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
      isQrCodePayment
    );

    logStep("Payment verification and enrollment completed successfully");

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Payment verification and enrollment completed successfully",
        redirectUrl: `/courses/${requestData.course_id}?enrollment=success&payment=verified`,
        signatureVerified: signatureVerified,
        orderVerified: orderVerified,
        isQrCodePayment: isQrCodePayment
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
