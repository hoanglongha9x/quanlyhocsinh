import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Award,
  ShieldAlert,
  Calendar,
  ArrowRight,
  Flame,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import { Student, IncidentReport, EarlyAlert, TaskItem, AttendanceRecord, ProgressRecord, User } from '../types';

interface DashboardViewProps {
  students: Student[];
  incidents: IncidentReport[];
  alerts: EarlyAlert[];
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  progress: ProgressRecord[];
  onNavigate: (tab: string) => void;
  onOpenImport: () => void;
  currentTeacher?: User;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  incidents,
  alerts,
  tasks,
  attendance,
  progress,
  onNavigate,
  onOpenImport,
  currentTeacher,
}) => {
  // Real calculations
  const totalStudents = students.length;

  const presentCount = attendance.filter((a) => a.status === 'CO_MAT').length;
  const lateCount = attendance.filter((a) => a.status === 'DI_MUON').length;
  const absentCount = attendance.filter((a) => a.status.startsWith('VANG')).length;
  const unverifiedAbsent = attendance.filter((a) => a.status === 'VANG_CHUA_XAC_MINH').length;

  // Incidents
  const activeIncidents = incidents.filter((i) => i.status !== 'DA_DONG');
  const verifyingIncidents = incidents.filter((i) => i.status === 'DANG_XAC_MINH' || i.status === 'MOI_TIEP_NHAN');

  // Alerts
  const activeAlerts = alerts.filter((a) => a.status === 'DANG_CHO' || a.status === 'DANG_XU_LY');
  const emergencyAlerts = alerts.filter((a) => a.severity === 'KHAN_CAP' && a.status !== 'DA_GIAI_QUYET');
  const repeatViolations = alerts.filter((a) => a.type === 'TAI_PHAM' && a.status !== 'DA_GIAI_QUYET');

  // Tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'DA_HOAN_THANH' && t.status !== 'DA_HUY');
  const overdueTasks = tasks.filter((t) => t.status === 'QUA_HAN');

  // Categories breakdown
  const categoryCounts = incidents.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner with Welcome and Quick Action */}
      <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 mb-2">
              <Calendar className="w-3.5 h-3.5" /> Học kỳ I • Năm học 2026 - 2027
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Bảng điều khiển Sư phạm: {currentTeacher?.name || 'Giáo viên chủ nhiệm'}
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Theo dõi chuyên cần, nề nếp giờ tự học, phòng ngừa vi phạm và đồng hành cùng sự tiến bộ của học sinh nội trú lớp {currentTeacher?.assignedClass || '10A1'}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenImport}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Nhập danh sách học sinh (Excel)</span>
            </button>
            <button
              onClick={() => onNavigate('alerts')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer border border-white/20"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Cảnh báo ({activeAlerts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency alert banner if exists */}
      {emergencyAlerts.length > 0 && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-3 text-rose-900 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Cảnh báo khẩn cấp cần xử lý ngay!</h4>
              <p className="text-xs text-rose-700">
                Có {emergencyAlerts.length} cảnh báo mức độ an toàn nghiêm trọng cần kích hoạt quy trình của nhà trường.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Xem ngay
          </button>
        </div>
      )}

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng sĩ số nội trú</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">{totalStudents}</div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">{presentCount} có mặt</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{lateCount} đi muộn</span>
          </div>
        </div>

        {/* Chuyên cần hôm nay */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vắng mặt / Chưa xác minh</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {absentCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({unverifiedAbsent} chưa xác minh)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Cần GVCN & Quản nhiệm xác minh lý do
          </div>
        </div>

        {/* Sự việc đang xử lý & tái phạm */}
        <div
          onClick={() => onNavigate('incidents')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sự việc & Tái phạm</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {activeIncidents.length}{' '}
            <span className="text-xs font-normal text-rose-600 font-medium">
              ({repeatViolations.length} tái phạm)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {verifyingIncidents.length} vụ việc đang xác minh
          </div>
        </div>

        {/* Nhiệm vụ & Nhắc việc */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Nhiệm vụ cần xử lý</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {pendingTasks.length}{' '}
            <span className="text-xs font-normal text-rose-600 font-semibold">
              ({overdueTasks.length} quá hạn)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Ưu tiên hoàn thành nhiệm vụ trước 24h
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Tasks & Incidents Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Urgent Tasks & Early Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cảnh báo sớm cần xử lý */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-800">
                  Cảnh báo sớm sư phạm ({activeAlerts.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  Không có cảnh báo tồn đọng nào cần xử lý.
                </div>
              ) : (
                activeAlerts.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 bg-slate-50/80 hover:bg-amber-50/50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-blue-700">{a.id}</span>
                        <span className="font-semibold text-xs text-slate-800">{a.studentName} ({a.className})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.severity === 'KHAN_CAP'
                              ? 'bg-rose-100 text-rose-800'
                              : a.severity === 'MUC_3'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{a.ruleTriggered}</p>
                      <p className="text-[11px] text-slate-400">Căn cứ: {a.basisData}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-rose-600 font-semibold block">Hạn: {a.deadline}</span>
                      <button
                        onClick={() => onNavigate('alerts')}
                        className="mt-1 px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg cursor-pointer"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nhiệm vụ trọng tâm hôm nay */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  Công việc GVCN & Quản nhiệm hôm nay
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Quản lý việc <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 rounded-full ${
                        t.priority === 'CAO' ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800">{t.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Phụ trách: {t.assignedTo} • Hạn chót: <strong>{t.dueDate}</strong>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      t.status === 'DA_HOAN_THANH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status === 'DA_HOAN_THANH' ? 'Hoàn thành' : 'Đang thực hiện'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution & Commendations */}
        <div className="space-y-6">
          {/* Phân bố sự việc theo nhóm */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Phân bố nhóm sự việc
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Thiết bị điện tử', count: categoryCounts['THIET_BI_DIEN_TU'] || 1, total: 5, color: 'bg-amber-500' },
                { name: 'Chuyên cần & đi muộn', count: categoryCounts['CHUYEN_CAN'] || 1, total: 5, color: 'bg-blue-500' },
                { name: 'Quy định giờ tự học', count: categoryCounts['GIO_TU_HOC'] || 1, total: 5, color: 'bg-indigo-500' },
                { name: 'Nội quy ký túc xá', count: categoryCounts['NOI_QUY_KTX'] || 0, total: 5, color: 'bg-rose-500' },
                { name: 'Nhiệm vụ học tập', count: categoryCounts['NHIEM_VU_HOC_TAP'] || 0, total: 5, color: 'bg-teal-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.count} vụ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${Math.min(100, (item.count / 3) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tuyên dương học sinh có tiến bộ */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Tuyên dương tiến bộ tuần này
              </h3>
              <button
                onClick={() => onNavigate('progress')}
                className="text-xs text-blue-600 font-semibold cursor-pointer"
              >
                Chi tiết
              </button>
            </div>

            <div className="space-y-3">
              {progress.slice(0, 2).map((p) => (
                <div key={p.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-950">{p.studentName}</span>
                    <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                      {p.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
