/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, Notification } from '../types';
import { getChats, saveChat, getNotifications, saveNotification, logActivity } from '../lib/googleSheets';
import { MessageSquare, Bell, Send, UserCheck, RefreshCw, Clock, AlertTriangle, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdvisoryChatProps {
  currentUser: User;
  allUsers: User[];
  onRefreshDB: () => Promise<void>;
}

export default function AdvisoryChat({
  currentUser,
  allUsers,
  onRefreshDB
}: AdvisoryChatProps) {
  // Database states
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active interaction states
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notif'>('chat');

  // Input states
  const [messageInput, setMessageInput] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [sendingNotif, setSendingNotif] = useState(false);

  // Chat scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const allChats = await getChats();
      const allNotifs = await getNotifications();
      setChats(allChats);
      setNotifications(allNotifs);
    } catch (e) {
      console.error('Error fetching advisory chat/notif data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Scroll to bottom on new chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeContactId, activeTab]);

  // Determine contacts
  // A Student can chat with their Advisor and CoAdvisor.
  // An Advisor can chat with any student that lists them as Advisor or CoAdvisor.
  const myContacts: User[] = [];

  if (currentUser.Role === 'STUDENT') {
    // Find the Advisor and CoAdvisor user objects in the system
    const mainAdvisorName = currentUser.Advisor || '';
    const coAdvisorName = currentUser.CoAdvisor || '';

    // Main Advisor
    const mainAdvisorUser = allUsers.find(
      u => u.Role === 'ADVISOR' && mainAdvisorName.includes(u.FullName)
    );
    if (mainAdvisorUser) {
      myContacts.push({
        ...mainAdvisorUser,
        FullName: `[อาจารย์ที่ปรึกษาหลัก] ${mainAdvisorUser.FullName}`
      });
    } else if (mainAdvisorName) {
      // Create a virtual user if not found in db
      myContacts.push({
        UserID: 'ADVISOR-VIRTUAL-MAIN',
        Email: 'advisor@tu.ac.th',
        FullName: `[อาจารย์ที่ปรึกษาหลัก] ${mainAdvisorName}`,
        Role: 'ADVISOR'
      });
    }

    // Co-Advisor
    const coAdvisorUser = allUsers.find(
      u => u.Role === 'ADVISOR' && coAdvisorName.includes(u.FullName)
    );
    if (coAdvisorUser) {
      myContacts.push({
        ...coAdvisorUser,
        FullName: `[อาจารย์ที่ปรึกษาร่วม] ${coAdvisorUser.FullName}`
      });
    } else if (coAdvisorName) {
      myContacts.push({
        UserID: 'ADVISOR-VIRTUAL-CO',
        Email: 'coadvisor@tu.ac.th',
        FullName: `[อาจารย์ที่ปรึกษาร่วม] ${coAdvisorName}`,
        Role: 'ADVISOR'
      });
    }
  } else if (currentUser.Role === 'ADVISOR' || currentUser.Role === 'ADMIN') {
    // Find all students that have this Advisor or CoAdvisor
    const students = allUsers.filter(u => u.Role === 'STUDENT');
    students.forEach(s => {
      const isMain = s.Advisor && s.Advisor.includes(currentUser.FullName);
      const isCo = s.CoAdvisor && s.CoAdvisor.includes(currentUser.FullName);
      
      if (isMain || isCo || currentUser.Role === 'ADMIN') {
        let rolePrefix = '';
        if (isMain) rolePrefix = '🎓 [ที่ปรึกษาหลัก] ';
        else if (isCo) rolePrefix = '🤝 [ที่ปรึกษาร่วม] ';
        else rolePrefix = '👤 [นักศึกษา] ';

        myContacts.push({
          ...s,
          FullName: `${rolePrefix}${s.FullName}`
        });
      }
    });
  }

  // Pre-select first contact
  useEffect(() => {
    if (myContacts.length > 0 && !activeContactId) {
      setActiveContactId(myContacts[0].UserID);
    }
  }, [myContacts, activeContactId]);

  const activeContact = myContacts.find(c => c.UserID === activeContactId) || myContacts[0];

  // Filter messages for current active conversation
  const activeMessages = chats.filter(msg => {
    if (!activeContact) return false;
    
    // Check match combinations
    // Sender ID is CurrentUser, Receiver ID is Contact, OR vice versa
    const isSentByMe = msg.SenderID === currentUser.UserID && msg.ReceiverID === activeContact.UserID;
    const isSentByContact = msg.SenderID === activeContact.UserID && msg.ReceiverID === currentUser.UserID;

    // Fallback match using Student ID as well, since ReceiverID/SenderID might vary
    const isStudentStudent = (currentUser.Role === 'STUDENT' && activeContact.Role === 'ADVISOR') || (currentUser.Role === 'ADVISOR' && activeContact.Role === 'STUDENT');
    if (isStudentStudent) {
      const studentId = currentUser.Role === 'STUDENT' ? currentUser.StudentID : activeContact.StudentID;
      const advisorUserId = currentUser.Role === 'ADVISOR' ? currentUser.UserID : activeContact.UserID;
      
      const isStudentToAdvisor = msg.SenderID === studentId && msg.ReceiverID === advisorUserId;
      const isAdvisorToStudent = msg.SenderID === advisorUserId && msg.ReceiverID === studentId;
      
      if (isStudentToAdvisor || isAdvisorToStudent) return true;
    }

    return isSentByMe || isSentByContact;
  });

  // Filter notifications for active student contact or current user
  const activeNotifications = notifications.filter(notif => {
    if (currentUser.Role === 'STUDENT') {
      // Show all notifications received by this student
      return notif.ReceiverID === currentUser.StudentID || notif.ReceiverID === currentUser.UserID;
    } else {
      // Advisor views notifications sent to the active student
      if (!activeContact) return false;
      const targetId = activeContact.StudentID || activeContact.UserID;
      return notif.ReceiverID === targetId && notif.SenderID === currentUser.UserID;
    }
  });

  // Actions
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContact) return;

    setSendingChat(true);
    const newMsg: ChatMessage = {
      MessageID: `MSG-${Date.now()}`,
      SenderID: currentUser.Role === 'STUDENT' && currentUser.StudentID ? currentUser.StudentID : currentUser.UserID,
      SenderName: currentUser.FullName,
      ReceiverID: activeContact.Role === 'STUDENT' && activeContact.StudentID ? activeContact.StudentID : activeContact.UserID,
      MessageText: messageInput,
      Timestamp: new Date().toISOString()
    };

    try {
      await saveChat(newMsg);
      setChats(prev => [...prev, newMsg]);
      setMessageInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingChat(false);
    }
  };

  const handleSendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim() || !activeContact) return;

    setSendingNotif(true);
    const targetStudentID = activeContact.StudentID || activeContact.UserID;
    const newNotif: Notification = {
      NotificationID: `NOT-${Date.now()}`,
      SenderID: currentUser.UserID,
      SenderName: currentUser.FullName,
      ReceiverID: targetStudentID,
      Title: notifTitle,
      MessageText: notifMessage,
      Timestamp: new Date().toISOString(),
      IsRead: false
    };

    try {
      await saveNotification(newNotif);
      setNotifications(prev => [newNotif, ...prev]);
      setNotifTitle('');
      setNotifMessage('');
      logActivity(currentUser.UserID, 'SEND_ADVISOR_REMINDER', `Sent warning/alert reminder to student ${activeContact.FullName}`);
      alert('ส่งแจ้งเตือนด่วนไปยังนักศึกษาสำเร็จแล้ว!');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingNotif(false);
    }
  };

  const handleMarkAsRead = async (notif: Notification) => {
    const updated = { ...notif, IsRead: true };
    try {
      await saveNotification(updated);
      setNotifications(prev => prev.map(n => n.NotificationID === notif.NotificationID ? updated : n));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    } catch (e) {
      return '';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 h-[650px]">
      
      {/* LEFT COLUMN: Contacts Panel */}
      <div className="md:col-span-1 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-tu-red" />
            <span className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">
              {currentUser.Role === 'STUDENT' ? 'คณาจารย์ผู้ดูแล' : 'นักศึกษาในการดูแล'}
            </span>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-1.5 text-gray-400 hover:text-tu-red rounded-lg transition hover:bg-red-50"
            title="รีเฟรชข้อมูลแชท"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {myContacts.map(contact => {
            const isActive = activeContactId === contact.UserID;
            
            // Count unread chats/notifications for highlight
            const unreadChats = chats.filter(c => c.SenderID === contact.UserID && c.ReceiverID === currentUser.UserID).length;
            const unreadNotifs = notifications.filter(n => n.SenderID === contact.UserID && n.ReceiverID === currentUser.UserID && !n.IsRead).length;

            return (
              <button
                key={contact.UserID}
                onClick={() => {
                  setActiveContactId(contact.UserID);
                }}
                className={`w-full text-left p-3 rounded-xl transition duration-200 flex items-center gap-3 border ${
                  isActive
                    ? 'bg-white border-red-200 text-tu-red shadow-xs font-bold'
                    : 'border-transparent text-gray-700 hover:bg-white/80'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                    alt={contact.FullName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                  />
                  {(unreadChats > 0 || unreadNotifs > 0) && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-tu-red text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadChats + unreadNotifs}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs truncate text-gray-800">{contact.FullName}</h4>
                  <p className="text-[9px] font-mono text-gray-400 truncate mt-0.5">
                    {contact.Role === 'STUDENT' ? `รหัส: ${contact.StudentID || 'N/A'}` : contact.Email}
                  </p>
                </div>
              </button>
            );
          })}

          {myContacts.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-xs">
              <AlertCircle size={20} className="mx-auto mb-2 text-gray-300" />
              ไม่มีรายชื่ออาจารย์หรือนักศึกษาผู้ดูแล
            </div>
          )}
        </div>
        
        {/* User identification badge */}
        <div className="p-3 bg-white border-t border-gray-100 text-center text-[10px] text-gray-400 shrink-0">
          เข้าใช้งานเป็น: <span className="font-bold text-gray-700">{currentUser.FullName}</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat & Notifications Panels */}
      <div className="md:col-span-3 flex flex-col bg-white">
        
        {activeContact ? (
          <>
            {/* Header section */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeContact.PhotoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                  alt={activeContact.FullName}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{activeContact.FullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                    <span className="font-semibold text-tu-red uppercase bg-red-50 px-1.5 py-0.5 rounded text-[8px]">
                      {activeContact.Role}
                    </span>
                    {activeContact.Role === 'STUDENT' && (
                      <span className="text-gray-400 font-mono">รหัสนักศึกษา: {activeContact.StudentID}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggle panels between Chat Room and Notification/Reminder */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === 'chat'
                      ? 'bg-white text-tu-red shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <MessageSquare size={13} />
                  แชทพูดคุย
                </button>
                <button
                  onClick={() => setActiveTab('notif')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === 'notif'
                      ? 'bg-white text-tu-red shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Bell size={13} />
                  {currentUser.Role === 'STUDENT' ? 'การแจ้งเตือนพอร์ต' : 'ส่งใบเตือนด่วน'}
                </button>
              </div>
            </div>

            {/* TAB 1: Chat Message Room */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.map((msg) => {
                    const isMe = msg.SenderID === currentUser.UserID || msg.SenderID === currentUser.StudentID;
                    return (
                      <div
                        key={msg.MessageID}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-1 px-1">
                          <span className="font-bold">{isMe ? 'คุณ' : msg.SenderName}</span>
                          <span className="font-mono">{formatTime(msg.Timestamp)}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-lg shadow-2xs leading-relaxed text-xs ${
                            isMe
                              ? 'bg-tu-red text-white rounded-tr-none'
                              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          {msg.MessageText}
                        </div>
                      </div>
                    );
                  })}

                  {activeMessages.length === 0 && (
                    <div className="text-center py-20 text-gray-400 text-xs">
                      <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                      ไม่มีข้อความสนทนาในห้องนี้ เริ่มเขียนคำทักทายได้เลยค่ะ
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Send message Form */}
                <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    placeholder="พิมพ์ข้อความปรึกษาอาจารย์หรือนักศึกษาที่นี่..."
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-tu-red text-xs"
                  />
                  <button
                    type="submit"
                    disabled={sendingChat}
                    className="bg-tu-red hover:bg-tu-red-hover text-white px-4 py-2 rounded-xl transition duration-150 flex items-center justify-center shrink-0 disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Alerts and Notifications Tab */}
            {activeTab === 'notif' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* ADVISOR ROLE: Create dynamic Warning Notification Reminder */}
                {currentUser.Role !== 'STUDENT' && (
                  <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-3">
                    <div className="flex items-center gap-2 text-tu-red">
                      <ShieldAlert size={16} />
                      <h4 className="font-bold text-xs uppercase tracking-wider">
                        ส่งข้อแนะนำ/ตักเตือน/แจ้งเตือนด่วนไปยังคุณ {activeContact.FullName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      ส่งการแจ้งเตือนเรื่องกำหนดการยื่นสอบ หัวข้อวิจัย ชั่วโมงความคืบหน้า หรือการแก้ไขที่อยากให้ทำทันที ข้อความนี้จะเด้งแสดงผลบนแดชบอร์ดของนักศึกษา
                    </p>

                    <form onSubmit={handleSendNotif} className="space-y-3 pt-1 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          หัวเรื่องการเตือน (Title)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น แจ้งเตือนเรื่องการยื่นแก้ไขโครงร่าง IRB ล่าช้า"
                          value={notifTitle}
                          onChange={e => setNotifTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-tu-red"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1">
                          รายละเอียดข้อความเตือนภัย (Warning Detail)
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="กรุณาเขียนคำแนะนำโดยละเอียด เพื่อให้นักศึกษาเข้ามาตรวจสอบพอร์ตโฟลิโอสะสม..."
                          value={notifMessage}
                          onChange={e => setNotifMessage(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-tu-red resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sendingNotif}
                        className="bg-tu-red hover:bg-tu-red-hover text-white px-4 py-2.5 rounded-xl transition font-bold text-xs tracking-wider flex items-center gap-1.5"
                      >
                        <Bell size={13} />
                        {sendingNotif ? 'กำลังส่งเตือน...' : 'ส่งแจ้งเตือนด่วนไปยังนักศึกษา'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Notifications Log / Timeline List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" />
                      {currentUser.Role === 'STUDENT' ? 'รายการแจ้งเตือนจากอาจารย์ที่ปรึกษา' : 'ประวัติคำสั่งเตือนที่ส่งไปแล้ว'}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400">
                      จำนวนทั้งหมด {activeNotifications.length} รายการ
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeNotifications.map((notif) => {
                      const isUnread = !notif.IsRead && currentUser.Role === 'STUDENT';
                      return (
                        <div
                          key={notif.NotificationID}
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            isUnread
                              ? 'bg-amber-50/50 border-amber-200 shadow-xs ring-1 ring-amber-200'
                              : 'bg-white border-gray-100 shadow-2xs'
                          } flex items-start gap-4`}
                        >
                          <div className={`p-2.5 rounded-xl ${isUnread ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isUnread ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="font-bold text-xs text-gray-900">{notif.Title}</h5>
                              <span className="text-[9px] text-gray-400 font-mono flex items-center gap-1 shrink-0">
                                <Clock size={10} />
                                {formatDate(notif.Timestamp)} {formatTime(notif.Timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                              {notif.MessageText}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] text-gray-400">
                                ผู้ส่ง: <span className="font-bold text-gray-600">{notif.SenderName}</span>
                              </span>
                              
                              {isUnread && (
                                <button
                                  onClick={() => handleMarkAsRead(notif)}
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                                >
                                  <UserCheck size={10} />
                                  ทำเครื่องหมายว่าอ่านแล้ว
                                </button>
                              )}

                              {!isUnread && currentUser.Role === 'STUDENT' && (
                                <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                  <CheckCircle size={10} />
                                  รับทราบคำเตือนแล้ว
                                </span>
                              )}

                              {currentUser.Role !== 'STUDENT' && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  notif.IsRead ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {notif.IsRead ? 'นักศึกษาอ่านแล้ว' : 'นักศึกษายังไม่ได้เปิดอ่าน'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {activeNotifications.length === 0 && (
                      <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
                        <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                        ไม่มีรายการแจ้งเตือนพิเศษในขณะนี้
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-gray-400">
            <MessageSquare size={48} className="text-gray-200 mb-2 animate-bounce" />
            <h4 className="font-bold text-gray-700 text-sm">ยินดีต้อนรับสู่ระบบห้องสนทนาของที่ปรึกษา</h4>
            <p className="text-xs max-w-sm mt-1 leading-relaxed">
              กรุณาเลือกรายชื่อผู้ใช้ทางด้านซ้ายเพื่อเปิดช่องแชทส่วนตัว หรือส่งใบเตือนข้อกำหนดสำคัญต่อนักศึกษาในความดูแลสะสมผลงาน
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
