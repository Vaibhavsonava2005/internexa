"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ResumePreview() {
  const { user } = useUser();
  const params = useParams();
  const templateId = params.id as string;

  useEffect(() => {
    // Give it a second to render fonts before triggering print
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen text-black font-sans max-w-4xl mx-auto p-12 shadow-2xl my-8 border">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{user.fullName || "Student Name"}</h1>
        <p className="text-sm text-slate-600 flex justify-center gap-4">
          <span>{user.primaryEmailAddress?.emailAddress || "email@example.com"}</span>
          <span>•</span>
          <span>github.com/student</span>
          <span>•</span>
          <span>linkedin.com/in/student</span>
        </p>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">Education</h2>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">Top Tier University</h3>
            <p className="text-slate-700 italic">Bachelor of Technology in Computer Science</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Graduation: 2026</p>
            <p className="text-sm text-slate-600">CGPA: 9.0/10</p>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">Experience</h2>
        
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">InterNexa Labs</h3>
              <p className="text-slate-700 font-medium">Software Engineering Intern</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">Jan 2026 - Present</p>
            </div>
          </div>
          <ul className="list-disc list-outside ml-5 text-slate-700 space-y-1 text-sm">
            <li>Developed and maintained full-stack web applications using React, Next.js, and Node.js.</li>
            <li>Optimized database queries in Supabase, reducing load times by 40%.</li>
            <li>Collaborated with cross-functional teams to deliver an applicant tracking system.</li>
          </ul>
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">Projects</h2>
        
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold">Real-time Task Manager</h3>
            <span className="text-sm italic">React, Socket.io, Express, MongoDB</span>
          </div>
          <ul className="list-disc list-outside ml-5 text-slate-700 space-y-1 text-sm">
            <li>Built a real-time collaborative task management tool supporting 500+ concurrent users.</li>
            <li>Implemented secure JWT authentication and role-based access control.</li>
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">Technical Skills</h2>
        <ul className="text-sm text-slate-700 space-y-2">
          <li><span className="font-bold">Languages:</span> JavaScript, TypeScript, Python, Java, C++</li>
          <li><span className="font-bold">Frameworks:</span> React, Next.js, Node.js, Express, Tailwind CSS</li>
          <li><span className="font-bold">Tools & Databases:</span> Git, Docker, MongoDB, PostgreSQL, Supabase</li>
        </ul>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .my-8 { margin: 0; }
          .shadow-2xl { box-shadow: none; border: none; }
          @page { margin: 0.5in; }
        }
      `}} />
    </div>
  );
}
