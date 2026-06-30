/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Certificate, Activity } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Award, Clock, CheckCircle2, XCircle, MessageSquare, GraduationCap, ChevronRight, FileText, Check, AlertTriangle } from 'lucide-react';

interface AdvisorPanelProps {
  currentUser: User;
  students: User[];
  certificates: Certificate[];
  activities: Activity[];
  onVerifyCertificate: (certId: string, status: 'APPROVED' | 'REJECTED', feedback: string) => Promise<void>;
  onVerifyActivity: (actId: string, status: 'APPROVED' | 'REJECTED', feedback: string) => Promise<void>;
}

export default function AdvisorPanel({
  currentUser,
  students,
  certificates,
  activities,
  onVerifyCertificate,
  onVerifyActivity
}: AdvisorPanelProps) {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'certs' | 'activities'>('certs');
  
  // Feedback states
  const [feedbackText, setFeedbackText] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);

  // Filter students under this Advisor's supervision
  const myStudents = students.filter(
    s => s.Advisor === currentUser.FullName || s.CoAdvisor === currentUser.FullName || s.Role === 'STUDENT'
  );

  // Default to selecting the first student for convenient overview if none is selected
  const activeStudent = selectedStudent || myStudents[0];

  const handleVerifyCert = async (certId: string, status: 'APPROVED' | 'REJECTED') => {
    setActingId(certId);
    await onVerifyCertificate(certId, status, feedbackText);
    setFeedbackText('');
    setActingId(null);
  };

  const handleVerifyAct = async (actId: string, status: 'APPROVED' | 'REJECTED') => {
    setActingId(actId);
    await onVerifyActivity(actId, status, feedbackText);
    setFeedbackText('');
    setActingId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Student list sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">นักศึกษาในความดูแลของท่าน</h3>
          
          <div className="space-y-1.5">
            {myStudents.map((stud) => (
              <button
                key={stud.UserID}
                onClick={() => {
                  setSelectedStudent(stud);
                  setFeedbackText('');
                }}
                className={`w-full text-left p-3 rounded-xl transition duration-200 flex items-center gap-3 border ${
                  activeStudent?.UserID === stud.UserID
                    ? 'bg-red-50/50 border-red-100 text-tu-red'
                    : 'border-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <img
                  src={stud.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                  alt={stud.FullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs truncate">{stud.FullName}</h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate">ID: {stud.StudentID}</p>
                </div>
              </button>
            ))}

            {myStudents.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">ไม่พบนักศึกษาที่ผูกมัดชื่อท่านในประวัติ</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Review Panel */}
      <div className="lg:col-span-3 space-y-6">
        {activeStudent ? (
          <>
            {/* Student Brief Demographics Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-5">
              <img
                src={activeStudent.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                alt={activeStudent.FullName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-red-50"
              />
              <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900">{activeStudent.FullName}</h3>
                  <span className="text-[10px] font-mono font-semibold bg-red-50 text-tu-red px-2 py-0.5 rounded-full inline-block">
                    รหัสนักศึกษา: {activeStudent.StudentID}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-normal line-clamp-1 italic">
                  โครงสร้างวิทยานิพนธ์: "{activeStudent.ThesisTitle || 'ไม่ได้กำหนดหัวข้อวิทยานิพนธ์'}"
                </p>
                <div className="flex justify-center sm:justify-start gap-4 text-[11px] text-gray-400 font-medium">
                  <span>Line ID: {activeStudent.LineID || 'N/A'}</span>
                  <span>Expected Grad: {activeStudent.ExpectedGraduationYear || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Sub-tab selection */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('certs')}
                className={`flex items-center gap-2 px-6 py-2.5 border-b-2 font-medium text-xs transition-all duration-200 ${
                  activeTab === 'certs'
                    ? 'border-tu-red text-tu-red font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Award size={14} />
                ตรวจสอบใบประกาศนียบัตร ({certificates.filter(c => c.StudentID === activeStudent.StudentID && c.Status === 'PENDING').length} รออนุมัติ)
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-2 px-6 py-2.5 border-b-2 font-medium text-xs transition-all duration-200 ${
                  activeTab === 'activities'
                    ? 'border-tu-red text-tu-red font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Clock size={14} />
                ตรวจสอบประวัติทำกิจกรรม ({activities.filter(a => a.StudentID === activeStudent.StudentID && a.Status === 'PENDING').length} รออนุมัติ)
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* CERTIFICATE VERIFICATION TAB */}
              {activeTab === 'certs' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {certificates
                      .filter(c => c.StudentID === activeStudent.StudentID)
                      .map((cert) => (
                        <div key={cert.CertID} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div className="relative h-44 bg-gray-50">
                            <img src={cert.ImageURL} alt={cert.Name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                cert.Status === 'APPROVED'
                                  ? 'bg-emerald-500 text-white'
                                  : cert.Status === 'REJECTED'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-amber-500 text-white'
                              }`}>
                                {cert.Status}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-bold text-tu-red tracking-wider font-mono">
                                {cert.Category}
                              </span>
                              <h4 className="font-semibold text-xs text-gray-800 leading-snug">{cert.Name}</h4>
                              <p className="text-[10px] text-gray-400">วันที่ยื่นเรื่อง: {cert.Date}</p>
                            </div>

                            {cert.Status === 'PENDING' ? (
                              <div className="space-y-3 pt-3 border-t border-gray-50">
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">ความเห็นหรือฟีดแบคของอาจารย์ (Advisor Comment)</label>
                                  <input
                                    type="text"
                                    placeholder="เช่น เอกสารประเมินเรียบร้อยดีมาก..."
                                    value={actingId === cert.CertID ? feedbackText : ''}
                                    onChange={e => {
                                      setActingId(cert.CertID);
                                      setFeedbackText(e.target.value);
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleVerifyCert(cert.CertID, 'APPROVED')}
                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                                  >
                                    อนุมัติใบประกาศ
                                  </button>
                                  <button
                                    onClick={() => handleVerifyCert(cert.CertID, 'REJECTED')}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg transition"
                                  >
                                    ให้แก้ไข
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                                <span className="font-bold text-gray-800">ฟีดแบคที่ระบุแล้ว: </span>
                                <p className="italic">"{cert.Feedback || 'ไม่มีความเห็นเพิ่มเติม'}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    {certificates.filter(c => c.StudentID === activeStudent.StudentID).length === 0 && (
                      <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <AlertTriangle className="mx-auto text-gray-300 mb-2" size={32} />
                        <p className="text-sm text-gray-500 font-medium">ไม่มีใบประกาศนียบัตรสะสมที่ยื่นขออนุมัติ</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ACTIVITY PROGRESS TAB */}
              {activeTab === 'activities' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-5">
                    {activities
                      .filter(a => a.StudentID === activeStudent.StudentID)
                      .map((act) => (
                        <div key={act.ActivityID} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Collage side */}
                          <div>
                            <span className="text-[9px] uppercase font-bold text-tu-red tracking-wider block mb-2">COLLAGE EVIDENCE</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {act.ImagesURL.map((url, i) => (
                                <img key={i} src={url} alt="act" className="w-full h-16 object-cover rounded-lg" />
                              ))}
                            </div>
                          </div>

                          {/* details side */}
                          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-gray-900">{act.Title}</h4>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  act.Status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {act.Status}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400">วันที่ดำเนินเรื่อง: {act.Date}</p>
                              <p className="text-xs text-gray-600 leading-relaxed">{act.Description}</p>
                            </div>

                            {act.Status === 'PENDING' ? (
                              <div className="space-y-3 pt-3 border-t border-gray-50">
                                <div>
                                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">ความเห็นหรือฟีดแบคกิจกรรม</label>
                                  <input
                                    type="text"
                                    placeholder="เช่น ขอชื่นชมในการลงพื้นที่ครั้งนี้..."
                                    value={actingId === act.ActivityID ? feedbackText : ''}
                                    onChange={e => {
                                      setActingId(act.ActivityID);
                                      setFeedbackText(e.target.value);
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleVerifyAct(act.ActivityID, 'APPROVED')}
                                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                                  >
                                    อนุมัติกิจกรรม
                                  </button>
                                  <button
                                    onClick={() => handleVerifyAct(act.ActivityID, 'REJECTED')}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg transition"
                                  >
                                    ให้แก้ไข
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                                <span className="font-bold text-gray-800">ความเห็นอาจารย์: </span>
                                <p className="italic">"{act.Feedback || 'อนุมัติเรียบร้อย'}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                    {activities.filter(a => a.StudentID === activeStudent.StudentID).length === 0 && (
                      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <AlertTriangle className="mx-auto text-gray-300 mb-2" size={32} />
                        <p className="text-sm text-gray-500 font-medium">ไม่มีประวัติกิจกรรมสะสมงานความก้าวหน้าที่ยื่นขออนุมัติ</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-xs">
            <Users className="mx-auto text-gray-300 mb-3" size={40} />
            <h3 className="font-bold text-gray-800 text-sm">ไม่พบนักศึกษาในความดูแลในระบบ</h3>
            <p className="text-xs text-gray-500 mt-1">กรุณากำหนดให้ชื่อของท่านเป็นที่ปรึกษาในเมนู Demographics ของนักศึกษา</p>
          </div>
        )}
      </div>
    </div>
  );
}
