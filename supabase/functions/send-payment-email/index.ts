
import { serve } from "https://deno.land/std@0.188.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0'

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

    // Send email using straightforward technique (you might want to use a service like Resend in production)
    // For now, we'll just record this in a new table to simulate sending an email
    
    const emailContent = `
    <html>
      <body>
        <h2>Course Payment Link</h2>
        <p>Hello ${student.first_name} ${student.last_name},</p>
        <p>Thank you for enrolling in <strong>${course.title}</strong>.</p>
        <p>To complete your enrollment, please make a payment of Rs. ${course.final_price} by clicking the link below:</p>
        <p><a href="${paymentLink}" style="padding: 10px 15px; background-color: #9b87f5; color: white; text-decoration: none; border-radius: 5px;">Make Payment</a></p>
        <p>Or copy and paste this link: ${paymentLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br/>Music Course Platform</p>
      </body>
    </html>
    `;

    // Log the email being "sent"
    console.log(`Would send email to ${student.email} with payment link ${paymentLink}`);

    // Record the email in a table
    const { data: emailLog, error: emailError } = await supabase
      .from('email_logs')
      .insert({
        recipient_id: studentId,
        recipient_email: student.email,
        subject: `Payment Link for ${course.title}`,
        content: emailContent,
        metadata: {
          course_id: courseId,
          course_title: course.title,
          payment_link: paymentLink,
          amount: course.final_price
        }
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error logging email:', emailError);
      throw new Error('Failed to log email sending');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Payment link email for ${course.title} sent to ${student.email}`,
        email_log_id: emailLog.id
      }),
      {
        headers: responseHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending payment email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send payment email' }),
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
});
