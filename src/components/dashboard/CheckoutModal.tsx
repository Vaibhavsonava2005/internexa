"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Assuming standard UI components or I'll use simple Framer Motion modal
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  internshipName: string;
  amount: number;
  clerkId: string;
  studentName: string;
  email: string;
  onSuccess: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  applicationId,
  internshipName,
  amount,
  clerkId,
  studentName,
  email,
  onSuccess
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await initializeRazorpay();
      if (!res) {
        setError("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // Create Order
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkey",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "InterNexa",
        description: `Enrollment for ${internshipName}`,
        image: "https://internexa.vercel.app/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId,
                clerkId,
                studentName,
                email,
                internshipName,
                amount
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess();
              onClose();
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setError("Error verifying payment.");
          }
        },
        prefill: {
          name: studentName,
          email: email,
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setError("Payment failed. Please try again.");
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
          >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Enrollment</h2>
            <p className="text-slate-500 text-sm mt-1">Secure checkout for your internship.</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Program</p>
                <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{internshipName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-bold text-xl text-indigo-600 dark:text-indigo-400">₹{amount}</p>
              </div>
            </div>

            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Instant access to curriculum & materials</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Mentor assignment & onboarding</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>100% secure payment via Razorpay</span>
              </li>
            </ul>

            {error && (
              <div className="p-3 mt-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 flex gap-3">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
