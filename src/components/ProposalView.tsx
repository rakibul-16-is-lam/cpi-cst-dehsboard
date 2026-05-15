import React from 'react';
import { motion } from 'motion/react';
import { FileText, Printer, ChevronLeft, Download, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProposalViewProps {
  onClose: () => void;
}

export const ProposalView = ({ onClose }: ProposalViewProps) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar print:p-0"
    >
      {/* Action Toolbar - Hidden on print */}
      <div className="sticky top-0 z-50 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={18} />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/30"
          >
            <Printer size={18} />
            Print Proposal
          </button>
        </div>
      </div>

      {/* Proposal Document */}
      <div className="max-w-[850px] mx-auto my-8 p-12 bg-white dark:bg-white/[0.02] shadow-2xl rounded-2xl border border-slate-100 dark:border-white/5 print:shadow-none print:border-none print:m-0 print:p-8">
        
        {/* Letterhead */}
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-blue-600 tracking-tighter">RakibAutomation BD Ltd.</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Excellence in Digital Engineering</p>
            <div className="flex flex-col gap-1 mt-4 text-[11px] font-medium text-slate-600 dark:text-slate-400">
               <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> Chattogram, Bangladesh</div>
               <div className="flex items-center gap-2"><Phone size={12} className="text-blue-500" /> +880-XXXXXXXXXX</div>
               <div className="flex items-center gap-2"><Mail size={12} className="text-blue-500" /> rakib.47g@gmail.com</div>
            </div>
          </div>
          <div className="text-right">
             <div className="bg-blue-600 text-white px-4 py-4 rounded-2xl inline-block mb-4">
                <FileText size={42} strokeWidth={1} />
             </div>
             <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Formal Proposal</p>
          </div>
        </div>

        {/* Date & Destination */}
        <div className="mb-10 text-slate-800 dark:text-slate-200">
          <p className="font-bold text-sm mb-6">Date: <span className="font-medium">{currentDate}</span></p>
          <div className="space-y-1">
            <p className="font-black text-sm uppercase">To,</p>
            <p className="font-black text-lg">The Honorable Principal</p>
            <p className="font-bold text-blue-600 uppercase tracking-widest text-xs">Chattogram Polytechnic Institute (CPI)</p>
            <p className="text-sm font-medium">Chattogram, Bangladesh</p>
          </div>
        </div>

        {/* Subject */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-600 mb-10">
           <p className="font-black text-blue-900 dark:text-blue-200 italic">
             Subject: Proposal for Modernization of CST Department via "Digital Dashboard Ecosystem" and High-Resolution Smart Display.
           </p>
        </div>

        {/* Salutation */}
        <p className="text-[15px] font-medium mb-6 text-slate-700 dark:text-slate-300">
          Respected Sir/Madam,
          <br /><br />
          With due respect, we would like to propose the supply and installation of a professional digital communication ecosystem, including a high-quality Smart LED Display, specifically optimized for the <strong>Computer Science & Technology (CST) Department</strong> of Chattogram Polytechnic Institute (CPI).
        </p>

        {/* Purpose */}
        <div className="mb-10">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600" /> Key Objectives
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               "Interactive Classroom Teaching & Real-time Presentations",
               "Seminar and Workshop Event Visualization",
               "Real-time Departmental Dashboard & Digital Notice Board",
               "AI-Powered Educational Video Streaming & Analytics"
             ].map((text, i) => (
               <li key={i} className="flex gap-3 text-[14px] text-slate-600 dark:text-slate-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                 {text}
               </li>
             ))}
          </ul>
        </div>

        {/* Software Solution */}
        <div className="mb-10 p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-slate-50 dark:bg-white/[0.01]">
          <h3 className="text-lg font-black text-blue-600 mb-3 uppercase tracking-wider">CST Digital Dashboard v2.0.4</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            The heart of this modernization is the custom-built CST Dashboard, which features a real-time student leaderboard, animated notices, attendance tracking visualizations, and a live multimedia feed to inspire and engage CST students.
          </p>
        </div>

        {/* Hardware Specifications */}
        <div className="mb-10">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Proposed Hardware (Smart LED Display)</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { label: "Display Type", value: "4K UHD Smart LED" },
               { label: "Resolution", value: "3840 × 2160 (Native)" },
               { label: "Connectivity", value: "HDMI, USB, High-Speed WiFi" },
               { label: "Specialty", value: "CST Dashboard Optimized" }
             ].map((spec, i) => (
               <div key={i} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                 <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{spec.value}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-12">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Estimated Investment</h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 font-black uppercase text-[11px] tracking-widest">
                <tr>
                  <th className="p-4">Package Option</th>
                  <th className="p-4">Estimated Budget (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Option A: 43” Productivity Setup</td>
                  <td className="p-4 font-mono font-black text-blue-600">৳35,000 – ৳50,000</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Option B: 50” Departmental Standard</td>
                  <td className="p-4 font-mono font-black text-blue-600">৳50,000 – ৳70,000</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Option C: 55” Premium Visualization</td>
                  <td className="p-4 font-mono font-black text-blue-600">৳65,000 – ৳90,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">Professional Services</h4>
              <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> No-Cost Calibration & Installation</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Wall Mount Structural Setup</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Staff Training & Configuration</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> 1–2 Year Post-Install Support</li>
              </ul>
           </div>
           <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">Delivery Commitment</h4>
              <p className="text-[14px] text-slate-600 dark:text-slate-400 italic">
                Project deployment to be completed within 3–5 working days following formal administrative approval.
              </p>
           </div>
        </div>

        {/* Signature */}
        <div className="flex justify-between items-end mt-20">
           <div className="text-center">
              <div className="w-40 h-[1px] bg-slate-300 mb-2 mx-auto" />
              <p className="text-[12px] font-black uppercase text-slate-400">Official Seal</p>
           </div>
           <div className="text-right">
              <p className="text-[14px] font-black text-slate-800 dark:text-white">Rakibul Islam</p>
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Managing Director</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">RakibAutomation BD Ltd.</p>
              <div className="h-12" />
              <div className="w-48 h-[1px] bg-slate-800 dark:bg-white mb-2 ml-auto" />
              <p className="text-[10px] font-black uppercase text-slate-400">Authorized Signature</p>
           </div>
        </div>

        {/* Footer print note */}
        <p className="mt-12 text-[9px] text-center text-slate-400 uppercase tracking-[0.5em] print:hidden">
          Generated via CPI Digital Dashboard Infrastructure
        </p>
      </div>
      
      {/* Visual background elements print:hidden */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.02),transparent)] opacity-50 print:hidden" />
    </motion.div>
  );
};
