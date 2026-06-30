/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ConfigOption, OptionType, ActivityLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Settings, FileSpreadsheet, Plus, Trash2, Edit2, ShieldAlert, Check, PlusCircle, Search, RefreshCw, KeyRound } from 'lucide-react';
import { getLogs } from '../lib/googleSheets';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  configOptions: ConfigOption[];
  onAddUser: (u: User) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onAddConfigOption: (opt: ConfigOption) => Promise<void>;
  onDeleteConfigOption: (id: string) => Promise<void>;
}

export default function AdminPanel({
  currentUser,
  users,
  configOptions,
  onAddUser,
  onDeleteUser,
  onAddConfigOption,
  onDeleteConfigOption
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'users' | 'configs' | 'logs'>('users');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  // User Manager State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState<Partial<User>>({
    Email: '',
    FullName: '',
    Role: 'STUDENT',
    StudentID: '',
    Major: '',
    Advisor: '',
    CoAdvisor: '',
    ThesisTitle: ''
  });

  // Config Manager State
  const [newConfigType, setNewConfigType] = useState<OptionType>('ADVISOR');
  const [newConfigValue, setNewConfigValue] = useState('');

  // Fetch log history on mount or tab change
  useEffect(() => {
    setLogs(getLogs());
  }, [adminTab]);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.Email || !newUserForm.FullName) return;

    const formattedUser: User = {
      UserID: newUserForm.Role === 'STUDENT' ? `STUDENT-${Date.now()}` : `ADVISOR-${Date.now()}`,
      Email: newUserForm.Email,
      FullName: newUserForm.FullName,
      Role: newUserForm.Role as any,
      StudentID: newUserForm.StudentID,
      Major: newUserForm.Major,
      Advisor: newUserForm.Advisor,
      CoAdvisor: newUserForm.CoAdvisor,
      ThesisTitle: newUserForm.ThesisTitle
    };

    await onAddUser(formattedUser);
    setShowAddUserModal(false);
    // Reset
    setNewUserForm({
      Email: '',
      FullName: '',
      Role: 'STUDENT',
      StudentID: '',
      Major: '',
      Advisor: '',
      CoAdvisor: '',
      ThesisTitle: ''
    });
  };

  const handleAddConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConfigValue.trim()) return;

    const newOpt: ConfigOption = {
      id: `cfg-${Date.now()}`,
      OptionType: newConfigType,
      OptionValue: newConfigValue.trim()
    };

    await onAddConfigOption(newOpt);
    setNewConfigValue('');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            adminTab === 'users' ? 'border-tu-red text-tu-red font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={16} />
          จัดการบัญชีผู้ใช้ (Users Accounts)
        </button>
        <button
          onClick={() => setAdminTab('configs')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            adminTab === 'configs' ? 'border-tu-red text-tu-red font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Settings size={16} />
          ตั้งค่าตัวเลือกDropdownของระบบ (ConfigOptions)
        </button>
        <button
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
            adminTab === 'logs' ? 'border-tu-red text-tu-red font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShieldAlert size={16} />
          ประวัติกิจกรรมและการใช้งาน (Activity Logs)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ------------------------------------------------------------- */}
        {/* TAB 1: USER ACCOUNT MANAGER */}
        {/* ------------------------------------------------------------- */}
        {adminTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-800">รายชื่อนักศึกษาและที่ปรึกษาในระบบ (PhD Student & Advisor List)</h3>
                <p className="text-xs text-gray-400">คุณสามารถเพิ่มหรือลบบัญชีผู้ใช้ เพื่อจำลองการเข้าระบบได้ทันที</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl text-xs font-semibold transition"
              >
                <PlusCircle size={14} />
                เพิ่มผู้ใช้ใหม่
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
                      <th className="p-4">รูปภาพ</th>
                      <th className="p-4">ชื่อ-นามสกุล</th>
                      <th className="p-4">อีเมลหลัก</th>
                      <th className="p-4">บทบาท (Role)</th>
                      <th className="p-4">รหัสนักศึกษา/อาจารย์</th>
                      <th className="p-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {users.map((user) => (
                      <tr key={user.UserID} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="p-4">
                          <img
                            src={user.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                            alt={user.FullName}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block text-gray-900">{user.FullName}</span>
                          {user.Role === 'STUDENT' && (
                            <span className="text-[10px] text-gray-400 font-mono">ที่ปรึกษา: {user.Advisor || 'ไม่มี'}</span>
                          )}
                        </td>
                        <td className="p-4 font-mono">{user.Email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.Role === 'STUDENT'
                              ? 'bg-blue-50 text-blue-700'
                              : user.Role === 'ADVISOR'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {user.Role}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{user.StudentID || 'N/A'}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onDeleteUser(user.UserID)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="ลบบัญชีผู้ใช้"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD USER MODAL */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-gray-900 text-sm">เพิ่มบัญชีผู้ใช้งานใหม่ของระบบดุษฎีบัณฑิต</h3>
                    <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                  </div>

                  <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">บทบาท (Role)</label>
                        <select
                          value={newUserForm.Role}
                          onChange={e => setNewUserForm({ ...newUserForm, Role: e.target.value as any })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="ADVISOR">ADVISOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">รหัสนักศึกษา/บุคลากร (ID)</label>
                        <input
                          type="text"
                          required
                          value={newUserForm.StudentID}
                          onChange={e => setNewUserForm({ ...newUserForm, StudentID: e.target.value })}
                          placeholder="เช่น 6601010024"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-gray-500 block mb-1">ชื่อ-นามสกุล (Full Name)</label>
                      <input
                        type="text"
                        required
                        value={newUserForm.FullName}
                        onChange={e => setNewUserForm({ ...newUserForm, FullName: e.target.value })}
                        placeholder="เช่น ดร. อรพรรณ แก้วดี"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-500 block mb-1">อีเมลผู้ใช้ (Email)</label>
                      <input
                        type="email"
                        required
                        value={newUserForm.Email}
                        onChange={e => setNewUserForm({ ...newUserForm, Email: e.target.value })}
                        placeholder="student@tu.ac.th"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>

                    {newUserForm.Role === 'STUDENT' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-gray-500 block mb-1">อาจารย์ที่ปรึกษาหลัก</label>
                          <select
                            value={newUserForm.Advisor}
                            onChange={e => setNewUserForm({ ...newUserForm, Advisor: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                          >
                            <option value="">เลือกอาจารย์...</option>
                            {configOptions.filter(c => c.OptionType === 'ADVISOR').map(c => (
                              <option key={c.id} value={c.OptionValue}>{c.OptionValue}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-500 block mb-1">อาจารย์ที่ปรึกษาร่วม</label>
                          <select
                            value={newUserForm.CoAdvisor}
                            onChange={e => setNewUserForm({ ...newUserForm, CoAdvisor: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                          >
                            <option value="">เลือกอาจารย์ร่วม...</option>
                            {configOptions.filter(c => c.OptionType === 'CO_ADVISOR').map(c => (
                              <option key={c.id} value={c.OptionValue}>{c.OptionValue}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl font-semibold"
                      >
                        เพิ่มบัญชีผู้ใช้งาน
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SYSTEM CONFIGURATION MANAGER */}
        {/* ------------------------------------------------------------- */}
        {adminTab === 'configs' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Form to add Option */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <PlusCircle size={16} className="text-tu-red" />
                เพิ่มตัวเลือก Dynamic Dropdown
              </h3>

              <form onSubmit={handleAddConfigSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-gray-500 block mb-1">เลือกคีย์ข้อมูล (Option Type)</label>
                  <select
                    value={newConfigType}
                    onChange={e => setNewConfigType(e.target.value as OptionType)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="ADVISOR">อาจารย์ที่ปรึกษาหลัก (ADVISOR)</option>
                    <option value="CO_ADVISOR">อาจารย์ที่ปรึกษาร่วม (CO_ADVISOR)</option>
                    <option value="CERT_CATEGORY">หมวดหมู่ใบประกาศ (CERT_CATEGORY)</option>
                    <option value="DEGREE">รายการหลักสูตรวิชาการ (DEGREE)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-500 block mb-1">ชื่อค่าตัวเลือก (Option Value)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ดร. นรินทร์ สมบูรณ์"
                    value={newConfigValue}
                    onChange={e => setNewConfigValue(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-tu-red hover:bg-tu-red-hover text-white rounded-xl font-bold transition"
                >
                  บันทึกตัวเลือก (บันทึกลง Google Sheets)
                </button>
              </form>
            </div>

            {/* List current Configs by type */}
            <div className="md:col-span-2 space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="text-sm font-bold text-gray-800">รายการตัวเลือกดร็อปดาวน์ระบบปัจจุบัน</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['ADVISOR', 'CO_ADVISOR', 'CERT_CATEGORY', 'DEGREE'].map((type) => (
                  <div key={type} className="border border-gray-100 p-3.5 rounded-xl bg-gray-50/50 space-y-2 max-h-60 overflow-y-auto">
                    <span className="text-[10px] font-mono font-bold text-tu-red tracking-wider uppercase block border-b border-gray-100 pb-1">
                      {type}
                    </span>
                    <ul className="space-y-1.5">
                      {configOptions
                        .filter(c => c.OptionType === type)
                        .map((opt) => (
                          <li key={opt.id} className="text-xs flex items-center justify-between text-gray-700 bg-white px-2 py-1.5 rounded-lg border border-gray-100/50">
                            <span className="truncate">{opt.OptionValue}</span>
                            <button
                              onClick={() => onDeleteConfigOption(opt.id)}
                              className="text-gray-300 hover:text-red-500 transition ml-2"
                            >
                              <Trash2 size={12} />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SYSTEM AUDIT LOGS TIMELINE */}
        {/* ------------------------------------------------------------- */}
        {adminTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800">ประวัติกิจกรรมความมั่นคงความปลอดภัยของระบบ (System Security Audit Log)</h3>
                <p className="text-xs text-gray-400">บันทึกเรียลไทม์กิจกรรมการบันทึก การอัปโหลด และการซิงค์ตาราง Google Sheets</p>
              </div>
              <button
                onClick={() => setLogs(getLogs())}
                className="flex items-center gap-1 text-xs text-tu-red hover:underline font-semibold"
              >
                <RefreshCw size={12} />
                รีเฟรชบันทึก
              </button>
            </div>

            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.LogID} className="flex items-start gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl text-xs">
                  <div className={`p-1 rounded-full text-white mt-0.5 ${
                    log.Action === 'LOGIN' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}>
                    <KeyRound size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gray-800">{log.Action}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{log.Timestamp}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{log.Details}</p>
                    <span className="text-[9px] font-mono text-gray-400">ผู้ทำรายการ: {log.UserID}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
