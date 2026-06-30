/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Certificate, Activity, ConfigOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Award, Image as ImageIcon, Plus, Edit2, CheckCircle2, AlertCircle, Trash2, ExternalLink, Calendar, PlusCircle, Check, Loader2, HeartHandshake } from 'lucide-react';

interface StudentInformationProps {
  currentUser: User;
  certificates: Certificate[];
  activities: Activity[];
  configOptions: ConfigOption[];
  onUpdateProfile: (updatedProfile: User) => Promise<void>;
  onAddCertificate: (cert: Certificate) => Promise<void>;
  onAddActivity: (act: Activity) => Promise<void>;
}

export default function StudentInformation({
  currentUser,
  certificates,
  activities,
  configOptions,
  onUpdateProfile,
  onAddCertificate,
  onAddActivity
}: StudentInformationProps) {
  const [activeSubTab, setActiveSubTab] = useState<'demographics' | 'certificates' | 'activities'>('demographics');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Forms state
  const [profileForm, setProfileForm] = useState<User>({ ...currentUser });
  const [newCertForm, setNewCertForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    imageUrl: ''
  });
  const [newActForm, setNewActForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as string[]
  });

  // Filter dynamic dropdown list options from dynamic ConfigOptions
  const advisorOptions = configOptions.filter(c => c.OptionType === 'ADVISOR').map(c => c.OptionValue);
  const coAdvisorOptions = configOptions.filter(c => c.OptionType === 'CO_ADVISOR').map(c => c.OptionValue);
  const certCategoryOptions = configOptions.filter(c => c.OptionType === 'CERT_CATEGORY').map(c => c.OptionValue);
  const degreeOptions = configOptions.filter(c => c.OptionType === 'DEGREE').map(c => c.OptionValue);

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    await onUpdateProfile(profileForm);
    setIsEditingProfile(false);
    setIsUploading(false);
  };

  // Simulate Google Drive upload in folder "Bird"
  const simulateImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMulti = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    // Google Drive sample simulation URLs
    const randomSamples = [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
    ];

    setTimeout(() => {
      if (isMulti) {
        // Multi upload
        const chosenUrls = [];
        for (let i = 0; i < Math.min(e.target.files!.length, 3); i++) {
          chosenUrls.push(randomSamples[(Math.floor(Math.random() * randomSamples.length))]);
        }
        setNewActForm(prev => ({
          ...prev,
          images: [...prev.images, ...chosenUrls]
        }));
      } else {
        // Single upload
        const chosenUrl = randomSamples[Math.floor(Math.random() * randomSamples.length)];
        setNewCertForm(prev => ({ ...prev, imageUrl: chosenUrl }));
        setProfileForm(prev => ({ ...prev, PhotoURL: chosenUrl }));
      }
      setIsUploading(false);
    }, 1200);
  };

  // Add Certificate
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertForm.name || !newCertForm.category) return;

    const newCert: Certificate = {
      CertID: `CERT-${Date.now()}`,
      StudentID: currentUser.StudentID || '6601010024',
      Name: newCertForm.name,
      Date: newCertForm.date,
      Category: newCertForm.category,
      ImageURL: newCertForm.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
      Status: 'PENDING'
    };

    await onAddCertificate(newCert);
    
    // Reset form
    setNewCertForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      imageUrl: ''
    });
  };

  // Add Activity Progress (Collage)
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActForm.title || !newActForm.description) return;

    const newAct: Activity = {
      ActivityID: `ACT-${Date.now()}`,
      StudentID: currentUser.StudentID || '6601010024',
      Title: newActForm.title,
      Date: newActForm.date,
      Description: newActForm.description,
      ImagesURL: newActForm.images.length > 0 ? newActForm.images : [
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
      ],
      Status: 'PENDING'
    };

    await onAddActivity(newAct);

    // Reset Form
    setNewActForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      images: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Subtab selection */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('demographics')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            activeSubTab === 'demographics'
              ? 'border-tu-red text-tu-red'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <UserIcon size={16} />
          ประวัตินักศึกษา (Demographics)
        </button>
        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            activeSubTab === 'certificates'
              ? 'border-tu-red text-tu-red'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Award size={16} />
          แฟ้มใบประกาศนียบัตร (Certificates)
        </button>
        <button
          onClick={() => setActiveSubTab('activities')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            activeSubTab === 'activities'
              ? 'border-tu-red text-tu-red'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ImageIcon size={16} />
          ภาพกิจกรรมความก้าวหน้า (Activities Progress)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ----------------------------------------------------------------- */}
        {/* DEMOGRAPHICS SUBTAB */}
        {/* ----------------------------------------------------------------- */}
        {activeSubTab === 'demographics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Side: Avatar and Quick Metadata */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <img
                  src={profileForm.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                  alt="Profile Photo"
                  className="w-36 h-36 rounded-2xl object-cover ring-4 ring-red-50"
                />
                {isEditingProfile && (
                  <label className="absolute inset-0 bg-black/50 hover:bg-black/60 cursor-pointer rounded-2xl flex flex-col items-center justify-center text-white text-xs transition duration-200">
                    <ImageIcon size={20} className="mb-1" />
                    <span>อัปโหลดรูป</span>
                    <span className="text-[9px] opacity-75">โฟลเดอร์ "Bird" ใน Drive</span>
                    <input type="file" onChange={simulateImageUpload} className="hidden" accept="image/*" />
                  </label>
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900">{currentUser.FullName}</h3>
                <p className="text-sm text-gray-500 font-mono">ID: {currentUser.StudentID || 'ยังไม่กำหนด'}</p>
                <p className="text-xs font-semibold text-tu-red bg-red-50 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                  {currentUser.Role}
                </p>
              </div>

              <div className="w-full border-t border-gray-100 pt-4 space-y-3 text-left">
                <div className="text-xs">
                  <span className="text-gray-400 font-medium block">อีเมลหลัก (Email)</span>
                  <span className="text-gray-800 font-medium font-mono">{currentUser.Email}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-400 font-medium block">ORCID ID</span>
                  {currentUser.ORCID ? (
                    <a href={currentUser.ORCID} target="_blank" rel="noreferrer" className="text-tu-red font-semibold hover:underline flex items-center gap-1">
                      {currentUser.ORCID} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">ไม่ได้ระบุ</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Demographics Form / Detail view */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                <h3 className="text-base font-bold text-gray-900">ประวัติและข้อมูลวิชาการของนักศึกษา</h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1 px-4 py-2 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl text-xs font-semibold transition"
                  >
                    <Edit2 size={12} />
                    แก้ไขข้อมูลประวัติ
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setProfileForm({ ...currentUser });
                        setIsEditingProfile(false);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUploading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      {isUploading && <Loader2 size={12} className="animate-spin" />}
                      บันทึกข้อมูล
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">รหัสนักศึกษา (Student ID)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.StudentID || ''}
                      onChange={e => setProfileForm({ ...profileForm, StudentID: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">ชื่อ-นามสกุล (Full Name)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.FullName || ''}
                      onChange={e => setProfileForm({ ...profileForm, FullName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">หลักสูตร / สาขาวิชา (Degree Major)</label>
                    {isEditingProfile ? (
                      <select
                        value={profileForm.Major || ''}
                        onChange={e => setProfileForm({ ...profileForm, Major: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      >
                        <option value="">เลือกหลักสูตร...</option>
                        {degreeOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm font-medium text-gray-800">
                        {profileForm.Major || 'ไม่ได้ระบุ'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">ปีที่คาดว่าจะจบการศึกษา (Expected Graduation Year)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.ExpectedGraduationYear || ''}
                      onChange={e => setProfileForm({ ...profileForm, ExpectedGraduationYear: e.target.value })}
                      placeholder="เช่น 2027"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">อาจารย์ที่ปรึกษาหลัก (Major Advisor)</label>
                    {isEditingProfile ? (
                      <select
                        value={profileForm.Advisor || ''}
                        onChange={e => setProfileForm({ ...profileForm, Advisor: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      >
                        <option value="">เลือกอาจารย์ที่ปรึกษา...</option>
                        {advisorOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm font-medium text-gray-800">
                        {profileForm.Advisor || 'ไม่ได้ระบุ'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">อาจารย์ที่ปรึกษาร่วม (Co-Advisor)</label>
                    {isEditingProfile ? (
                      <select
                        value={profileForm.CoAdvisor || ''}
                        onChange={e => setProfileForm({ ...profileForm, CoAdvisor: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      >
                        <option value="">เลือกอาจารย์ที่ปรึกษาร่วม...</option>
                        {coAdvisorOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm font-medium text-gray-800">
                        {profileForm.CoAdvisor || 'ไม่ได้ระบุ'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Line ID</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.LineID || ''}
                      onChange={e => setProfileForm({ ...profileForm, LineID: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">ORCID ID URL</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.ORCID || ''}
                      onChange={e => setProfileForm({ ...profileForm, ORCID: e.target.value })}
                      placeholder="https://orcid.org/..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">หัวข้อวิทยานิพนธ์ (Thesis Title)</label>
                  <textarea
                    disabled={!isEditingProfile}
                    rows={2}
                    value={profileForm.ThesisTitle || ''}
                    onChange={e => setProfileForm({ ...profileForm, ThesisTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">สาขาวิชาและประเด็นวิจัยที่สนใจ (Research Interests)</label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.ResearchInterests || ''}
                    onChange={e => setProfileForm({ ...profileForm, ResearchInterests: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm disabled:opacity-75 focus:outline-tu-red"
                  />
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* CERTIFICATES SUBTAB */}
        {/* ----------------------------------------------------------------- */}
        {activeSubTab === 'certificates' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Form to upload certificate */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5 mb-4">
                <PlusCircle size={18} className="text-tu-red" />
                อัปโหลดเอกสารหลักฐานใบประกาศเกียรติคุณใหม่
              </h3>

              <form onSubmit={handleAddCert} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">ชื่อใบประกาศ/การอบรม (Certificate Title)</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น ใบผ่านการอบรมการประมวลสถิติระดับสูง"
                        value={newCertForm.name}
                        onChange={e => setNewCertForm({ ...newCertForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">หมวดหมู่ใบประกาศ (Category)</label>
                      <select
                        required
                        value={newCertForm.category}
                        onChange={e => setNewCertForm({ ...newCertForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      >
                        <option value="">เลือกหมวดหมู่...</option>
                        {certCategoryOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">วันที่ได้รับเอกสาร (Date Received)</label>
                      <input
                        type="date"
                        required
                        value={newCertForm.date}
                        onChange={e => setNewCertForm({ ...newCertForm, date: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">แนบรูปถ่ายหลักฐานต้นฉบับไปยัง Google Drive</label>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center border border-dashed border-gray-300 hover:border-tu-red cursor-pointer bg-gray-50 py-2 rounded-xl text-xs font-medium text-gray-600 transition">
                          {isUploading ? (
                            <>
                              <Loader2 size={14} className="animate-spin text-tu-red mr-1.5" />
                              <span>กำลังอัปโหลดไปยัง Drive โฟลเดอร์ "Bird"...</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon size={14} className="text-gray-400 mr-1.5" />
                              <span>{newCertForm.imageUrl ? '✓ เลือกภาพเรียบร้อย' : 'เลือกภาพไฟล์ (PNG, JPG)'}</span>
                            </>
                          )}
                          <input type="file" onChange={simulateImageUpload} className="hidden" accept="image/*" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl text-sm font-semibold transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} />
                    บันทึกส่งขออนุมัติสะสมงาน
                  </button>
                </div>
              </form>
            </div>

            {/* List certificates */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700">รายการใบประกาศทั้งหมดในระบบ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certificates
                  .filter(c => c.StudentID === currentUser.StudentID || currentUser.StudentID === '6601010024')
                  .map((cert) => (
                    <div key={cert.CertID} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col justify-between shadow-xs">
                      <div className="relative h-44 bg-gray-100">
                        <img src={cert.ImageURL} alt={cert.Name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm flex items-center gap-1 ${
                            cert.Status === 'APPROVED'
                              ? 'bg-emerald-500 text-white'
                              : cert.Status === 'REJECTED'
                              ? 'bg-red-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}>
                            {cert.Status === 'APPROVED' && <CheckCircle2 size={12} />}
                            {cert.Status === 'REJECTED' && <AlertCircle size={12} />}
                            {cert.Status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-tu-red block tracking-wider font-mono">
                            {cert.Category}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                            {cert.Name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar size={12} />
                            <span>ได้รับเมื่อ: {cert.Date}</span>
                          </div>
                        </div>

                        {cert.Feedback && (
                          <div className="mt-3 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 space-y-1">
                            <span className="font-semibold block text-gray-700">ฟีดแบคจากที่ปรึกษา ({cert.ApprovedBy || 'อาจารย์'}):</span>
                            <p className="italic leading-normal text-[11px]">"{cert.Feedback}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* ACTIVITIES SUBTAB */}
        {/* ----------------------------------------------------------------- */}
        {activeSubTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Form to upload progress with collage images */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5 mb-4">
                <ImageIcon size={18} className="text-tu-red" />
                เพิ่มกิจกรรมสะสมงานความก้าวหน้าและการทำกิจกรรมดุษฎีบัณฑิต
              </h3>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">หัวข้อกิจกรรม (Activity Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น อบรมกลุ่มย่อยเรื่อง Tele-Nursing กับ อสม. ในชุมชน"
                      value={newActForm.title}
                      onChange={e => setNewActForm({ ...newActForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">วันที่ดำเนินกิจกรรม (Date)</label>
                    <input
                      type="date"
                      required
                      value={newActForm.date}
                      onChange={e => setNewActForm({ ...newActForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">รายละเอียดกิจกรรม (Description)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="สรุปรายละเอียดกิจกรรม ผลลัพธ์ และประเด็นเรียนรู้..."
                    value={newActForm.description}
                    onChange={e => setNewActForm({ ...newActForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-tu-red"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 block">อัปโหลดภาพประกอบหลายรูปเพื่อทำ คอลลาจภาพ (Collage Photos)</label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <label className="flex items-center justify-center border border-dashed border-gray-300 hover:border-tu-red cursor-pointer bg-gray-50 px-4 py-2 rounded-xl text-xs font-medium text-gray-600 transition">
                      <ImageIcon size={14} className="text-gray-400 mr-1.5" />
                      <span>อัปโหลดรูปเพิ่มเติม (สูงสุด 3 รูป)</span>
                      <input type="file" multiple onChange={e => simulateImageUpload(e, true)} className="hidden" accept="image/*" />
                    </label>

                    {newActForm.images.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt="chosen" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewActForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl text-sm font-semibold transition shadow-xs flex items-center gap-1.5 ml-auto"
                  >
                    <Plus size={16} />
                    บันทึกกิจกรรมสะสมงาน
                  </button>
                </div>
              </form>
            </div>

            {/* List activities as collages */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-700">ประวัติคอลลาจภาพความก้าวหน้าและการทำกิจกรรม</h3>

              <div className="space-y-6">
                {activities
                  .filter(a => a.StudentID === currentUser.StudentID || currentUser.StudentID === '6601010024')
                  .map((act) => (
                    <div key={act.ActivityID} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left: Collage representation */}
                      <div className="md:col-span-1 space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-tu-red block font-mono">ACTIVITY PHOTO COLLAGE</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {act.ImagesURL.length === 1 && (
                            <img src={act.ImagesURL[0]} alt="activity" className="w-full h-36 object-cover rounded-xl col-span-2" />
                          )}
                          {act.ImagesURL.length === 2 && (
                            <>
                              <img src={act.ImagesURL[0]} alt="activity" className="w-full h-36 object-cover rounded-xl" />
                              <img src={act.ImagesURL[1]} alt="activity" className="w-full h-36 object-cover rounded-xl" />
                            </>
                          )}
                          {act.ImagesURL.length >= 3 && (
                            <>
                              <img src={act.ImagesURL[0]} alt="activity" className="w-full h-36 object-cover rounded-xl col-span-2" />
                              <img src={act.ImagesURL[1]} alt="activity" className="w-full h-20 object-cover rounded-xl" />
                              <img src={act.ImagesURL[2]} alt="activity" className="w-full h-20 object-cover rounded-xl" />
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: details and status */}
                      <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-gray-900 leading-snug">{act.Title}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              act.Status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : act.Status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {act.Status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <Calendar size={12} />
                            <span>วันที่ทำกิจกรรม: {act.Date}</span>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed pt-1">{act.Description}</p>
                        </div>

                        {act.Feedback && (
                          <div className="p-3 bg-red-50/50 border border-red-100/50 rounded-xl text-xs text-gray-700 space-y-1">
                            <span className="font-semibold block text-tu-red flex items-center gap-1">
                              <HeartHandshake size={13} />
                              ข้อเสนอแนะของอาจารย์ที่ปรึกษา ({act.ApprovedBy || 'อาจารย์'}):
                            </span>
                            <p className="italic leading-normal">"{act.Feedback}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
