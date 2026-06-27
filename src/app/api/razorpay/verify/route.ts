import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { logActivity } from '@/actions/admin.actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      applicationId,
      clerkId,
      studentName,
      email,
      internshipName,
      amount
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // 1. Record Transaction in DB
      const { error: txError } = await supabaseAdmin.from('transactions').insert([{
        clerk_id: clerkId,
        application_id: applicationId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "Successful"
      }]);

      if (txError) {
        console.error("Failed to insert transaction", txError);
        // Continue, we still want to unlock the course
      }

      // 2. Send Success Email
      await sendPaymentSuccessEmail({
        studentName,
        email,
        internshipName,
        transactionId: razorpay_payment_id,
        amount
      });

      // 3. Log Activity
      await logActivity(clerkId, "Payment Successful", `Paid ₹${amount} for ${internshipName}`);

      return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
