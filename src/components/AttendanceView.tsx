import React, { useState } from 'react';
import { UserCheck, UserX, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';
import { db } from '../services/db';

interface AttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onRefresh: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ students, attendance, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-16');
  const [selectedSession, setSelectedSession] = useState<'SANG' | 'CHIEU' | 'TOI'>('SANG');

  const handleUpdateStatus = (student: Student, status: AttendanceStatus) => {
    const existing = attendance.find(
      (a) => a.studentId === student.id && a.date === selectedDate && a.session === selectedSession
    );

    if (existing) {
      existing.status = status;
      existing.updatedAt = new Date().toISOString();
      db.recordAttendance(existing);
    } else {
      const record: AttendanceRecord = {
        id: `CC-${Date.now().toString().slice(-4)}`,
        studentId: student.id,
        studentName: student.fullName,
        className: student.className,
        date: selectedDate,
        session: selectedSession,
        status,
        verifiedBy: 'Thầy Nguyễn Văn An (GVCN)',
        updatedAt: new Date().toISOString(),
      };
      db.recordAttendance(record);
    }
    onRefresh();
  };

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate && a.session === selectedSession
    );
    return record?.status || 'CO_MAT';
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý chuyên cần học sinh</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Điểm danh nhanh theo buổi học, không tự kết luận vắng không phép khi chưa xác minh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold"
          />
          <div className="flex border border-slate-300 rounded-lg overflow-hidden text-xs font-semibold">
            {(['SANG', 'CHIEU', 'TOI'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSession(s)}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  selectedSession === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                }`}
              >
                Buổi {s === 'SANG' ? 'Sáng' : s === 'CHIEU' ? 'Chiều' : 'Tối'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp & KTX</th>
                <th className="py-3 px-4 text-center">Trạng thái điểm danh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentStatus = getStudentStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{student.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{student.fullName}</td>
                    <td className="py-3 px-4 text-slate-500">
                      Lớp {student.className} • Phòng {student.dormRoom}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(student, 'CO_MAT')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            currentStatus === 'CO_MAT'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          Có mặt
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(student, 'DI_MUON')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            currentStatus === 'DI_MUON'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                          }`}
                        >
                          Đi muộn
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(student, 'VANG_CO_PHEP')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            currentStatus === 'VANG_CO_PHEP'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                          }`}
                        >
                          Vắng có phép
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(student, 'VANG_CHUA_XAC_MINH')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            currentStatus === 'VANG_CHUA_XAC_MINH'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                          }`}
                        >
                          Chưa xác minh
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
