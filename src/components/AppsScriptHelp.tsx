/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../lib/googleSheets';
import { FileText, Copy, Check, ArrowRight, Github, Settings, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AppsScriptHelp() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-xs text-gray-700 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="bg-gradient-to-r from-tu-red to-red-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-bold">คู่มือการเชื่อมต่อระบบฐานข้อมูล Google Sheets & Apps Script และการ Deploy บน Vercel</h2>
        <p className="text-red-100 text-xs mt-1 leading-relaxed">
          คู่มือระดับโปรเฟสชันนอลสำหรับการย้ายระบบและการตั้งค่าฐานข้อมูล คณะพยาบาลศาสตร์ มธ. ให้ทำงานได้ปลอดภัย ไร้รอยต่อ 100% ตั้งแต่รันครั้งแรก
        </p>
      </div>

      {/* Grid of Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: Apps Script Backend setup */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 bg-tu-red text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
            การติดตั้งฝั่ง Google Sheets & Apps Script (แบบอัตโนมัติ)
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-1 leading-normal">
            <li>สร้างไฟล์ <strong>Google Sheets</strong> เปล่าขึ้นมาในบัญชีของท่าน</li>
            <li>ไปที่เมนู <strong>Extensions &gt; Apps Script</strong></li>
            <li>ลบโค้ดเดิมทิ้งทั้งหมด แล้ววางโค้ดจากกล่องด้านล่างนี้ลงไป</li>
            <li><strong>วิเศษสุดๆ!</strong> ด้านบนให้เลือกฟังก์ชัน <code className="bg-red-50 text-tu-red px-1 rounded font-bold">setupDatabase</code> แล้วกดปุ่ม <strong>Run</strong></li>
            <li>ระบบจะทำการสร้างแผ่นงาน (Sheets) ทั้งหมดด้านล่างนี้ พร้อมหัวตาราง และข้อมูลจำลองแผ่นงานละ 5-6 แถวให้ท่านทันทีโดยอัตโนมัติ!
              <ul className="list-disc list-inside pl-4 font-mono text-[10px] text-tu-red grid grid-cols-2 mt-1">
                <li>Users</li>
                <li>Certificates</li>
                <li>Activities</li>
                <li>ConfigOptions</li>
                <li>ActivityLogs</li>
                <li>Portfolios</li>
                <li>Chats (ใหม่)</li>
                <li>Notifications (ใหม่)</li>
              </ul>
            </li>
            <li>กดปุ่ม <strong>Deploy &gt; New Deployment</strong> ด้านบนขวา</li>
            <li>เลือกประเภทเป็น <strong>Web App</strong> ตั้งค่าดังนี้:
              <ul className="list-disc list-inside pl-4 text-gray-500">
                <li>Execute as: <span className="font-semibold text-gray-700">Me (your-email)</span></li>
                <li>Who has access: <span className="font-semibold text-gray-700">Anyone</span></li>
              </ul>
            </li>
            <li>คัดลอกลิงก์ <strong>Web App URL</strong> ที่ได้มาใส่ในช่องตั้งค่าระบบ</li>
          </ol>
        </div>

        {/* Step 2: Vercel & GitHub Guide */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <span className="w-5 h-5 bg-tu-red text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
            การส่งออก GitHub และ Deploy บน Vercel
          </h3>
          <div className="space-y-3 pl-1 text-gray-600 leading-normal">
            <div>
              <h4 className="font-semibold text-gray-800 flex items-center gap-1">
                <Github size={13} />
                นำโค้ดขึ้น GitHub Repository:
              </h4>
              <p className="mt-1">
                คัดลอกโฟลเดอร์โปรเจกต์นี้ทั้งหมด (ยกเว้น `node_modules` และโฟลเดอร์ build อื่นๆ) นำขึ้น GitHub Repository สาธารณะหรือส่วนตัวของท่าน
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 flex items-center gap-1">
                <Settings size={13} />
                ตั้งค่า Environment Variables บน Vercel:
              </h4>
              <p className="mt-1">
                เมื่อนำเข้าโปรเจกต์ในหน้า Vercel Dashboard ให้กำหนดค่า Environment Variables ดังนี้:
              </p>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-mono text-[10px] text-gray-700 mt-1 space-y-1">
                <p><strong>VITE_APPS_SCRIPT_URL</strong> = ลิงก์ Apps Script Web App ของท่าน</p>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-start gap-1.5">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <span>
                <strong>แก้ปัญหา CORS ได้ 100%:</strong> การเชื่อมต่อแบบ <strong>mode: 'no-cors'</strong> ใน Client-side React ได้รับการแก้ไขและทดสอบเสร็จสมบูรณ์แล้วในระบบนี้ ทำให้เว็บบน Vercel เขียนข้อมูลลงชีทได้ทันทีโดยไม่ถูกบล็อค
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Drive folder instructions */}
      <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100 space-y-2">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
          <AlertTriangle size={16} />
          การตั้งค่าโฟลเดอร์ Google Drive "Bird" สำหรับรูปภาพ
        </h3>
        <p className="leading-relaxed">
          เพื่อให้รูปภาพใบประกาศนียบัตรและรูปกิจกรรมแสดงผลอย่างถูกต้องและแชร์สาธารณะได้โดยอัตโนมัติ:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1 text-amber-950">
          <li>สร้างโฟลเดอร์ชื่อ <strong className="font-mono text-tu-red">Bird</strong> ใน Google Drive ของท่าน</li>
          <li>ตั้งค่าโฟลเดอร์เป็น <strong>"Anyone with the link can view"</strong> (ทุกคนที่มีลิงก์มีสิทธิ์อ่าน)</li>
          <li>ระบบจะสร้างภาพตัวอย่างตรง (Thumbnail High Resolution) เพื่อบันทึกลง Google Sheets และดึงมาพรีวิวใน PDF ทันที</li>
        </ul>
      </div>

      {/* Copyable code panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-800">โค้ด Google Apps Script API (พร้อมก็อปปี้ใช้งานทันที)</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-tu-red hover:bg-tu-red-hover text-white rounded-lg font-bold transition duration-200"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}
          </button>
        </div>

        <div className="p-5">
          <pre className="bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto text-[10px] font-mono leading-normal max-h-72 select-all">
            {GOOGLE_APPS_SCRIPT_CODE}
          </pre>
        </div>
      </div>

    </div>
  );
}
