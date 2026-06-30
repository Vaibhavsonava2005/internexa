"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Loader2, Download, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function SuccessPage() {
  const params = useParams();
  const offerId = params.offerId as string;
  const { user } = useUser();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApp() {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships (*)
        `)
        .eq('offer_letter_id', offerId)
        .single();
      
      if (error || !data) {
        router.push('/dashboard');
        return;
      }
      setApplication(data);
      setLoading(false);
    }
    loadApp();
  }, [offerId, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !application) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const startDate = new Date();
  const endDate = new Date();
  // Assume a 2 month internship for demo purposes if not specified
  endDate.setMonth(endDate.getMonth() + 2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 print:bg-white print:text-black print:p-0">
      
      {/* Web Only Controls */}
      <div className="max-w-4xl mx-auto mb-8 print:hidden flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Payment Successful!</h2>
            <p className="text-sm text-slate-400">Your Joining Letter is ready.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Printable Joining Letter */}
      <div className="max-w-4xl mx-auto bg-white text-black p-12 shadow-2xl rounded-sm print:shadow-none print:p-0 print:w-full relative overflow-hidden min-h-[1056px]">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-none">
             <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="black" strokeWidth="2"/>
           </svg>
        </div>

        {/* Letterhead */}
        <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none">
              <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="#3730a3" strokeWidth="8"/>
              <circle cx="50" cy="45" r="8" fill="#3730a3" />
            </svg>
            <div>
              <h1 className="text-3xl font-black text-indigo-950 tracking-tighter">InterNexa Labs</h1>
              <p className="text-xs font-bold tracking-widest text-indigo-800 uppercase">EdTech Private Limited</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>123 Innovation Drive, Tech Park</p>
            <p>Bengaluru, Karnataka 560100</p>
            <p>info.InterNexa Labs@gmail.com | www.internexalabs.online</p>
          </div>
        </div>

        {/* Date and Ref */}
        <div className="flex justify-between items-center mb-8 text-sm font-medium">
          <p><strong>Ref No:</strong> INX/OFFER/{application.id.substring(0,8).toUpperCase()}</p>
          <p><strong>Date:</strong> {format(new Date(), "MMMM do, yyyy")}</p>
        </div>

        {/* Salutation */}
        <div className="mb-6">
          <p className="font-bold text-lg mb-1">To,</p>
          <p className="font-bold text-xl">{user?.fullName || "Student Name"}</p>
          <p className="text-gray-700">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        <h2 className="text-xl font-bold text-center underline underline-offset-4 mb-8 uppercase tracking-wide">Subject: Offer of Internship</h2>

        {/* Body */}
        <div className="space-y-4 text-justify text-gray-800 leading-relaxed mb-10">
          <p>
            Dear <strong>{user?.fullName || "Student Name"}</strong>,
          </p>
          <p>
            We are thrilled to offer you the position of <strong>{application.internships.title} Intern</strong> at <strong>InterNexa Labs</strong>. We were incredibly impressed by your background and are excited to welcome you to our cohort.
          </p>
          <p>
            Your internship is scheduled to commence on <strong>{format(startDate, "MMMM do, yyyy")}</strong> and will conclude on <strong>{format(endDate, "MMMM do, yyyy")}</strong>. During this period, you will be expected to dedicate yourself to the curriculum, projects, and assignments provided on the InterNexa Labs platform.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
            <h3 className="font-bold mb-3 border-b border-gray-200 pb-2">Internship Details:</h3>
            <ul className="space-y-2">
              <li><strong>Program:</strong> {application.internships.title}</li>
              <li><strong>Category:</strong> {application.internships.category}</li>
              <li><strong>Duration:</strong> {application.internships.duration}</li>
              <li><strong>Stipend:</strong> Performance-based (Subject to successful completion of all milestones)</li>
            </ul>
          </div>

          <p>
            As an intern, you will be governed by the Non-Disclosure Agreement (NDA) and the Terms of Service accepted during your onboarding process. You will have access to our premium AI tools, industry mentorship sessions, and exclusive real-world projects.
          </p>
          <p>
            We look forward to a mutually beneficial relationship and are confident that this internship will be a significant stepping stone in your career.
          </p>
        </div>

        {/* Signatures & Stamps */}
        <div className="flex justify-between items-end mt-16 pt-8">
          <div>
            <div className="w-40 border-b border-gray-400 mb-2"></div>
            <p className="font-bold">Accepted By</p>
            <p className="text-sm text-gray-600">{user?.fullName}</p>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Government / AICTE Stamp */}
            <div className="w-24 h-24 border-[3px] border-red-700/80 rounded-full flex flex-col items-center justify-center p-1 transform rotate-[-15deg] opacity-80 mb-2">
              <div className="w-full h-full border border-red-700/60 rounded-full flex flex-col items-center justify-center text-center leading-none">
                <span className="text-[8px] font-bold text-red-700 tracking-tighter">GOVT. OF INDIA</span>
                <span className="text-[7px] text-red-700 font-bold mt-1">RECOGNIZED</span>
                <span className="text-[6px] text-red-700 mt-1">#INX-AICTE-99X</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ISO 9001:2015 Certified</p>
          </div>

          <div className="text-right">
            <div className="w-40 border-b border-gray-400 mb-2 inline-block relative">
              {/* Fake signature image */}
              <div className="absolute bottom-1 right-2 font-serif text-3xl text-indigo-900 italic transform -rotate-6">R. Sharma</div>
            </div>
            <p className="font-bold text-right">Authorized Signatory</p>
            <p className="text-sm text-gray-600 text-right">Director of Programs, InterNexa Labs</p>
          </div>
        </div>

        {/* Footer/QR */}
        <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400">This is a system generated document. No physical signature is required.</p>
          {/* Fake QR Code */}
          <div className="w-16 h-16 border-4 border-black flex flex-wrap p-1">
             <div className="w-1/2 h-1/2 bg-black"></div>
             <div className="w-1/2 h-1/2 bg-white"></div>
             <div className="w-1/2 h-1/2 bg-white"></div>
             <div className="w-1/2 h-1/2 bg-black"></div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          @page { margin: 0; size: A4; }
        }
      `}} />
    </div>
  );
}
