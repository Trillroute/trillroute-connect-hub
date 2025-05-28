import { serve } from "https://deno.land/std@0.188.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface EmailPayload {
  studentId: string;
  courseId: string;
  paymentLink: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  // Add CORS headers to all responses
  const responseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json'
  };

  try {
    console.log("Starting email send process");
    
    const { studentId, courseId, paymentLink } = await req.json() as EmailPayload;
    console.log("Received payload:", { studentId, courseId, paymentLink });

    if (!studentId || !courseId || !paymentLink) {
      console.error('Missing required parameters:', { studentId, courseId, paymentLink });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: studentId, courseId, or paymentLink'
        }),
        {
          headers: responseHeaders,
          status: 400,
        }
      );
    }

    // Check if RESEND_API_KEY exists
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured - missing API key'
        }),
        {
          headers: responseHeaders,
          status: 500,
        }
      );
    }
    console.log('Resend API Key found, length:', resendApiKey.length);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get student details
    console.log("Fetching student details for ID:", studentId);
    const { data: student, error: studentError } = await supabase
      .from('custom_users')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Error fetching student:', studentError);
      return new Response(
        JSON.stringify({ 
          error: `Student with ID ${studentId} not found`
        }),
        {
          headers: responseHeaders,
          status: 404,
        }
      );
    }
    console.log("Student found:", student.email);

    // Get course details
    console.log("Fetching course details for ID:", courseId);
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('title, final_price, duration_type')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Error fetching course:', courseError);
      return new Response(
        JSON.stringify({ 
          error: `Course with ID ${courseId} not found`
        }),
        {
          headers: responseHeaders,
          status: 404,
        }
      );
    }
    console.log("Course found:", course.title);

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Create email content
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Course Payment Link</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9b87f5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #9b87f5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complete Your Course Enrollment</h1>
          </div>
          <div class="content">
            <p>Hello ${student.first_name} ${student.last_name},</p>
            <p>Thank you for enrolling in <strong>${course.title}</strong>!</p>
            <p>To complete your enrollment, please make a payment of <strong>₹${course.final_price}</strong> by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${paymentLink}" class="button">Make Payment - ₹${course.final_price}</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #e8e8e8; padding: 10px; border-radius: 4px;">${paymentLink}</p>
            <p><strong>Important:</strong> This payment link will expire in 24 hours for security reasons.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            <p>Best regards,<br/>Music Course Platform Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    console.log(`Attempting to send email to ${student.email} using onboarding@resend.dev`);
    
    // Send email using the default verified domain
    const emailResponse = await resend.emails.send({
      from: 'Music Course Platform <onboarding@resend.dev>',
      to: [student.email],
      subject: `Payment Link for ${course.title} - Complete Your Enrollment`,
      html: emailHtml,
    });

    console.log('Resend API Response:', JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error('Resend error details:', JSON.stringify(emailResponse.error, null, 2));
      return new Response(
        JSON.stringify({ 
          error: `Failed to send email: ${emailResponse.error.message || 'Unknown error'}`,
          details: emailResponse.error
        }),
        {
          headers: responseHeaders,
          status: 400,
        }
      );
    }

    console.log('Email sent successfully via Resend. ID:', emailResponse.data?.id);

    // Log the email in database for record keeping
    const { data: emailLog, error: emailError } = await supabase
      .from('email_logs')
      .insert({
        recipient_id: studentId,
        recipient_email: student.email,
        subject: `Payment Link for ${course.title}`,
        content: emailHtml,
        status: 'sent',
        metadata: {
          course_id: courseId,
          course_title: course.title,
          payment_link: paymentLink,
          amount: course.final_price,
          resend_id: emailResponse.data?.id
        }
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error logging email:', emailError);
      // Don't throw here - email was sent successfully, logging is secondary
    } else {
      console.log('Email logged successfully with ID:', emailLog?.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Payment link email for ${course.title} sent successfully to ${student.email}`,
        email_id: emailResponse.data?.id,
        email_log_id: emailLog?.id
      }),
      {
        headers: responseHeaders,
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-payment-email function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send payment email',
        details: 'Check the function logs for more information',
        stack: error.stack
      }),
      {
        headers: responseHeaders,
        status: 500,
      }
    );
  }
});
