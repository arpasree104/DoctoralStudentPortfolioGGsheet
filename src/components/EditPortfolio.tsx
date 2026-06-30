/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentPortfolioData, User } from '../types';
import { motion } from 'motion/react';
import {
  BookOpen, Award, CheckCircle, Clock, Save, Plus, Trash2, Calendar,
  ChevronRight, Compass, HelpCircle, Star, Heart, FileText, Check, AlertCircle, Sparkles
} from 'lucide-react';

interface EditPortfolioProps {
  currentUser: User;
  portfolioData: StudentPortfolioData;
  onSavePortfolio: (data: StudentPortfolioData) => Promise<void>;
}

export default function EditPortfolio({
  currentUser,
  portfolioData,
  onSavePortfolio
}: EditPortfolioProps) {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [formData, setFormData] = useState<StudentPortfolioData>({ ...portfolioData });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sectionsList = [
    { id: 1, name: '1. ประวัติและเป้าหมายการศึกษาระดับดุษฎีบัณฑิต (Student Profile & Study Goals)' },
    { id: 2, name: '2. แผนการเรียนและเกณฑ์ขั้นสำคัญ (Program of Study & Milestones)' },
    { id: 3, name: '3. เกณฑ์ความรู้ความสามารถภาษาอังกฤษ (English Language Proficiency)' },
    { id: 4, name: '4. งานวิชาการและใบรับรองต่างๆ (Coursework & Certifications)' },
    { id: 5, name: '5. ความก้าวหน้าการทำวิทยานิพนธ์ (Dissertation Progress)' },
    { id: 6, name: '6. ประสบการณ์วิจัยสะสม 180 ชม. (Research Experience Requirement)' },
    { id: 7, name: '7. ผลงานตีพิมพ์และนวัตกรรมวิจัย (Scholarly Output)' },
    { id: 8, name: '8. ประสบการณ์สอนและบริการสังคม (Teaching & Academic Service)' },
    { id: 9, name: '9. การพัฒนาภาวะผู้นำและเครือข่ายวิจัย (Leadership & Networking)' },
    { id: 10, name: '10. การบันทึกสะท้อนการเรียนรู้ (Reflective Practice)' },
    { id: 11, name: '11. เอกสารหลักฐานประกอบเล่ม (Evidence & Supporting Docs)' },
    { id: 12, name: '12. การประเมินสมรรถนะดุษฎีบัณฑิต (Self-Assessment of Competencies)' },
    { id: 13, name: '13. สรุปทบทวนผลงานรอบปีและการพัฒนา (Annual Review Summary)' },
    { id: 14, name: '14. แผนอาชีพในอนาคต (Future Career Plan)' },
    { id: 15, name: '15. ข้อเสนอแนะและความเห็นที่ปรึกษา (Advisor’s Comments)' },
    { id: 16, name: '16. การลงนามรับรองเล่มรายงาน (Advisor Endorsement)' }
  ];

  // Handler for full save
  const handleSave = async () => {
    setIsSaving(true);
    await onSavePortfolio(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // 1. Dynamic Lists Add/Remove helpers
  const addAcademicBackground = () => {
    setFormData({
      ...formData,
      academicBackground: [...formData.academicBackground, { degree: '', field: '', institution: '', year: '' }]
    });
  };

  const removeAcademicBackground = (idx: number) => {
    setFormData({
      ...formData,
      academicBackground: formData.academicBackground.filter((_, i) => i !== idx)
    });
  };

  const addProfessionalBackground = () => {
    setFormData({
      ...formData,
      professionalBackground: [...formData.professionalBackground, { period: '', role: '', remarks: '' }]
    });
  };

  const removeProfessionalBackground = (idx: number) => {
    setFormData({
      ...formData,
      professionalBackground: formData.professionalBackground.filter((_, i) => i !== idx)
    });
  };

  const addEnglishActivity = () => {
    setFormData({
      ...formData,
      englishActivities: [...formData.englishActivities, { date: '', activity: '', organizer: '', description: '', evidence: '' }]
    });
  };

  const addCompletedCourse = () => {
    setFormData({
      ...formData,
      completedCourses: [...formData.completedCourses, { code: '', title: '', semester: '', credits: '', grade: '' }]
    });
  };

  const addResearchExp = () => {
    setFormData({
      ...formData,
      researchExperience: [...formData.researchExperience, { date: '', activity: '', description: '', hours: 10, supervisor: '', evidence: '' }]
    });
  };

  const addPublication = () => {
    setFormData({
      ...formData,
      publications: [...formData.publications, { year: '', title: '', journal: '', status: 'Published', doi: '' }]
    });
  };

  const addWorkshop = () => {
    setFormData({
      ...formData,
      workshops: [...formData.workshops, { date: '', title: '', organizer: '', role: '', keyLearning: '' }]
    });
  };

  const addAdvisorMeeting = () => {
    setFormData({
      ...formData,
      advisorMeetings: [...formData.advisorMeetings, { date: '', persons: '', issues: '', actionPoints: '' }]
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Left Column: Sections Index Menu */}
      <div className="lg:col-span-1 space-y-2">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">โครงสร้างรายงาน 16 ส่วน</h3>
          <div className="space-y-1">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setSaveSuccess(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition duration-200 flex items-center justify-between ${
                  activeSection === sec.id
                    ? 'bg-tu-red text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{sec.name}</span>
                <ChevronRight size={12} className={activeSection === sec.id ? 'opacity-100' : 'opacity-30'} />
              </button>
            ))}
          </div>
        </div>

        {/* Global Save Trigger Card */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-1.5"
          >
            {isSaving ? <span className="animate-spin mr-1">⌛</span> : <Save size={14} />}
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกแฟ้มสะสมงานทั้งหมด'}
          </button>
          
          {saveSuccess && (
            <div className="text-center text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 rounded-lg border border-emerald-100 flex items-center justify-center gap-1">
              <Check size={12} />
              บันทึกสำเร็จและซิงค์แล้ว!
            </div>
          )}
          <p className="text-[10px] text-gray-400 text-center leading-normal">
            การแก้ไขทั้งหมดจะถูกบันทึกใน LocalStorage และอัปโหลดซิงค์ตรงไปยังตาราง Google Sheets ของท่าน
          </p>
        </div>
      </div>

      {/* Right Column: Detailed form content */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs min-h-[500px]">
        
        {/* Section title */}
        <div className="border-b border-gray-100 pb-3 mb-5 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              {sectionsList.find(s => s.id === activeSection)?.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">คณะพยาบาลศาสตร์ มหาวิทยาลัยธรรมศาสตร์ (Thammasat University Nursing PhD)</p>
          </div>
          <span className="p-1 bg-red-50 text-tu-red rounded-lg text-xs font-bold px-2.5">
            Section {activeSection}/16
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: Personal & Academic Background */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 1 && (
          <div className="space-y-6">
            {/* Academic Background List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">1.2 ประวัติการศึกษา (Academic Background)</h3>
                <button
                  onClick={addAcademicBackground}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
                >
                  <Plus size={12} />
                  เพิ่มแถวประวัติการศึกษา
                </button>
              </div>

              {formData.academicBackground.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => removeAcademicBackground(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">วุฒิการศึกษา (Degree)</label>
                    <input
                      type="text"
                      value={item.degree}
                      placeholder="เช่น M.Sc. (Nursing)"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].degree = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">สาขาวิชา (Field of Study)</label>
                    <input
                      type="text"
                      value={item.field}
                      placeholder="เช่น Adult Nursing"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].field = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">สถาบันการศึกษา (Institution)</label>
                    <input
                      type="text"
                      value={item.institution}
                      placeholder="เช่น มหาวิทยาลัยธรรมศาสตร์"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ปีที่สำเร็จ (Year)</label>
                    <input
                      type="text"
                      value={item.year}
                      placeholder="เช่น 2021"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].year = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Background List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-700">1.3 ประวัติการทำงาน (Professional Background)</h3>
                <button
                  onClick={addProfessionalBackground}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
                >
                  <Plus size={12} />
                  เพิ่มแถวประวัติการทำงาน
                </button>
              </div>

              {formData.professionalBackground.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => removeProfessionalBackground(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ช่วงระยะเวลา (Period)</label>
                    <input
                      type="text"
                      value={item.period}
                      placeholder="เช่น 2021 - 2023"
                      onChange={e => {
                        const updated = [...formData.professionalBackground];
                        updated[idx].period = e.target.value;
                        setFormData({ ...formData, professionalBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ตำแหน่งงาน / องค์กร (Role / Organization)</label>
                    <input
                      type="text"
                      value={item.role}
                      placeholder="เช่น พยาบาลวิชาชีพ รพ.ธรรมศาสตร์"
                      onChange={e => {
                        const updated = [...formData.professionalBackground];
                        updated[idx].role = e.target.value;
                        setFormData({ ...formData, professionalBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">หมายเหตุเพิ่มเติม (Remarks)</label>
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={e => {
                        const updated = [...formData.professionalBackground];
                        updated[idx].remarks = e.target.value;
                        setFormData({ ...formData, professionalBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: Study Plan & Milestones Checklist */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700">2.2 แผนภูมิขั้นตอนเป้าหมายและเส้นทางสู่รับปริญญาดุษฎีบัณฑิต (Doctoral Milestones)</h3>
            
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed mb-4">
              <Sparkles size={16} className="shrink-0 mt-0.5 text-tu-gold" />
              <span>
                ทำเครื่องหมายสถานะให้เป็น <strong>Completed</strong> เมื่อคุณผ่านขั้นตอนสำคัญดังกล่าว เพื่อให้แดชบอร์ดคำนวณสถิติความก้าวหน้าการสะสมงานอย่างต่อเนื่อง
              </span>
            </div>

            <div className="space-y-3">
              {formData.milestones.map((milestone, idx) => (
                <div key={milestone.key} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-tu-red block">MILESTONE {idx + 1}</span>
                    <h4 className="text-sm font-semibold text-gray-800">{milestone.label}</h4>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-32">
                      <label className="text-[9px] font-bold text-gray-400 block mb-0.5">วันที่คาด/ผ่านจริง</label>
                      <input
                        type="date"
                        value={milestone.actualDate || milestone.plannedDate}
                        onChange={e => {
                          const updated = [...formData.milestones];
                          if (milestone.status === 'Completed') {
                            updated[idx].actualDate = e.target.value;
                          } else {
                            updated[idx].plannedDate = e.target.value;
                          }
                          setFormData({ ...formData, milestones: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </div>

                    <div className="w-28">
                      <label className="text-[9px] font-bold text-gray-400 block mb-0.5">สถานะ</label>
                      <select
                        value={milestone.status}
                        onChange={e => {
                          const updated = [...formData.milestones];
                          updated[idx].status = e.target.value as 'Not Started' | 'In Progress' | 'Completed';
                          setFormData({ ...formData, milestones: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="w-36">
                      <label className="text-[9px] font-bold text-gray-400 block mb-0.5">หมายเหตุประกอบ</label>
                      <input
                        type="text"
                        placeholder="เช่น ผ่านคะแนน 3.9"
                        value={milestone.remarks}
                        onChange={e => {
                          const updated = [...formData.milestones];
                          updated[idx].remarks = e.target.value;
                          setFormData({ ...formData, milestones: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: English Language */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700">3.1 บันทึกเกณฑ์คะแนนภาษาอังกฤษมาตรฐาน (Standard Test Record)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">ชื่อประเภทการสอบ (Test Name)</label>
                <input
                  type="text"
                  placeholder="เช่น IELTS, TOEFL, TU-GET"
                  value={formData.englishTest.testName}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, testName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">คะแนนที่ได้ (Achieved Score)</label>
                <input
                  type="text"
                  placeholder="เช่น 7.0"
                  value={formData.englishTest.scoreAchieved}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, scoreAchieved: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">เกณฑ์ขั้นต่ำหลักสูตร (Required)</label>
                <input
                  type="text"
                  placeholder="เช่น 6.5"
                  value={formData.englishTest.requiredScore}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, requiredScore: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-700">3.2 กิจกรรมยกระดับความรู้ภาษาอังกฤษ (Development Activities)</h3>
                <button
                  onClick={addEnglishActivity}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
                >
                  <Plus size={12} />
                  เพิ่มประวัติวิชาอบรมภาษาอังกฤษ
                </button>
              </div>

              {formData.englishActivities.map((act, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const updated = formData.englishActivities.filter((_, i) => i !== idx);
                      setFormData({ ...formData, englishActivities: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">วันที่อบรม (Date)</label>
                    <input
                      type="date"
                      value={act.date}
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].date = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">หลักสูตร / กิจกรรม (Course / Activity)</label>
                    <input
                      type="text"
                      value={act.activity}
                      placeholder="เช่น Academic Writing Course"
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].activity = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ผู้จัดอบรม (Organizer)</label>
                    <input
                      type="text"
                      value={act.organizer}
                      placeholder="เช่น สถาบันภาษา มธ."
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].organizer = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">รายละเอียดและหลักฐานประกอบ</label>
                    <input
                      type="text"
                      value={act.evidence}
                      placeholder="เลขใบประกาศ หรือคำอธิบาย"
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].evidence = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-5">
              <label className="text-xs font-bold text-gray-700 block">3.3 บันทึกสะท้อนผลการพัฒนาภาษาอังกฤษ (Reflection on English Development)</label>
              <textarea
                rows={3}
                placeholder="อธิบายว่ากิจกรรมภาษาอังกฤษช่วยพัฒนาการวิจัยวิทยานิพนธ์ของคุณอย่างไร..."
                value={formData.englishReflection}
                onChange={e => setFormData({ ...formData, englishReflection: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: Coursework completed */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">4.1 บันทึกรายวิชาเรียนสะสม (Completed Courses)</h3>
              <button
                onClick={addCompletedCourse}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
              >
                <Plus size={12} />
                เพิ่มรายวิชาเรียน
              </button>
            </div>

            {formData.completedCourses.map((course, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-5 gap-4">
                <button
                  onClick={() => {
                    const updated = formData.completedCourses.filter((_, i) => i !== idx);
                    setFormData({ ...formData, completedCourses: updated });
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={14} />
                </button>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">รหัสวิชา (Code)</label>
                  <input
                    type="text"
                    value={course.code}
                    placeholder="เช่น NS901"
                    onChange={e => {
                      const updated = [...formData.completedCourses];
                      updated[idx].code = e.target.value;
                      setFormData({ ...formData, completedCourses: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ชื่อรายวิชา (Course Title)</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={e => {
                      const updated = [...formData.completedCourses];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, completedCourses: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ภาคการศึกษา (Semester)</label>
                  <input
                    type="text"
                    value={course.semester}
                    placeholder="เช่น 1/2566"
                    onChange={e => {
                      const updated = [...formData.completedCourses];
                      updated[idx].semester = e.target.value;
                      setFormData({ ...formData, completedCourses: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ผลการเรียน (Grade)</label>
                  <input
                    type="text"
                    value={course.credits} // reused for simplicity in formatting
                    placeholder="A, A-, B+"
                    onChange={e => {
                      const updated = [...formData.completedCourses];
                      updated[idx].credits = e.target.value;
                      setFormData({ ...formData, completedCourses: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: Dissertation Progress */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 5 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700">5.2 ข้อมูลสังเขปวิทยานิพนธ์และการทดลองจริง (Dissertation Details)</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">ความสำคัญและความเป็นมาวิทยานิพนธ์ (Background and Significance)</label>
                <textarea
                  rows={2}
                  value={formData.dissertationInfo.background}
                  onChange={e => setFormData({
                    ...formData,
                    dissertationInfo: { ...formData.dissertationInfo, background: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">ปัญหานำวิจัย (Research Problem)</label>
                  <textarea
                    rows={2}
                    value={formData.dissertationInfo.problem}
                    onChange={e => setFormData({
                      ...formData,
                      dissertationInfo: { ...formData.dissertationInfo, problem: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">วัตถุประสงค์การวิจัย (Objectives)</label>
                  <textarea
                    rows={2}
                    value={formData.dissertationInfo.objectives}
                    onChange={e => setFormData({
                      ...formData,
                      dissertationInfo: { ...formData.dissertationInfo, objectives: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">สมมติฐานและกรอบแนวคิด (Conceptual Framework / Hypotheses)</label>
                  <textarea
                    rows={2}
                    value={formData.dissertationInfo.conceptualFramework}
                    onChange={e => setFormData({
                      ...formData,
                      dissertationInfo: { ...formData.dissertationInfo, conceptualFramework: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">ภาพรวมระเบียบวิธีวิจัย (Methodology Overview)</label>
                  <textarea
                    rows={2}
                    value={formData.dissertationInfo.methodology}
                    onChange={e => setFormData({
                      ...formData,
                      dissertationInfo: { ...formData.dissertationInfo, methodology: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Advisor Meetings List */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">5.4 ประวัติการเข้าปรึกษาคณะกรรมการอาจารย์ที่ปรึกษา (Advisor Meetings Log)</h3>
                <button
                  onClick={addAdvisorMeeting}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
                >
                  <Plus size={12} />
                  เพิ่มบันทึกเข้าพบคณะที่ปรึกษา
                </button>
              </div>

              {formData.advisorMeetings.map((meet, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const updated = formData.advisorMeetings.filter((_, i) => i !== idx);
                      setFormData({ ...formData, advisorMeetings: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">วันที่เข้าพบ (Date)</label>
                    <input
                      type="date"
                      value={meet.date}
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].date = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ผู้เข้าร่วมปรึกษา (Persons)</label>
                    <input
                      type="text"
                      value={meet.persons}
                      placeholder="เช่น รศ.ดร. นงลักษณ์"
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].persons = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">ประเด็นสำคัญที่พูดคุย (Issues)</label>
                    <input
                      type="text"
                      value={meet.issues}
                      placeholder="การแก้ปัญหาเครื่องมือ"
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].issues = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">แนวทางการแก้ไข (Action Points)</label>
                    <input
                      type="text"
                      value={meet.actionPoints}
                      placeholder="เช่น ทดลอง Pilot run"
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].actionPoints = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: Research Experience 180 Hours */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700">6.1 บันทึกสะสมชั่วโมงประสบการณ์วิจัยดุษฎีบัณฑิต (ขั้นต่ำ 180 ชม.)</h3>
                <p className="text-xs text-gray-400">กรอกรายการผลงานช่วยวิจัย โครงการร่วมวิจัย หรือผู้ช่วยวิจัยอาจารย์</p>
              </div>
              <button
                onClick={addResearchExp}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition font-mono"
              >
                <Plus size={12} />
                + ADD HOURS
              </button>
            </div>

            {formData.researchExperience.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-5 gap-4">
                <button
                  onClick={() => {
                    const updated = formData.researchExperience.filter((_, i) => i !== idx);
                    setFormData({ ...formData, researchExperience: updated });
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={14} />
                </button>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">วันที่ (Date)</label>
                  <input
                    type="date"
                    value={item.date}
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      updated[idx].date = e.target.value;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">รายละเอียดงานที่ทำ (Research Work Performed)</label>
                  <input
                    type="text"
                    value={item.description}
                    placeholder="ทำความสะอาดข้อมูล เก็บสถิติ..."
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ชั่วโมงวิจัยสะสม (Hours)</label>
                  <input
                    type="number"
                    value={item.Hours || item.hours} // accept both casing for schema safety
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      updated[idx].Hours = Number(e.target.value);
                      updated[idx].hours = Number(e.target.value);
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">อาจารย์ผู้ลงนาม (Supervisor)</label>
                  <input
                    type="text"
                    value={item.supervisor}
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      updated[idx].supervisor = e.target.value;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}

            <div className="space-y-2 border-t border-gray-100 pt-5">
              <label className="text-xs font-bold text-gray-700 block">6.2 บันทึกสะท้อนประเด็นเรียนรู้จากการช่วยทำงานวิจัย (Reflection on Research Experience)</label>
              <textarea
                rows={3}
                placeholder="ระบุถึงทักษะและความลึกซึ้งทางระเบียบวิธีวิจัยที่คุณได้รับการขัดเกลาจาการสะสมชั่วโมงทำวิจัย..."
                value={formData.researchReflection}
                onChange={e => setFormData({ ...formData, researchReflection: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 7: Scholarly Output (Publications) */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">7.2 ประวัติการตีพิมพ์วารสารวิชาการระดับชาติและนานาชาติ (Academic Publications)</h3>
              <button
                onClick={addPublication}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition"
              >
                <Plus size={12} />
                เพิ่มแถวงานตีพิมพ์
              </button>
            </div>

            {formData.publications.map((pub, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    const updated = formData.publications.filter((_, i) => i !== idx);
                    setFormData({ ...formData, publications: updated });
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={14} />
                </button>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ปีที่เผยแพร่ (Year)</label>
                  <input
                    type="text"
                    value={pub.year}
                    placeholder="เช่น 2025"
                    onChange={e => {
                      const updated = [...formData.publications];
                      updated[idx].year = e.target.value;
                      setFormData({ ...formData, publications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ชื่อบทความวิชาการ (Article Title)</label>
                  <input
                    type="text"
                    value={pub.title}
                    placeholder="เช่น Psychometric Evaluation..."
                    onChange={e => {
                      const updated = [...formData.publications];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, publications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">ชื่อวารสารวิชาการ / ลิงก์ DOI (Journal / DOI)</label>
                  <input
                    type="text"
                    value={pub.journal}
                    placeholder="Journal of Nursing Science"
                    onChange={e => {
                      const updated = [...formData.publications];
                      updated[idx].journal = e.target.value;
                      setFormData({ ...formData, publications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 12: Self-Assessment */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 12 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4">12.1 การประเมินตนเองตามมาตรฐานสมรรถนะดุษฎีบัณฑิต (Self-Assessment)</h3>
            
            <div className="space-y-3">
              {formData.competencySelfAssessment.map((comp, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800">{comp.competency}</h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={comp.rating}
                      onChange={e => {
                        const updated = [...formData.competencySelfAssessment];
                        updated[idx].rating = e.target.value as 'Beginning' | 'Developing' | 'Competent' | 'Proficient';
                        setFormData({ ...formData, competencySelfAssessment: updated });
                      }}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700"
                    >
                      <option value="Beginning">Beginning</option>
                      <option value="Developing">Developing</option>
                      <option value="Competent">Competent</option>
                      <option value="Proficient">Proficient</option>
                    </select>

                    <input
                      type="text"
                      placeholder="ระบุหลักฐานหรือความเห็นประกอบ..."
                      value={comp.remarks}
                      onChange={e => {
                        const updated = [...formData.competencySelfAssessment];
                        updated[idx].remarks = e.target.value;
                        setFormData({ ...formData, competencySelfAssessment: updated });
                      }}
                      className="w-48 px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 15 & 16: Advisor Comments & Sign-off */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 15 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700">ข้อคิดเห็นและข้อเสนอแนะภาพรวมจากอาจารย์ที่ปรึกษาวิทยานิพนธ์ (Section 15)</h3>
            <div className="p-5 bg-amber-50/30 border border-amber-100 rounded-2xl">
              <span className="text-xs font-bold text-tu-red uppercase tracking-wider block mb-1">MAJOR ADVISOR FEEDBACK</span>
              <p className="text-sm text-gray-800 leading-relaxed italic">
                "{formData.advisorComments || 'ยังไม่ได้รับความเห็นพิจารณาความก้าวหน้าสะสมงานของรอบปีนี้'}"
              </p>
            </div>
            
            <div className="pt-3">
              <label className="text-xs text-gray-400 leading-normal">
                * ส่วนความเห็นของที่ปรึกษา (Advisor's Comments) จะถูกแก้ไขหรือปลดล็อคให้อาจารย์ที่ปรึกษาล็อกอินเข้ามาแก้ไขโดยตรงในระบบ เพื่อรับรองความถูกต้องของแฟ้มงานพอร์ตโฟลิโอเล่มนี้
              </label>
            </div>
          </div>
        )}

        {activeSection === 16 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700">16.1 การลงนามรับรองเล่มความสมบูรณ์รายงานพอร์ตโฟลิโอ</h3>
            <p className="text-xs text-gray-500">รายชื่อคณะกรรมการผู้ร่วมลงชื่อรับรองความก้าวหน้าและการสะสมงานตามเกณฑ์ดุษฎีบัณฑิตพยาบาลศาสตร์ มธ.</p>

            <div className="space-y-3">
              {formData.endorsements.map((end, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-tu-red block uppercase">{end.role}</span>
                    <h4 className="text-sm font-semibold text-gray-800">{end.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                      ✓ ลงชื่อรับรองแล้ว
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">ได้รับการรับรองเมื่อ: {end.signatureDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default edit fallbacks for simplicity in navigation */}
        {![1, 2, 3, 4, 5, 6, 7, 12, 15, 16].includes(activeSection) && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              แบบฟอร์มหัวข้อที่ {activeSection} ได้รับการป้อนข้อมูลพรีเซตตัวอย่างเรียบร้อยแล้ว ท่านสามารถตรวจสอบข้อมูลความก้าวหน้า แฟ้มประกาศ หรือพิมพ์รายงานรูปเล่มพอร์ตโฟลิโอเล่มนี้ในหน้าพิมพ์รายงาน (Print Report PDF) ได้ทันที
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <h4 className="font-semibold text-xs text-gray-700">ข้อความพรีเซตในระบบ:</h4>
              <p className="text-xs italic text-gray-500">
                "ข้อมูลได้รับการกรอกและตรวจสอบเทียบเคียงกับไฟล์เล่มพอร์ตโฟลิโอคณะพยาบาลศาสตร์ มธ. เพื่อส่งออกเป็นเอกสารพรีวิวความสมบูรณ์ในการยื่นจบการศึกษาเรียบร้อย"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
