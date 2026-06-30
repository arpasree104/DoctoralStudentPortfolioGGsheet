/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, StudentPortfolioData, Certificate, Activity } from '../types';
import { FileText, Printer, ChevronLeft, MapPin, Sparkles, Star } from 'lucide-react';

interface PrintReportProps {
  currentUser: User;
  portfolioData: StudentPortfolioData;
  certificates: Certificate[];
  activities: Activity[];
  onBack: () => void;
}

export default function PrintReport({
  currentUser,
  portfolioData,
  certificates,
  activities,
  onBack
}: PrintReportProps) {

  // Sum of research experience hours
  const completedHours = portfolioData.researchExperience.reduce((sum, item) => sum + item.hours, 0);

  // Trigger browser printing
  const handlePrint = () => {
    window.print();
  };

  const approvedCerts = certificates.filter(c => c.StudentID === currentUser.StudentID && c.Status === 'APPROVED');
  const approvedActs = activities.filter(a => a.StudentID === currentUser.StudentID && a.Status === 'APPROVED');

  return (
    <div className="space-y-6">
      
      {/* Print Controls Ribbon - Hiden during physical printing via no-print class */}
      <div className="no-print bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-gray-600"
            title="ย้อนกลับหน้าบอร์ด"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h3 className="text-sm font-bold text-gray-800">โหมดพรีวิวก่อนพิมพ์และบันทึก PDF (Print Portfolio Preview)</h3>
            <p className="text-xs text-gray-400">เลย์เอาต์หน้าปก สารบัญ และตารางข้อมูลได้รับการจัดวางแบบเป็นทางการ</p>
          </div>
        </div>
        
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Printer size={15} />
          สั่งพิมพ์รายงาน / บันทึก PDF (Print A4)
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PHYSICAL A4 REPORT STAGED CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white max-w-[850px] mx-auto p-8 sm:p-12 border border-gray-100 rounded-2xl shadow-md space-y-12 select-text text-gray-900 leading-relaxed font-sans">
        
        {/* ========================================== */}
        {/* PAGE 1: OFFICIAL COVER PAGE */}
        {/* ========================================== */}
        <div className="min-h-[1000px] flex flex-col justify-between print-page-break relative pt-10">
          
          {/* Cover Head Banner */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-8 text-tu-red relative overflow-hidden shadow-xs">
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-red-600/5 rounded-full" />
            <h1 className="text-3xl font-extrabold tracking-tight">Faculty of Nursing</h1>
            <h2 className="text-3xl font-extrabold tracking-tight">Thammasat University</h2>
            <p className="text-sm font-bold mt-4 tracking-wide text-red-950 uppercase font-mono">
              Doctor of Philosophy Program in Nursing Science
            </p>
          </div>

          {/* Cover Center Title */}
          <div className="text-center my-10 space-y-4">
            <div className="w-16 h-16 bg-red-50 text-tu-red rounded-full flex items-center justify-center mx-auto mb-2 border border-red-100">
              <span className="font-bold text-2xl">มธ</span>
            </div>
            <h2 className="text-3xl font-extrabold text-tu-red tracking-tight leading-normal">
              Doctoral Student Portfolio
            </h2>
            <div className="w-24 h-1 bg-tu-red mx-auto rounded-full" />
          </div>

          {/* Cover Student Metadata Table */}
          <div className="bg-red-50/25 border border-red-100 rounded-2xl p-6 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <tbody className="divide-y divide-red-100">
                <tr>
                  <td className="py-2.5 font-bold text-gray-500 w-1/3">Student Name</td>
                  <td className="py-2.5 font-semibold text-gray-800">{currentUser.FullName}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">Student ID</td>
                  <td className="py-2.5 font-mono font-semibold text-gray-800">{currentUser.StudentID}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">PhD Program</td>
                  <td className="py-2.5 text-gray-800">{currentUser.Major || 'Doctor of Philosophy Program in Nursing Science'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">Faculty / University</td>
                  <td className="py-2.5 text-gray-800">Faculty of Nursing, Thammasat University</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">Expected Graduation Year</td>
                  <td className="py-2.5 font-semibold text-gray-800">{currentUser.ExpectedGraduationYear || '2027'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">Major Advisor</td>
                  <td className="py-2.5 font-semibold text-gray-800">{currentUser.Advisor || 'รศ.ดร. นงลักษณ์ วิเศษศิลป์'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500">Date of Submission</td>
                  <td className="py-2.5 text-gray-800">{new Date().toLocaleDateString('th-TH')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer gold banner */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-4 rounded-full mt-10" />
        </div>

        {/* ========================================== */}
        {/* PAGE 2: TABLE OF CONTENTS */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <h2 className="text-xl font-bold text-tu-red border-b border-gray-100 pb-2">Table of Contents</h2>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 1. Student Profile & Goals</span>
              <span className="font-mono">Page 3</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 2. Program of Study and Academic Milestones</span>
              <span className="font-mono">Page 4</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 3. English Language Proficiency Requirement</span>
              <span className="font-mono">Page 5</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 4. Coursework and Academic Development</span>
              <span className="font-mono">Page 6</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 5. Research Development and Dissertation Progress</span>
              <span className="font-mono">Page 7</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 6. Research Experience Requirement (180 Hours)</span>
              <span className="font-mono">Page 8</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 7. Scholarly Output & Publications</span>
              <span className="font-mono">Page 9</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 12. Self-Assessment of Doctoral Competencies</span>
              <span className="font-mono">Page 10</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-200 pb-1">
              <span className="font-semibold">Section 15. Advisor's Comments & Endorsements</span>
              <span className="font-mono">Page 11</span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 3: STUDENT PROFILE */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 1</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Student Profile</h2>

          {/* 1.1 Personal info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-tu-red">1.1 Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">FullName</span>
                <span className="font-semibold text-gray-800">{currentUser.FullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">StudentID</span>
                <span className="font-semibold font-mono text-gray-800">{currentUser.StudentID}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">ORCID ID</span>
                <span className="font-semibold font-mono text-gray-800">{currentUser.ORCID || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Line ID</span>
                <span className="font-semibold font-mono text-gray-800">{currentUser.LineID || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 1.2 Academic background table */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-tu-red">1.2 Academic Background</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5">Degree</th>
                  <th className="p-2.5">Field of Study</th>
                  <th className="p-2.5">Institution</th>
                  <th className="p-2.5 text-center">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.academicBackground.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{item.degree}</td>
                    <td className="p-2.5">{item.field}</td>
                    <td className="p-2.5">{item.institution}</td>
                    <td className="p-2.5 text-center font-mono">{item.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 1.3 Professional background table */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-tu-red">1.3 Professional Background</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5 w-1/4">Period</th>
                  <th className="p-2.5">Role / Organization</th>
                  <th className="p-2.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.professionalBackground.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono">{item.period}</td>
                    <td className="p-2.5 font-medium">{item.role}</td>
                    <td className="p-2.5 text-gray-500">{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 4: MILESTONES & TIMELINE */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 2</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Program of Study and Academic Milestones</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-tu-red">2.2 Doctoral Milestones and Timeline</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2">Milestone</th>
                  <th className="p-2 text-center">Planned Date</th>
                  <th className="p-2 text-center">Actual Date</th>
                  <th className="p-2">Remarks</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {portfolioData.milestones.map((milestone) => (
                  <tr key={milestone.key}>
                    <td className="p-2 font-medium">{milestone.label}</td>
                    <td className="p-2 text-center font-mono text-gray-500">{milestone.plannedDate || '-'}</td>
                    <td className="p-2 text-center font-mono text-gray-800 font-semibold">{milestone.actualDate || '-'}</td>
                    <td className="p-2 text-gray-500 italic">{milestone.remarks || '-'}</td>
                    <td className="p-2 text-center font-bold text-[10px]">{milestone.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 5: ENGLISH PROFICIENCY */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 3</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">English Language Proficiency Requirement</h2>

          {/* 3.1 Test Score */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-tu-red">3.1 Record of English Language Test</h3>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Test Name</span>
                <span className="font-bold text-gray-800">{portfolioData.englishTest.testName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Score Achieved</span>
                <span className="font-bold text-emerald-600 font-mono text-sm">{portfolioData.englishTest.scoreAchieved}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Required Score</span>
                <span className="font-mono text-gray-800">{portfolioData.englishTest.requiredScore}</span>
              </div>
            </div>
          </div>

          {/* 3.2 English activities */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-tu-red">3.2 English Development Activities</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5 w-1/5">Date</th>
                  <th className="p-2.5">Activity / Course</th>
                  <th className="p-2.5">Organizer</th>
                  <th className="p-2.5">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.englishActivities.map((act, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono">{act.date}</td>
                    <td className="p-2.5 font-medium">{act.activity}</td>
                    <td className="p-2.5 text-gray-600">{act.organizer}</td>
                    <td className="p-2.5 italic text-gray-500 font-mono">{act.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3.3 reflection */}
          <div className="space-y-2 pt-4">
            <h3 className="text-sm font-bold text-tu-red">3.3 Reflection on English Development</h3>
            <p className="p-4 bg-gray-50/50 rounded-xl text-xs leading-relaxed italic text-gray-700">
              "{portfolioData.englishReflection}"
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 6: COURSEWORK COMPLETED */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 4</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Coursework and Academic Development</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-tu-red">4.1 Courses Completed</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5">Course Code</th>
                  <th className="p-2.5">Course Title</th>
                  <th className="p-2.5 text-center">Semester / Year</th>
                  <th className="p-2.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.completedCourses.map((course, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono font-bold text-tu-red">{course.code}</td>
                    <td className="p-2.5 font-medium">{course.title}</td>
                    <td className="p-2.5 text-center font-mono">{course.semester}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-600">{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Approved academic certificates display */}
          <div className="space-y-3 pt-6">
            <h3 className="text-sm font-bold text-tu-red">4.4 Certifications & Verified Evidences</h3>
            <div className="grid grid-cols-2 gap-4">
              {approvedCerts.map((cert) => (
                <div key={cert.CertID} className="p-3 border border-gray-100 rounded-xl bg-gray-50 text-xs flex gap-3">
                  <img src={cert.ImageURL} className="w-12 h-12 object-cover rounded" alt="Evidence" />
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{cert.Name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">อนุมัติเมื่อ: {cert.Date}</p>
                    <span className="text-[9px] font-mono font-bold text-emerald-600">VERIFIED / APPROVED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 7: DISSERTATION DETAILS */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 5</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Research Development and Dissertation Progress</h2>

          <div className="bg-red-50/25 border border-red-100 p-5 rounded-2xl space-y-4 text-xs">
            <div>
              <span className="text-tu-red font-bold block uppercase mb-1">5.2 Dissertation Title</span>
              <p className="text-gray-900 font-bold leading-normal">
                "{portfolioData.dissertationInfo.title}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-500 font-bold block mb-1">Background and Significance</span>
                <p className="text-gray-700 leading-relaxed text-[11px]">{portfolioData.dissertationInfo.background}</p>
              </div>
              <div>
                <span className="text-gray-500 font-bold block mb-1">Research Problem</span>
                <p className="text-gray-700 leading-relaxed text-[11px]">{portfolioData.dissertationInfo.problem}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-500 font-bold block mb-1">Objectives</span>
                <p className="text-gray-700 leading-relaxed text-[11px]">{portfolioData.dissertationInfo.objectives}</p>
              </div>
              <div>
                <span className="text-gray-500 font-bold block mb-1">Methodology Overview</span>
                <p className="text-gray-700 leading-relaxed text-[11px]">{portfolioData.dissertationInfo.methodology}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 8: RESEARCH EXPERIENCE HOURS */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 6</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Research Experience Requirement</h2>

          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center mb-4 text-xs text-emerald-800">
            <span><strong>เกณฑ์ชั่วโมงวิจัยดุษฎีบัณฑิต:</strong> สะสมงานวิจัยภายใต้ที่ปรึกษาขั้นต่ำ 180 ชั่วโมง</span>
            <span className="text-lg font-bold font-mono text-emerald-700">{completedHours} / 180 ชม. (ผ่าน)</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-tu-red">6.1 Record of Research Experience Hours</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Research Work Performed</th>
                  <th className="p-2.5 text-center">Hours</th>
                  <th className="p-2.5">Supervisor / Advisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.researchExperience.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono">{item.date}</td>
                    <td className="p-2.5 font-medium text-gray-800">{item.description}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">{item.hours}</td>
                    <td className="p-2.5 text-gray-600">{item.supervisor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-sm font-bold text-tu-red">6.2 Reflection on Research Experience</h3>
            <p className="p-4 bg-gray-50/50 rounded-xl text-xs leading-relaxed italic text-gray-700">
              "{portfolioData.researchReflection}"
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 9: SCHOLARLY PUBLICATIONS */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 7</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Scholarly Output</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-tu-red">7.2 Publications</h3>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5 w-1/6">Year</th>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5">Journal / DOI Reference</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.publications.map((pub, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono">{pub.year}</td>
                    <td className="p-2.5 font-semibold text-gray-800">{pub.title}</td>
                    <td className="p-2.5 text-gray-500 font-mono text-[10px]">{pub.journal}</td>
                    <td className="p-2.5 text-center text-emerald-700 font-bold text-[10px]">{pub.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity collages display on print output */}
          <div className="space-y-4 pt-6">
            <h3 className="text-sm font-bold text-tu-red">ความก้าวหน้าทำกิจกรรมและโครงสร้างแผงคอลลาจภาพ</h3>
            <div className="grid grid-cols-2 gap-4">
              {approvedActs.map((act) => (
                <div key={act.ActivityID} className="p-4 border border-gray-100 rounded-xl bg-gray-50 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 leading-snug">{act.Title}</h4>
                    <span className="text-[9px] font-bold text-emerald-600 font-mono">APPROVED</span>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{act.Description}</p>
                  
                  <div className="grid grid-cols-3 gap-1">
                    {act.ImagesURL.map((url, i) => (
                      <img key={i} src={url} className="h-12 w-full object-cover rounded" alt="Evidence Collage" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 10: COMPETENCY SELF-ASSESSMENT */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-6 pt-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 12</span>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Self-Assessment of Doctoral Competencies</h2>

          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50 font-bold border-b border-gray-200">
                  <th className="p-2.5">Competency Area</th>
                  <th className="p-2.5 text-center">Self-Rating Score</th>
                  <th className="p-2.5">Evidence / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioData.competencySelfAssessment.map((comp, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{comp.competency}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-600">{comp.rating}</td>
                    <td className="p-2.5 text-gray-500 italic">{comp.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAGE 11: ADVISOR COMMENTS & ENDORSEMENTS SIGN-OFF */}
        {/* ========================================== */}
        <div className="min-h-[1000px] print-page-break space-y-10 pt-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red font-mono">Section 15 & 16</span>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Advisor Comments and Sign-off</h2>
          </div>

          {/* 15. Comments Box */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-tu-red">15. Major Advisor’s Detailed Comments</h3>
            <div className="p-6 border border-amber-100 bg-amber-50/20 rounded-2xl text-xs leading-relaxed italic text-gray-800">
              "{portfolioData.advisorComments || 'อรพรรณเป็นดุษฎีบัณฑิตที่มีศักยภาพสูงมาก รักษาเกณฑ์และระเบียบการเรียนอย่างสม่ำเสมอ แผนวิจัยมีความเฉียบคมในการช่วยเหลือผู้สูงวัยและผู้ป่วยในสังคมไทย มีความก้าวหน้ารวดเร็วกว่าเกณฑ์มาตรฐาน ดับเบิ้ลบลายด์ทดลองเป็นไปตามแผนการ'}"
            </div>
          </div>

          {/* 16. Committee Sign-off blocks */}
          <div className="space-y-6 pt-10">
            <h3 className="text-sm font-bold text-tu-red text-center">16. Advisor / Committee Endorsement Block</h3>
            
            <div className="grid grid-cols-2 gap-10 text-xs pt-6">
              {portfolioData.endorsements.map((end, i) => (
                <div key={i} className="text-center space-y-2 border-t border-gray-100 pt-6">
                  <div className="h-10 flex items-center justify-center">
                    <span className="font-mono text-gray-300 italic">Signed Electronically</span>
                  </div>
                  <span className="font-bold text-gray-800 block">{end.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium block">({end.role})</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold inline-block font-mono">
                    APPROVED: {end.signatureDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
