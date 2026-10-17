import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Home,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Bed,
  CheckCircle,
} from 'lucide-react';
import { Student, IncidentReport, AttendanceRecord, ProgressRecord, CoordinationLog } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  incidents: IncidentReport[];
  attendance: AttendanceRecord[];
  progress: ProgressRecord[];
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  incidents,
  attendance,
  progress,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'incidents' | 'attendance' | 'progress'>('profile');

  if (!isOpen || !student) return null;

  const studentIncidents = incidents.filter(
    (i) => i.studentId.toUpperCase() === student.id.toUpperCase()
  );
  const studentAttendance = attendance.filter(
    (a) => a.studentId.toUpperCase() === student.id.toUpperCase()
  );
  const studentProgress = progress.filter(
    (p) => p.studentId.toUpperCase() === student.id.toUpperCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg text-white">
              {student.fullName.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{student.fullName}</h2>
                <span className="px-2 py-0.5 rounded text-xs bg-blue-500/30 font-medium">
                  {student.id}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/30 text-emerald-200 font-medium">
                  {student.className}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Ký túc xá: Phòng {student.dormRoom} • Giới tính: {student.gender} • Ngày sinh: {student.birthDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Hồ sơ & Người giám hộ
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'incidents'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Lịch sử sự việc ({studentIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Chuyên cần & KTX ({studentAttendance.length})
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'progress'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tiến bộ & Khen thưởng ({studentProgress.length})
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin học sinh */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" /> Thông tin học sinh
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Mã học sinh:</span>
                      <span className="font-semibold text-slate-800">{student.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Lớp:</span>
                      <span className="font-semibold text-slate-800">{student.className}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Phòng KTX:</span>
                      <span className="font-semibold text-slate-800">{student.dormRoom}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Trạng thái:</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        {student.status === 'DANG_HOC' ? 'Đang theo học' : student.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phụ huynh / Người giám hộ */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Home className="w-4 h-4 text-indigo-600" /> Người giám hộ & Liên hệ
                  </h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div>
                      <span className="text-slate-400">Họ tên:</span>{' '}
                      <span className="font-semibold text-slate-800">{student.guardian.name}</span>{' '}
                      <span className="text-slate-500">({student.guardian.relationship})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-400">SĐT:</span>{' '}
                      <span className="font-semibold text-slate-800">{student.guardian.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Địa chỉ:</span>{' '}
                      <span className="text-slate-800">{student.guardian.address || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ghi chú sư phạm */}
              <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Ghi chú sư phạm & Đặc điểm học sinh
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {student.notes || 'Chưa có ghi chú đặc biệt cho học sinh này.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="space-y-3">
              {studentIncidents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">Không có ghi nhận vi phạm nào</p>
                  <p className="text-xs text-slate-400 mt-0.5">Em luôn chấp hành tốt nội quy nhà trường và KTX.</p>
                </div>
              ) : (
                studentIncidents.map((inc) => (
                  <div key={inc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-700">{inc.id}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                          {inc.category}
                        </span>
                      </div>
                      <span className="text-slate-400">{inc.dateTime}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{inc.description}</p>
                    <div className="text-slate-500 text-[11px] flex flex-wrap gap-x-4 gap-y-1">
                      <span>Người báo: {inc.reportedBy}</span>
                      <span>Trạng thái: <strong>{inc.status}</strong></span>
                      {inc.actionDecision && <span>Biện pháp: {inc.actionDecision}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-3">
              {studentAttendance.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  Chưa có dữ liệu điểm danh tháng này.
                </div>
              ) : (
                studentAttendance.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800">{att.date}</span>
                      <span className="text-slate-400 ml-2">Buổi {att.session}</span>
                      {att.note && <p className="text-slate-500 text-[11px] mt-0.5">{att.note}</p>}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        att.status === 'CO_MAT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'DI_MUON'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {att.status === 'CO_MAT' ? 'Có mặt' : att.status === 'DI_MUON' ? 'Đi muộn' : 'Vắng'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-3">
              {studentProgress.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  Chưa có bản ghi tiến bộ hoặc tuyên dương.
                </div>
              ) : (
                studentProgress.map((prog) => (
                  <div key={prog.id} className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-emerald-900">{prog.category}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-200 text-emerald-900">
                          {prog.level}
                        </span>
                      </div>
                      <span className="text-slate-400">{prog.date}</span>
                    </div>
                    <p className="text-slate-800">{prog.content}</p>
                    <div className="text-slate-500 text-[11px]">Người ghi nhận: {prog.recordedBy}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
