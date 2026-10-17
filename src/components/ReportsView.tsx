import React, { useState } from 'react';
import { FileText, Download, Printer, Calendar, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Student, IncidentReport, EarlyAlert, TaskItem, AttendanceRecord, ProgressRecord, User } from '../types';

interface ReportsViewProps {
  students: Student[];
  incidents: IncidentReport[];
  alerts: EarlyAlert[];
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  progress: ProgressRecord[];
  currentTeacher?: User;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  incidents,
  alerts,
  tasks,
  attendance,
  progress,
  currentTeacher,
}) => {
  const [reportType, setReportType] = useState<'day' | 'week' | 'month'>('week');

  const presentCount = attendance.filter((a) => a.status === 'CO_MAT').length;
  const lateCount = attendance.filter((a) => a.status === 'DI_MUON').length;
  const activeAlerts = alerts.filter((a) => a.status !== 'DA_GIAI_QUYET');
  const closedIncidents = incidents.filter((i) => i.status === 'DA_DONG');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Hệ thống báo cáo sư phạm & Quản lý nội trú</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp dữ liệu thực tế: báo cáo ngày, tuần, tháng và hồ sơ cá nhân học sinh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-slate-300 rounded-xl overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setReportType('day')}
              className={`px-3 py-2 cursor-pointer ${
                reportType === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Báo cáo ngày
            </button>
            <button
              onClick={() => setReportType('week')}
              className={`px-3 py-2 cursor-pointer ${
                reportType === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Báo cáo tuần
            </button>
            <button
              onClick={() => setReportType('month')}
              className={`px-3 py-2 cursor-pointer ${
                reportType === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Báo cáo tháng
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> In báo cáo
          </button>
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="text-center border-b border-slate-200 pb-5 space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            SỞ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG THPT NỘI TRÚ
          </h3>
          <h2 className="text-xl font-black text-slate-900">
            {reportType === 'day'
              ? 'BÁO CÁO CÔNG TÁC CHỦ NHIỆM & NỘI TRÚ TRONG NGÀY'
              : reportType === 'week'
              ? 'BÁO CÁO TỔNG KẾT TUẦN 7 NĂM HỌC 2026 - 2027'
              : 'BÁO CÁO THÁNG VỀ NỀ NẾP & HỌC TẬP HỌC SINH NỘI TRÚ'}
          </h2>
          <p className="text-xs text-slate-500">
            Lớp phụ trách: <strong>10A1</strong> • Giáo viên chủ nhiệm: <strong>{currentTeacher?.name || 'Thầy/Cô Giáo viên chủ nhiệm'}</strong>
          </p>
          <p className="text-[11px] text-slate-400">
            Thời điểm lập: {new Date().toLocaleString('vi-VN')} • Nguồn: Dữ liệu vận hành ClassCare AI
          </p>
        </div>

        {/* 1. Tình hình quân số & Chuyên cần */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-800 border-l-4 border-blue-600 pl-2">
            1. Tình hình quân số và chuyên cần
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Tổng sĩ số</span>
              <span className="text-lg font-bold text-slate-800">{students.length} học sinh</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 block">Có mặt</span>
              <span className="text-lg font-bold text-emerald-800">{presentCount} học sinh</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-800 block">Đi muộn</span>
              <span className="text-lg font-bold text-amber-800">{lateCount} trường hợp</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-800 block">Nội trú KTX</span>
              <span className="text-lg font-bold text-blue-800">{students.length} em ở KTX</span>
            </div>
          </div>
        </div>

        {/* 2. Tình hình sự việc & Kỷ luật sư phạm */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-800 border-l-4 border-amber-500 pl-2">
            2. Tình hình nề nếp, sự việc và phòng ngừa tái phạm
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed space-y-1">
            <p>
              • Tổng số vụ việc ghi nhận trong kỳ báo cáo: <strong>{incidents.length}</strong> sự việc.
            </p>
            <p>
              • Đã xác minh khách quan và đóng hồ sơ theo dõi: <strong>{closedIncidents.length}</strong> sự việc.
            </p>
            <p>
              • Số cảnh báo tái phạm Mức 2 và Mức 3 đang hỗ trợ can thiệp: <strong>{activeAlerts.length}</strong> trường hợp.
            </p>
          </div>
        </div>

        {/* 3. Tuyên dương học sinh tiến bộ */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-800 border-l-4 border-emerald-600 pl-2">
            3. Danh sách học sinh có tiến bộ nổi bật và tuyên dương
          </h3>
          <div className="space-y-2 text-xs">
            {progress.map((p) => (
              <div key={p.id} className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                <strong>{p.studentName}:</strong> {p.content} ({p.level})
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 pt-8 text-center text-xs text-slate-700">
          <div>
            <p className="font-bold">GIÁO VIÊN CHỦ NHIỆM</p>
            <p className="text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
            <p className="font-semibold mt-2">{currentTeacher?.name || 'Giáo viên chủ nhiệm'}</p>
          </div>
          <div>
            <p className="font-bold">HIỆU TRƯỞNG / BAN GIÁM HIỆU</p>
            <p className="text-slate-400 mt-12">(Phê duyệt)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
