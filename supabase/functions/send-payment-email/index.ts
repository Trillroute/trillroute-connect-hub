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
    const { studentId, courseId, paymentLink } = await req.json() as EmailPayload;

    if (!studentId || !courseId || !paymentLink) {
      console.error('Missing required parameters:', { studentId, courseId, paymentLink });
      throw new Error('Missing required parameters: studentId, courseId, or paymentLink');
    }

    console.log(`Sending payment email for student ${studentId}, course ${courseId}`);

    // Check if RESEND_API_KEY exists
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      throw new Error('Email service not configured properly');
    }
    console.log('Resend API Key found:', resendApiKey ? 'Yes' : 'No');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get student details
    const { data: student, error: studentError } = await supabase
      .from('custom_users')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Error fetching student:', studentError);
      throw new Error(`Student with ID ${studentId} not found`);
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('title, final_price, duration_type')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Error fetching course:', courseError);
      throw new Error(`Course with ID ${courseId} not found`);
    }

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

    // Try sending email with better error handling
    console.log(`Attempting to send email to ${student.email}`);
    
    try {
      const emailResponse = await resend.emails.send({
        from: 'Music Course Platform <onboarding@resend.dev>',
        to: [student.email],
        subject: `Payment Link for ${course.title} - Complete Your Enrollment`,
        html: emailHtml,
      });

      console.log('Resend API Response:', JSON.stringify(emailResponse, null, 2));

      if (emailResponse.error) {
        console.error('Resend error details:', emailResponse.error);
        throw new Error(`Failed to send email: ${emailResponse.error.message || 'Unknown error'}`);
      }

      console.log('Email sent successfully via Resend:', emailResponse.data);

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

    } catch (resendError) {
      console.error('Resend API Error:', resendError);
      
      // Check if it's a 403 error (likely API key issue)
      if (resendError.message?.includes('403') || resendError.message?.includes('Forbidden')) {
        console.error('403 Error - likely API key issue. Please check:');
        console.error('1. API key is correct');
        console.error('2. Domain is verified in Resend dashboard');
        console.error('3. API key has proper permissions');
        
        // Log to database as failed
        await supabase
          .from('email_logs')
          .insert({
            recipient_id: studentId,
            recipient_email: student.email,
            subject: `Payment Link for ${course.title}`,
            content: emailHtml,
            status: 'failed',
            metadata: {
              course_id: courseId,
              course_title: course.title,
              payment_link: paymentLink,
              amount: course.final_price,
              error: 'API key authentication failed',
              error_details: resendError.message
            }
          });

        throw new Error('Email sending failed: API key authentication issue. Please verify your Resend API key and domain verification.');
      }
      
      throw resendError;
    }

  } catch (error) {
    console.error('Error sending payment email:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send payment email',
        details: 'Check the function logs for more information'
      }),
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
});
