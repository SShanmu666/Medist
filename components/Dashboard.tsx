
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { MedicalRecord, VitalSign, PatientInfo } from '../types';

const mockVitals: VitalSign[] = [
  { timestamp: '08:00', heartRate: 72, systolic: 120, diastolic: 80, spo2: 98 },
  { timestamp: '10:00', heartRate: 75, systolic: 122, diastolic: 82, spo2: 99 },
  { timestamp: '12:00', heartRate: 80, systolic: 118, diastolic: 79, spo2: 97 },
  { timestamp: '14:00', heartRate: 74, systolic: 121, diastolic: 81, spo2: 98 },
  { timestamp: '16:00', heartRate: 71, systolic: 119, diastolic: 80, spo2: 98 },
];

const mockRecords: MedicalRecord[] = [
  { id: '1', date: '2023-10-15', type: 'Lab Report', title: 'Complete Blood Count', provider: 'General Hospital, NYC', summary: 'All parameters within normal range.', severity: 'Normal' },
  { id: '2', date: '2023-09-20', type: 'Imaging', title: 'Chest X-Ray', provider: 'Berlin Diagnostics', summary: 'Clear lung fields, no abnormalities noted.', severity: 'Normal' },
  { id: '3', date: '2023-08-05', type: 'Vaccination', title: 'COVID-19 Booster', provider: 'Global Health Clinic, Tokyo', summary: 'Pfizer-BioNTech (Comirnaty)', severity: 'Normal' },
];

const Dashboard: React.FC<{ patient: PatientInfo }> = ({ patient }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {/* Patient Overview Card */}
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{patient.firstName} {patient.lastName}</h1>
            <p className="text-slate-500 font-medium">Medist ID: <span className="text-blue-600 uppercase">{patient.medistId}</span></p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Blood Type</p>
            <p className="text-lg font-bold text-slate-800">{patient.bloodType}</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">DOB</p>
            <p className="text-lg font-bold text-slate-800">{patient.dob}</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Nationality</p>
            <p className="text-lg font-bold text-slate-800">{patient.nationality}</p>
          </div>
        </div>
      </div>

      {/* Vital Stats */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-heart-pulse text-red-500"></i>
              Real-time Vitals
            </h2>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockVitals}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">Heart Rate</p>
              <p className="text-2xl font-bold text-slate-800">72 <span className="text-sm font-normal text-slate-500">BPM</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <p className="text-sm text-purple-600 font-medium">Blood Pressure</p>
              <p className="text-2xl font-bold text-slate-800">120/80 <span className="text-sm font-normal text-slate-500">mmHg</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
              <p className="text-sm text-orange-600 font-medium">SpO2</p>
              <p className="text-2xl font-bold text-slate-800">98 <span className="text-sm font-normal text-slate-500">%</span></p>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Global Medical History</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {mockRecords.map((record) => (
              <div key={record.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  record.type === 'Lab Report' ? 'bg-cyan-100 text-cyan-600' :
                  record.type === 'Imaging' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <i className={`fa-solid ${
                    record.type === 'Lab Report' ? 'fa-vial' :
                    record.type === 'Imaging' ? 'fa-x-ray' :
                    'fa-syringe'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-slate-800">{record.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">{record.date}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{record.provider}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{record.summary}</p>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-chevron-right text-slate-300 text-sm"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Medist AI Health Score</h2>
            <p className="text-blue-100 text-sm mb-6">Your overall health assessment based on worldwide medical records.</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold">92</span>
              <span className="text-xl mb-1 text-blue-200">/100</span>
            </div>
            <div className="mt-4 w-full bg-blue-400/30 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full" style={{ width: '92%' }}></div>
            </div>
            <p className="mt-4 text-xs font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
              Excellent Health Condition
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 text-[120px]">
            <i className="fa-solid fa-star-of-life"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-robot text-blue-600"></i>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center gap-3 w-full p-4 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-file-arrow-up"></i>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Upload New Report</p>
                <p className="text-xs text-slate-500">AI analysis for your records</p>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Share Digital Profile</p>
                <p className="text-xs text-slate-500">Secure QR code sharing</p>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Consultation</p>
                <p className="text-xs text-slate-500">Connect with local doctors</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
