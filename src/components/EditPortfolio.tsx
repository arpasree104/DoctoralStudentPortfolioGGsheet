/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentPortfolioData, User, ConfigOption, Certificate } from '../types';
import { motion } from 'motion/react';
import FileUploader from './FileUploader';
import DatePickerField from './DatePickerField';
import {
  BookOpen, Award, CheckCircle, Clock, Save, Plus, Trash2, Calendar,
  ChevronRight, Compass, HelpCircle, Star, Heart, FileText, Check, AlertCircle, Sparkles, Info
} from 'lucide-react';

interface EditPortfolioProps {
  currentUser: User;
  portfolioData: StudentPortfolioData;
  onSavePortfolio: (data: StudentPortfolioData) => Promise<void>;
  configOptions: ConfigOption[];
  certificates: Certificate[];
}

export default function EditPortfolio({
  currentUser,
  portfolioData,
  onSavePortfolio,
  configOptions,
  certificates
}: EditPortfolioProps) {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [formData, setFormData] = useState<StudentPortfolioData>({ ...portfolioData });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setFormData({ ...portfolioData });
  }, [portfolioData]);

  const sectionsList = [
    { id: 1, name: '1. Student Profile & Study Goals' },
    { id: 2, name: '2. Program of Study & Milestones' },
    { id: 3, name: '3. English Language Proficiency' },
    { id: 4, name: '4. Coursework & Certifications' },
    { id: 5, name: '5. Dissertation Progress' },
    { id: 6, name: '6. Research Experience Requirement (180h)' },
    { id: 7, name: '7. Scholarly Output & Publications' },
    { id: 8, name: '8. Teaching & Academic Service' },
    { id: 9, name: '9. Leadership & Networking' },
    { id: 10, name: '10. Reflective Practice' },
    { id: 11, name: '11. Supporting Evidence & Docs' },
    { id: 12, name: '12. Self-Assessment of Competencies' },
    { id: 13, name: '13. Annual Review Summary' },
    { id: 14, name: '14. Future Career Plan' },
    { id: 15, name: '15. Advisor’s Feedback & Comments' },
    { id: 16, name: '16. Advisor Sign-off & Endorsement' }
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

  const addKeyLearning = () => {
    setFormData({
      ...formData,
      keyLearnings: [...(formData.keyLearnings || []), { course: '', keyLearning: '', application: '' }]
    });
  };

  const addDissertationProgress = () => {
    setFormData({
      ...formData,
      dissertationProgress: [...(formData.dissertationProgress || []), { activity: '', date: '', progress: '', evidence: '' }]
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
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Portfolio 16 Sections</h3>
          <div className="space-y-1">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setSaveSuccess(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition duration-200 flex items-center justify-between cursor-pointer ${
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
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSaving ? <span className="animate-spin mr-1">⌛</span> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save All Sections'}
          </button>
          
          {saveSuccess && (
            <div className="text-center text-xs text-emerald-600 font-semibold bg-emerald-50 py-1.5 rounded-lg border border-emerald-100 flex items-center justify-center gap-1">
              <Check size={12} />
              Saved & Synced Successfully!
            </div>
          )}
          <p className="text-[10px] text-gray-400 text-center leading-normal">
            All updates are safely stored in LocalStorage and synced automatically to Google Sheets.
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
            <p className="text-xs text-gray-400 mt-0.5">Faculty of Nursing, Thammasat University (Nursing PhD)</p>
          </div>
          <span className="p-1 bg-red-50 text-tu-red rounded-lg text-xs font-bold px-2.5">
            Section {activeSection}/16
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: Personal & Academic Background */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 1 && (
          <div className="space-y-6 text-xs text-gray-700">
            {/* Academic Background List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">1.2 Academic Background</h3>
                <button
                  onClick={addAcademicBackground}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Academic Background Row
                </button>
              </div>

              {formData.academicBackground.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => removeAcademicBackground(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Degree Name</label>
                    <input
                      type="text"
                      value={item.degree}
                      placeholder="e.g., M.Sc. (Nursing)"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].degree = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={item.field}
                      placeholder="e.g., Adult Nursing"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].field = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Institution</label>
                    <input
                      type="text"
                      value={item.institution}
                      placeholder="e.g., Thammasat University"
                      onChange={e => {
                        const updated = [...formData.academicBackground];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, academicBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={item.year}
                      placeholder="e.g., 2021"
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
                <h3 className="text-sm font-bold text-gray-700">1.3 Professional Background</h3>
                <button
                  onClick={addProfessionalBackground}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Professional Background Row
                </button>
              </div>

              {formData.professionalBackground.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => removeProfessionalBackground(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Employment Period</label>
                    <input
                      type="text"
                      value={item.period}
                      placeholder="e.g., 2021 - 2023"
                      onChange={e => {
                        const updated = [...formData.professionalBackground];
                        updated[idx].period = e.target.value;
                        setFormData({ ...formData, professionalBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Position / Organization</label>
                    <input
                      type="text"
                      value={item.role}
                      placeholder="e.g., Registered Nurse, Thammasat Hospital"
                      onChange={e => {
                        const updated = [...formData.professionalBackground];
                        updated[idx].role = e.target.value;
                        setFormData({ ...formData, professionalBackground: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Additional Remarks</label>
                    <input
                      type="text"
                      value={item.remarks}
                      placeholder="e.g., Primary emergency ward"
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
          <div className="space-y-8 text-xs text-gray-700">
            {/* Sub-navigation for Section 2 */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-6">
              
              {/* 2.1 Program of Study */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <BookOpen size={16} className="text-tu-red" />
                      <span>ข้อ 2.1 Program of Study (หลักสูตรการศึกษา)</span>
                    </h4>
                    <p className="text-[10px] text-gray-400">กรุณาระบุรายละเอียดชุดวิชา แผนการศึกษา และสถานะรายวิชาที่เรียน</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold text-gray-500">รูปแบบแผนการศึกษา:</label>
                    <input
                      type="text"
                      value={formData.programOfStudyName || 'ชุด 1'}
                      onChange={e => setFormData({ ...formData, programOfStudyName: e.target.value })}
                      placeholder="e.g., ชุด 1 หรือ แผน 1.1"
                      className="px-3 py-1 bg-white border border-gray-250 rounded-lg text-xs font-bold font-mono focus:outline-tu-red w-32"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {(formData.programCourses || []).map((course, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-150 rounded-xl relative grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <button
                        onClick={() => {
                          const updated = (formData.programCourses || []).filter((_, i) => i !== idx);
                          setFormData({ ...formData, programCourses: updated });
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="Remove Course"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Semester/Year</label>
                        <input
                          type="text"
                          value={course.semester}
                          placeholder="e.g., 1/2025"
                          onChange={e => {
                            const updated = [...(formData.programCourses || [])];
                            updated[idx].semester = e.target.value;
                            setFormData({ ...formData, programCourses: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Course Code</label>
                        <input
                          type="text"
                          value={course.code}
                          placeholder="e.g., NS802"
                          onChange={e => {
                            const updated = [...(formData.programCourses || [])];
                            updated[idx].code = e.target.value;
                            setFormData({ ...formData, programCourses: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Course Title (ชื่อวิชาภาษาอังกฤษ)</label>
                        <input
                          type="text"
                          value={course.title}
                          placeholder="e.g., Advanced Gerontology"
                          onChange={e => {
                            const updated = [...(formData.programCourses || [])];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, programCourses: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Credits</label>
                        <input
                          type="text"
                          value={course.credits}
                          placeholder="3"
                          onChange={e => {
                            const updated = [...(formData.programCourses || [])];
                            updated[idx].credits = e.target.value;
                            setFormData({ ...formData, programCourses: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-center font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Status</label>
                        <select
                          value={course.status}
                          onChange={e => {
                            const updated = [...(formData.programCourses || [])];
                            updated[idx].status = e.target.value as 'Not Started' | 'In Progress' | 'Completed';
                            setFormData({ ...formData, programCourses: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-gray-700"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const updated = [...(formData.programCourses || []), { semester: '', code: '', title: '', credits: '', status: 'Not Started' as const }];
                      setFormData({ ...formData, programCourses: updated });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-dashed border-gray-300 hover:border-tu-red hover:text-tu-red text-gray-500 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>เพิ่มแถววิชาเรียน (Add Course Row)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 2.2 Doctoral Milestones Timeline */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Calendar size={16} className="text-tu-red" />
                  <span>ข้อ 2.2 Doctoral Milestones Timeline (กรอบเวลาความก้าวหน้าตามเกณฑ์)</span>
                </h4>
                <p className="text-[10px] text-gray-400">กรุณาระบุสถานะ แผนการดำเนินการ และวันที่จริงของเกณฑ์โครงสร้างหลักสูตรพยาบาลศาสตรดุษฎีบัณฑิต</p>
              </div>
              
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed mb-4">
                <Sparkles size={16} className="shrink-0 mt-0.5 text-tu-gold" />
                <span>
                  ทำเครื่องหมายสถานะเป็น <strong>Completed</strong> เมื่อคุณบรรลุเงื่อนไขนั้นๆ เพื่อให้ระบบประมวลผลความก้าวหน้าบนแดชบอร์ดอย่างถูกต้อง
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
                      <div className="w-40">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Planned/Actual Date</label>
                        <DatePickerField
                          value={milestone.actualDate || milestone.plannedDate}
                          onChange={val => {
                            const updated = [...formData.milestones];
                            if (milestone.status === 'Completed') {
                              updated[idx].actualDate = val;
                            } else {
                              updated[idx].plannedDate = val;
                            }
                            setFormData({ ...formData, milestones: updated });
                          }}
                          className="!py-1 !px-2 text-xs !rounded-lg"
                        />
                      </div>

                      <div className="w-28">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Status</label>
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
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Remarks</label>
                        <input
                          type="text"
                          placeholder="e.g., Passed first trial"
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

            {/* 2.3 Personal Learning and Development Plan */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 mt-6">
              <div className="border-b border-gray-200 pb-2">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Compass size={16} className="text-tu-red" />
                  <span>ข้อ 2.3 Personal Learning and Development Plan (แผนพัฒนาศักยภาพส่วนบุคคล)</span>
                </h4>
                <p className="text-[10px] text-gray-400">กรุณาระบุเป้าหมายการพัฒนาสมรรถนะการวิจัยและความเป็นนักวิชาการส่วนบุคคล ตลอดแผนการศึกษา</p>
              </div>

              <div className="space-y-4">
                {(formData.learningPlans || []).map((plan, idx) => (
                  <div key={idx} className="p-4 bg-white border border-gray-150 rounded-xl relative space-y-3">
                    <button
                      onClick={() => {
                        const updated = (formData.learningPlans || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, learningPlans: updated });
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove Competency Goal"
                    >
                      <Trash2 size={13} />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Competency Area (หัวข้อสมรรถนะ)</label>
                        <input
                          type="text"
                          value={plan.competency}
                          placeholder="e.g., Advanced research methodology"
                          onChange={e => {
                            const updated = [...(formData.learningPlans || [])];
                            updated[idx].competency = e.target.value;
                            setFormData({ ...formData, learningPlans: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-800"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Target Completion Date (กำหนดการ)</label>
                        <DatePickerField
                          value={plan.targetDate}
                          onChange={val => {
                            const updated = [...(formData.learningPlans || [])];
                            updated[idx].targetDate = val;
                            setFormData({ ...formData, learningPlans: updated });
                          }}
                          className="!py-1 !px-2 text-xs !rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Status</label>
                        <select
                          value={plan.status}
                          onChange={e => {
                            const updated = [...(formData.learningPlans || [])];
                            updated[idx].status = e.target.value as 'Not Started' | 'In Progress' | 'Completed';
                            setFormData({ ...formData, learningPlans: updated });
                          }}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-semibold text-gray-700 font-bold"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Description & Goal (วัตถุประสงค์ / เป้าหมาย)</label>
                        <textarea
                          rows={2}
                          value={plan.description}
                          placeholder="What is the objective or outcome to achieve..."
                          onChange={e => {
                            const updated = [...(formData.learningPlans || [])];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, learningPlans: updated });
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 block mb-0.5">Planned Activities & Training Details (แผนงานเพื่อบรรลุสมรรถนะ)</label>
                        <textarea
                          rows={2}
                          value={plan.activities}
                          placeholder="e.g., Attend structural equation modeling workshop, write dissertation methodology section..."
                          onChange={e => {
                            const updated = [...(formData.learningPlans || [])];
                            updated[idx].activities = e.target.value;
                            setFormData({ ...formData, learningPlans: updated });
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const updated = [...(formData.learningPlans || []), { competency: '', description: '', targetDate: '', status: 'Not Started' as const, activities: '' }];
                    setFormData({ ...formData, learningPlans: updated });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-dashed border-gray-300 hover:border-tu-red hover:text-tu-red text-gray-500 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  <span>เพิ่มแผนเป้าหมายสมรรถนะใหม่ (Add New Competency Goal)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: English Language */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 3 && (
          <div className="space-y-6 text-xs text-gray-700">
            <div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-100 rounded-xl text-sky-800">
              <Info size={16} className="text-sky-600 mt-0.5 shrink-0" />
              <div className="text-xs leading-normal font-medium">
                All PhD students are required to meet the English language proficiency requirement of the program and provide evidence of an approved test score or equivalent requirement specified by the program.
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-700">3.1 Record of English Language Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Test Examination Name</label>
                <input
                  type="text"
                  placeholder="e.g., IELTS, TOEFL, TU-GET"
                  value={formData.englishTest.testName}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, testName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Score Achieved</label>
                <input
                  type="text"
                  placeholder="e.g., 7.0"
                  value={formData.englishTest.scoreAchieved}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, scoreAchieved: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Required Minimum Score</label>
                <input
                  type="text"
                  placeholder="e.g., 6.5"
                  value={formData.englishTest.requiredScore}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, requiredScore: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Date Taken</label>
                <DatePickerField
                  value={formData.englishTest.dateTaken || ''}
                  onChange={val => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, dateTaken: val }
                  })}
                  className="!py-1.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                <select
                  value={formData.englishTest.status || 'Not Started'}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, status: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Evidence / Certificate Link</label>
                <input
                  type="text"
                  placeholder="e.g., Certificate ID / Drive URL"
                  value={formData.englishTest.evidence || ''}
                  onChange={e => setFormData({
                    ...formData,
                    englishTest: { ...formData.englishTest, evidence: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-700">3.2 English Development Activities</h3>
                <button
                  onClick={addEnglishActivity}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add English Training Course Row
                </button>
              </div>

              {formData.englishActivities.map((act, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const updated = formData.englishActivities.filter((_, i) => i !== idx);
                      setFormData({ ...formData, englishActivities: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Activity Date</label>
                    <DatePickerField
                      value={act.date}
                      onChange={val => {
                        const updated = [...formData.englishActivities];
                        updated[idx].date = val;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="!py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Course / Activity Title</label>
                    <input
                      type="text"
                      value={act.activity}
                      placeholder="e.g., Academic Writing Course"
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].activity = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Organized By</label>
                    <input
                      type="text"
                      value={act.organizer}
                      placeholder="e.g., TU Language Institute"
                      onChange={e => {
                        const updated = [...formData.englishActivities];
                        updated[idx].organizer = e.target.value;
                        setFormData({ ...formData, englishActivities: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Certificate Number / Evidence Link</label>
                    <input
                      type="text"
                      value={act.evidence}
                      placeholder="e.g., Cert ID: 90241"
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
              <label className="text-xs font-bold text-gray-700 block">3.3 Reflection on English Development</label>
              <textarea
                rows={3}
                placeholder="Discuss how your English enhancement activities positively supported your scholarly writing and dissertation work..."
                value={formData.englishReflection}
                onChange={e => setFormData({ ...formData, englishReflection: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-700">3.4 Verification</h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Advisor / Program Coordinator Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Provide evaluation or comments on candidate's English proficiency progress..."
                    value={formData.englishVerification?.comments || ''}
                    onChange={e => setFormData({
                      ...formData,
                      englishVerification: {
                        ...(formData.englishVerification || { comments: '', name: '', signatureDate: '' }),
                        comments: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Assistant Professor Dr. Wongchan Petpichetchian"
                      value={formData.englishVerification?.name || ''}
                      onChange={e => setFormData({
                        ...formData,
                        englishVerification: {
                          ...(formData.englishVerification || { comments: '', name: '', signatureDate: '' }),
                          name: e.target.value
                        }
                      })}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Signature and Date</label>
                    <DatePickerField
                      value={formData.englishVerification?.signatureDate || ''}
                      onChange={val => setFormData({
                        ...formData,
                        englishVerification: {
                          ...(formData.englishVerification || { comments: '', name: '', signatureDate: '' }),
                          signatureDate: val
                        }
                      })}
                      className="!py-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: Coursework completed */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 4 && (
          <div className="space-y-6 text-xs text-gray-700">
            {/* 4.1 Completed Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">4.1 Courses Completed</h3>
                <button
                  onClick={addCompletedCourse}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Course Completed Row
                </button>
              </div>

              {formData.completedCourses.map((course, idx) => {
                const standardCourses = configOptions
                  .filter(c => c.OptionType === 'COURSE')
                  .map(c => {
                    const parts = c.OptionValue.split(': ');
                    const code = parts[0] || '';
                    const title = parts.slice(1).join(': ') || '';
                    return { code, title };
                  });

                return (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <button
                      onClick={() => {
                        const updated = formData.completedCourses.filter((_, i) => i !== idx);
                        setFormData({ ...formData, completedCourses: updated });
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer font-bold"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Course Code</label>
                      <select
                        value={standardCourses.some(sc => sc.code === course.code) ? course.code : (course.code ? 'custom' : '')}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = [...formData.completedCourses];
                          if (val === 'custom') {
                            updated[idx].code = '';
                          } else {
                            const matched = standardCourses.find(sc => sc.code === val);
                            if (matched) {
                              updated[idx].code = matched.code;
                              updated[idx].title = matched.title;
                            } else {
                              updated[idx].code = '';
                            }
                          }
                          setFormData({ ...formData, completedCourses: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                      >
                        <option value="">-- Select Code --</option>
                        {standardCourses.map((c, i) => (
                          <option key={i} value={c.code}>{c.code}</option>
                        ))}
                        <option value="custom">Custom / Other...</option>
                      </select>
                      
                      {(!standardCourses.some(sc => sc.code === course.code) || course.code === '') && (
                        <input
                          type="text"
                          value={course.code}
                          placeholder="e.g. NS802"
                          onChange={e => {
                            const updated = [...formData.completedCourses];
                            updated[idx].code = e.target.value;
                            setFormData({ ...formData, completedCourses: updated });
                          }}
                          className="mt-1 w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                        />
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Course Title</label>
                      <select
                        value={standardCourses.some(sc => sc.title === course.title) ? course.title : (course.title ? 'custom' : '')}
                        onChange={e => {
                          const val = e.target.value;
                          const updated = [...formData.completedCourses];
                          if (val === 'custom') {
                            updated[idx].title = '';
                          } else {
                            const matched = standardCourses.find(sc => sc.title === val);
                            if (matched) {
                              updated[idx].code = matched.code;
                              updated[idx].title = matched.title;
                            } else {
                              updated[idx].title = '';
                            }
                          }
                          setFormData({ ...formData, completedCourses: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="">-- Select Title --</option>
                        {standardCourses.map((c, i) => (
                          <option key={i} value={c.title}>{c.title}</option>
                        ))}
                        <option value="custom">Custom / Other...</option>
                      </select>
                      
                      {(!standardCourses.some(sc => sc.title === course.title) || course.title === '') && (
                        <input
                          type="text"
                          value={course.title}
                          placeholder="Course Title"
                          onChange={e => {
                            const updated = [...formData.completedCourses];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, completedCourses: updated });
                          }}
                          className="mt-1 w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Semester/Year</label>
                      <input
                        type="text"
                        value={course.semester || ''}
                        placeholder="e.g. 1/2025"
                        onChange={e => {
                          const updated = [...formData.completedCourses];
                          updated[idx].semester = e.target.value;
                          setFormData({ ...formData, completedCourses: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Grade / Credits</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={course.grade || ''}
                          placeholder="e.g. A"
                          onChange={e => {
                            const updated = [...formData.completedCourses];
                            updated[idx].grade = e.target.value;
                            setFormData({ ...formData, completedCourses: updated });
                          }}
                          className="w-1/2 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center font-bold"
                        />
                        <input
                          type="text"
                          value={course.credits || ''}
                          placeholder="Cr."
                          onChange={e => {
                            const updated = [...formData.completedCourses];
                            updated[idx].credits = e.target.value;
                            setFormData({ ...formData, completedCourses: updated });
                          }}
                          className="w-1/2 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4.2 Key Learning from Coursework */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">4.2 Key Learning from Coursework</h3>
                <button
                  onClick={addKeyLearning}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Key Learning Row
                </button>
              </div>

              {(formData.keyLearnings || []).map((kl, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      const updated = (formData.keyLearnings || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, keyLearnings: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Course / Activity</label>
                    <input
                      type="text"
                      placeholder="e.g. NS802: Advanced Gerontology"
                      value={kl.course}
                      onChange={e => {
                        const updated = [...(formData.keyLearnings || [])];
                        updated[idx].course = e.target.value;
                        setFormData({ ...formData, keyLearnings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Key Learning</label>
                    <textarea
                      rows={2}
                      placeholder="Summarize the key knowledge or skills gained..."
                      value={kl.keyLearning}
                      onChange={e => {
                        const updated = [...(formData.keyLearnings || [])];
                        updated[idx].keyLearning = e.target.value;
                        setFormData({ ...formData, keyLearnings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Application to Research / Practice</label>
                    <textarea
                      rows={2}
                      placeholder="How does this apply to your dissertation or professional role?"
                      value={kl.application}
                      onChange={e => {
                        const updated = [...(formData.keyLearnings || [])];
                        updated[idx].application = e.target.value;
                        setFormData({ ...formData, keyLearnings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 4.3 Workshops, Training, and Short Courses */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">4.3 Workshops, Training, and Short Courses</h3>
                <button
                  onClick={addWorkshop}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Workshop Row
                </button>
              </div>

              {(formData.workshops || []).map((ws, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <button
                    onClick={() => {
                      const updated = (formData.workshops || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, workshops: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Date</label>
                    <DatePickerField
                      value={ws.date}
                      onChange={val => {
                        const updated = [...(formData.workshops || [])];
                        updated[idx].date = val;
                        setFormData({ ...formData, workshops: updated });
                      }}
                      className="!py-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Workshop / Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Research Ethics in Human Subjects"
                      value={ws.title}
                      onChange={e => {
                        const updated = [...(formData.workshops || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, workshops: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Organizer</label>
                    <input
                      type="text"
                      placeholder="e.g. Faculty of Nursing, TU"
                      value={ws.organizer}
                      onChange={e => {
                        const updated = [...(formData.workshops || [])];
                        updated[idx].organizer = e.target.value;
                        setFormData({ ...formData, workshops: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Key Learning / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Completed, Learnt IRB guidelines"
                      value={ws.keyLearning}
                      onChange={e => {
                        const updated = [...(formData.workshops || [])];
                        updated[idx].keyLearning = e.target.value;
                        setFormData({ ...formData, workshops: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 4.4 Certifications - Pull from Certificates tab/sheet */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div>
                <h3 className="text-sm font-bold text-gray-700">4.4 Certifications</h3>
                <p className="text-xs text-gray-400 mt-0.5">Automated synchronization: Displaying all approved/uploaded credentials from your Certificates portfolio tab.</p>
              </div>

              {(() => {
                const myCerts = certificates.filter(
                  c => c.StudentID === (currentUser.StudentID || '6601010024')
                );

                if (myCerts.length === 0) {
                  return (
                    <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No certificates recorded in the "Certificates" worksheet yet. Please upload them using the main Certificate manager tab.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myCerts.map((cert) => (
                      <div key={cert.CertID} className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs flex gap-4 items-start">
                        {cert.ImageURL && (
                          <img
                            src={cert.ImageURL}
                            alt={cert.Name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                          />
                        )}
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-bold text-xs text-gray-800 line-clamp-2">{cert.Name}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="text-gray-400 font-mono">{cert.Date}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-tu-red italic truncate max-w-[150px]">{cert.Category}</span>
                          </div>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${
                            cert.Status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            cert.Status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {cert.Status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: Dissertation Progress */}
        {/* ------------------------------------------------------------- */}
        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: Dissertation Progress */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 5 && (
          <div className="space-y-6 text-xs text-gray-700">
            {/* 5.1 Development of Research Topic */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700">5.1 Development of Research Topic</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Describe the evolution and development of your research topic / area of focus</label>
                <textarea
                  rows={3}
                  placeholder="Describe how your dissertation topic was conceived, refined, and developed..."
                  value={formData.dissertationInfo.researchTopic || ''}
                  onChange={e => setFormData({
                    ...formData,
                    dissertationInfo: { ...formData.dissertationInfo, researchTopic: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* 5.2 Dissertation Scope & Proposal */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-700">5.2 Dissertation Scope & Proposal</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Dissertation Working Title</label>
                  <input
                    type="text"
                    placeholder="Enter full working dissertation title..."
                    value={formData.dissertationInfo.title || ''}
                    onChange={e => setFormData({
                      ...formData,
                      dissertationInfo: { ...formData.dissertationInfo, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Background and Significance of Dissertation Research</label>
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
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Research Problem & Statement</label>
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
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Specific Research Objectives</label>
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
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Research Questions or Hypotheses</label>
                    <textarea
                      rows={2}
                      value={formData.dissertationInfo.hypotheses || ''}
                      onChange={e => setFormData({
                        ...formData,
                        dissertationInfo: { ...formData.dissertationInfo, hypotheses: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Conceptual Framework or Theoretical Model</label>
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
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Research Methodology Overview</label>
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

            {/* 5.3 Dissertation Progress Record */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">5.3 Dissertation Progress Record</h3>
                <button
                  onClick={addDissertationProgress}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Progress Row
                </button>
              </div>

              {(formData.dissertationProgress || []).map((prog, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const updated = (formData.dissertationProgress || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, dissertationProgress: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Planned Activity / Milestone</label>
                    <input
                      type="text"
                      placeholder="e.g. Conducted literature review for Chapter 2"
                      value={prog.activity}
                      onChange={e => {
                        const updated = [...(formData.dissertationProgress || [])];
                        updated[idx].activity = e.target.value;
                        setFormData({ ...formData, dissertationProgress: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Target Date / Period</label>
                    <input
                      type="text"
                      placeholder="e.g. June - Aug 2025"
                      value={prog.date}
                      onChange={e => {
                        const updated = [...(formData.dissertationProgress || [])];
                        updated[idx].date = e.target.value;
                        setFormData({ ...formData, dissertationProgress: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Progress / Achievement Outcome</label>
                    <input
                      type="text"
                      placeholder="e.g. Completed draft, submitted to advisor"
                      value={prog.progress}
                      onChange={e => {
                        const updated = [...(formData.dissertationProgress || [])];
                        updated[idx].progress = e.target.value;
                        setFormData({ ...formData, dissertationProgress: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 5.4 Doctoral Advisory Committee Meetings */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">5.4 Doctoral Advisory Committee Meetings</h3>
                <button
                  onClick={addAdvisorMeeting}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Plus size={12} />
                  Add Advisory Meeting Row
                </button>
              </div>

              {formData.advisorMeetings.map((meet, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const updated = formData.advisorMeetings.filter((_, i) => i !== idx);
                      setFormData({ ...formData, advisorMeetings: updated });
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Meeting Date</label>
                    <DatePickerField
                      value={meet.date}
                      onChange={val => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].date = val;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="!py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Advisors Attending</label>
                    <input
                      type="text"
                      value={meet.persons}
                      placeholder="e.g., Assoc. Prof. Dr. Sarah"
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].persons = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Key Issues Discussed</label>
                    <input
                      type="text"
                      value={meet.issues}
                      placeholder="e.g., Tools validation and sample group"
                      onChange={e => {
                        const updated = [...formData.advisorMeetings];
                        updated[idx].issues = e.target.value;
                        setFormData({ ...formData, advisorMeetings: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Action Points & Next Steps</label>
                    <input
                      type="text"
                      value={meet.actionPoints}
                      placeholder="e.g., Complete IRB review forms"
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

            {/* 5.5 Ethics and Research Governance */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-700">5.5 Ethics and Research Governance</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Ethics Protocol Submission Date</label>
                  <DatePickerField
                    value={formData.ethicsGovernance?.dateApplied || ''}
                    onChange={val => setFormData({
                      ...formData,
                      ethicsGovernance: {
                        ...(formData.ethicsGovernance || { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' }),
                        dateApplied: val
                      }
                    })}
                    className="!py-1.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Ethics Approval Date</label>
                  <DatePickerField
                    value={formData.ethicsGovernance?.dateApproved || ''}
                    onChange={val => setFormData({
                      ...formData,
                      ethicsGovernance: {
                        ...(formData.ethicsGovernance || { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' }),
                        dateApproved: val
                      }
                    })}
                    className="!py-1.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Ethics COA Approval Number</label>
                  <input
                    type="text"
                    placeholder="e.g. COA No. 045/2025"
                    value={formData.ethicsGovernance?.approvalNumber || ''}
                    onChange={e => setFormData({
                      ...formData,
                      ethicsGovernance: {
                        ...(formData.ethicsGovernance || { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' }),
                        approvalNumber: e.target.value
                      }
                    })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Protocol Amendments / Status Updates</label>
                  <textarea
                    rows={2}
                    placeholder="Describe any approved amendments or protocols updates..."
                    value={formData.ethicsGovernance?.amendments || ''}
                    onChange={e => setFormData({
                      ...formData,
                      ethicsGovernance: {
                        ...(formData.ethicsGovernance || { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' }),
                        amendments: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Data Management & Subject Confidentiality</label>
                  <textarea
                    rows={2}
                    placeholder="Specify storage location of research data and consent security practices..."
                    value={formData.ethicsGovernance?.confidentiality || ''}
                    onChange={e => setFormData({
                      ...formData,
                      ethicsGovernance: {
                        ...(formData.ethicsGovernance || { dateApplied: '', dateApproved: '', approvalNumber: '', amendments: '', confidentiality: '' }),
                        confidentiality: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 5.6 Challenges Encountered and Solutions */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-700">5.6 Challenges Encountered and Solutions</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Reflect on the research obstacles, delays, design challenges and your resolutions</label>
                <textarea
                  rows={3}
                  placeholder="Record your reflections, scientific challenges, recruiting delays or methodology pivots, and the solutions implemented..."
                  value={formData.researchReflection || ''}
                  onChange={e => setFormData({
                    ...formData,
                    researchReflection: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: Research Experience 180 Hours */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 6 && (
          <div className="space-y-6 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700">6.1 Accumulated Research Experience Log (180 Hours Minimum)</h3>
                <p className="text-xs text-gray-400 font-normal">Record research assistantships, collaborative publications, or fieldwork project tasks.</p>
              </div>
              <button
                onClick={addResearchExp}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition font-mono cursor-pointer"
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
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Task Date</label>
                  <DatePickerField
                    value={item.date}
                    onChange={val => {
                      const updated = [...formData.researchExperience];
                      updated[idx].date = val;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="!py-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Research Activities Performed</label>
                  <input
                    type="text"
                    value={item.description}
                    placeholder="e.g., Data cleaning, stats, review literature"
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Worked Hours</label>
                  <input
                    type="number"
                    value={item.Hours || item.hours}
                    onChange={e => {
                      const updated = [...formData.researchExperience];
                      const val = Number(e.target.value);
                      updated[idx].Hours = val;
                      updated[idx].hours = val;
                      setFormData({ ...formData, researchExperience: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Supervising Researcher</label>
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
              <label className="text-xs font-bold text-gray-700 block">6.2 Reflective Insight on Research Competence</label>
              <textarea
                rows={3}
                placeholder="Discuss methodological, technical, or analytical competencies developed through your assistantship..."
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
          <div className="space-y-6 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">7.2 Peer-Reviewed Journal Publications</h3>
              <button
                onClick={addPublication}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-red-50 hover:text-tu-red text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Plus size={12} />
                Add Publication Row
              </button>
            </div>

            {formData.publications.map((pub, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    const updated = formData.publications.filter((_, i) => i !== idx);
                    setFormData({ ...formData, publications: updated });
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Publication Year</label>
                  <input
                    type="text"
                    value={pub.year}
                    placeholder="e.g., 2025"
                    onChange={e => {
                      const updated = [...formData.publications];
                      updated[idx].year = e.target.value;
                      setFormData({ ...formData, publications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Article/Paper Title</label>
                  <input
                    type="text"
                    value={pub.title}
                    placeholder="e.g., Psychometric Evaluation of Nursing Practices..."
                    onChange={e => {
                      const updated = [...formData.publications];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, publications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Journal Name / DOI URL link</label>
                  <input
                    type="text"
                    value={pub.journal}
                    placeholder="e.g., Journal of Nursing Science / https://doi.org/10..."
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
          <div className="space-y-6 text-xs text-gray-700">
            <h3 className="text-sm font-bold text-gray-700 mb-4">12.1 Self-Assessment of Core Doctoral Competencies</h3>
            
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
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700 cursor-pointer"
                    >
                      <option value="Beginning">Beginning</option>
                      <option value="Developing">Developing</option>
                      <option value="Competent">Competent</option>
                      <option value="Proficient">Proficient</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Provide supporting evidence/remarks..."
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
          <div className="space-y-4 text-xs text-gray-700">
            <h3 className="text-sm font-bold text-gray-700">Comprehensive Portfolio Feedback from Dissertation Advisors (Section 15)</h3>
            <div className="p-5 bg-amber-50/30 border border-amber-100 rounded-2xl">
              <span className="text-xs font-bold text-tu-red uppercase tracking-wider block mb-1">MAJOR ADVISOR FEEDBACK</span>
              <p className="text-sm text-gray-800 leading-relaxed italic">
                "{formData.advisorComments || 'No comprehensive advisor remarks provided yet for this annual review cycle.'}"
              </p>
            </div>
            
            <div className="pt-3">
              <label className="text-xs text-gray-400 leading-normal block mt-2">
                * Advisory feedback sections are locked for student editing. Your primary advisor can edit these directly by signing in with their credentials.
              </label>
            </div>
          </div>
        )}

        {activeSection === 11 && (
          <div className="space-y-6 text-xs text-gray-700">
            <div>
              <h3 className="text-sm font-bold text-gray-700">11.1 Supporting Evidence & Electronic Portfolio Documents</h3>
              <p className="text-xs text-gray-400 font-normal">
                Upload and manage key files (research papers, ethics approval notices, certificates, dissertation drafts) securely stored in your personal Google Drive folder.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <label className="text-xs font-semibold text-gray-500 block">Attach Supporting Files</label>
              <FileUploader
                studentId={currentUser.StudentID || '6601010024'}
                studentName={currentUser.FullName || 'Student'}
                uploaderId={currentUser.StudentID || '6601010024'}
                uploaderRole="student"
                files={formData.supportingFiles || []}
                onChange={(files) => {
                  setFormData({
                    ...formData,
                    supportingFiles: files
                  });
                }}
              />
            </div>
          </div>
        )}

        {activeSection === 16 && (
          <div className="space-y-4 text-xs text-gray-700">
            <h3 className="text-sm font-bold text-gray-700">16.1 Advisory Verification Sign-off & Endorsement</h3>
            <p className="text-xs text-gray-500">Board of advisors and co-advisors verifying candidate progress credentials:</p>

            <div className="space-y-3">
              {formData.endorsements.map((end, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-tu-red block uppercase">{end.role}</span>
                    <h4 className="text-sm font-semibold text-gray-800">{end.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                      ✓ Authenticated & Signed
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">Endorsed on: {end.signatureDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default edit fallbacks for simplicity in navigation */}
        {![1, 2, 3, 4, 5, 6, 7, 11, 12, 15, 16].includes(activeSection) && (
          <div className="space-y-4 text-xs text-gray-700">
            <p className="text-sm text-gray-600 leading-relaxed">
              Section {activeSection} fields are automatically completed with compliant reference profiles. You can review advisor remarks or download your complete portfolio in the Print Report PDF section immediately.
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <h4 className="font-semibold text-xs text-gray-700">Preloaded Content:</h4>
              <p className="text-xs italic text-gray-500">
                "Content pre-configured to comply with standard Faculty of Nursing PhD graduation benchmarks for final thesis defense clearance."
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
