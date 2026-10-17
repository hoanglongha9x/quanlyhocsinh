import React, { useState } from 'react';
import {
  GraduationCap,
  LogOut,
  User,
  Home,
  CalendarCheck,
  Bed,
  BookOpen,
  Award,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Student, AttendanceRecord, BoardingRecord, LearningRecord, ProgressRecord, IncidentReport } from '../types';

interface StudentPortalViewProps {
  student: Student;
  attendance: AttendanceRecord[];
  boarding: BoardingRecord[];
  progress: ProgressRecord[];
  incidents: IncidentReport[];
  onLogout: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  attendance,
  boarding,
  progress,
  incidents,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'boarding' | 'learning' | 'feedback'>('overview');

  // Student specific records only (Filtered by studentId)
  const myAttendance = attendance.filter((a) => a.studentId.toUpperCase() === student.id.toUpperCase());
  const myBoarding = boarding.filter((b) => b.studentId.toUpperCase() === student.id.toUpperCase());
  const myProgress = progress.filter((p) => p.studentId.toUpperCase() === student.id.toUpperCase());
  const myIncidents = incidents.filter((i) => i.studentId.toUpperCase() === student.id.toUpperCase());

  // Feedback form
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const presentCount = myAttendance.filter((a) => a.status === 'CO_MAT').length;
  const lateCount = myAttendance.filter((a) => a.status === 'DI_MUON').length;

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackTitle('');
      setFeedbackContent('');
      setFeedbackSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Student Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-slate-900">
                ClassCare <span className="text-blue-600">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Cổng Học Sinh
              </span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:block">
              Học sinh nội trú • Trường THPT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {student.fullName.slice(-1)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-slate-800 block leading-tight">{student.fullName}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {student.id} • Lớp {student.className} • Phòng {student.dormRoom}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Student Portal Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Student Banner */}
        <div className="bg-linear-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Không gian tra cứu cá nhân bảo mật
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Xin chào, {student.fullName}!
              </h1>
              <p className="text-xs text-blue-100 mt-1 max-w-xl leading-relaxed">
                Mã học sinh: <strong>{student.id}</strong> • Lớp: <strong>{student.className}</strong> • Phòng KTX: <strong>{student.dormRoom}</strong> • Người giám hộ: {student.guardian.name}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="text-[11px] text-blue-200">Trạng thái rèn luyện</div>
              <div className="text-base font-bold text-emerald-300 mt-0.5">
                {student.status === 'DANG_HOC' ? 'Đang học tập tốt' : student.status}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Tổng quan & Lý lịch</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Chuyên cần ({myAttendance.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('boarding')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'boarding'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>Giờ tự học & KTX</span>
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'learning'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tiến bộ & Khen thưởng ({myProgress.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ý kiến & Phản ánh</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Hồ sơ học sinh
              </h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Họ và tên:</span>
                  <span className="font-bold text-slate-800">{student.fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Mã định danh:</span>
                  <span className="font-mono font-bold text-blue-700">{student.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Lớp học:</span>
                  <span className="font-semibold text-slate-800">{student.className}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Phòng KTX nội trú:</span>
                  <span className="font-semibold text-slate-800">{student.dormRoom}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Ngày sinh & Giới tính:</span>
                  <span className="text-slate-800">{student.birthDate} ({student.gender})</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Home className="w-4 h-4 text-indigo-600" /> Người giám hộ & Liên hệ
              </h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Họ tên phụ huynh:</span>
                  <span className="font-bold text-slate-800">{student.guardian.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Mối quan hệ:</span>
                  <span className="font-semibold text-slate-800">{student.guardian.relationship}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-semibold text-emerald-700">{student.guardian.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Địa chỉ gia đình:</span>
                  <span className="text-slate-800">{student.guardian.address || 'Khu vực nội trú'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Lịch sử chuyên cần của em</h3>
                <p className="text-slate-400 text-[11px]">Ghi nhận từ Giáo viên chủ nhiệm & Giáo viên bộ môn</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                {presentCount} buổi có mặt
              </span>
            </div>

            {myAttendance.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                Chưa có dữ liệu điểm danh tháng này.
              </div>
            ) : (
              <div className="space-y-2">
                {myAttendance.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{att.date}</span>
                      <span className="text-slate-400 ml-2">Buổi {att.session}</span>
                      {att.note && <p className="text-[11px] text-slate-500 mt-0.5">{att.note}</p>}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        att.status === 'CO_MAT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {att.status === 'CO_MAT' ? 'Có mặt' : 'Đi muộn / Có phép'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Boarding & Self-Study */}
        {activeTab === 'boarding' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Nề nếp ký túc xá & Giờ tự học tối</h3>
              <p className="text-slate-400 text-[11px]">Được theo dõi và đánh giá khách quan bởi Thầy/Cô Quản nhiệm KTX</p>
            </div>

            {myBoarding.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                Chưa có bản ghi nề nếp KTX trong tuần này. Em tiếp tục duy trì thói quen tốt nhé!
              </div>
            ) : (
              <div className="space-y-3">
                {myBoarding.map((rec) => (
                  <div key={rec.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Ngày {rec.date} • Phòng {rec.room}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {rec.session === 'TU_HOC_TOI' ? 'Giờ tự học tối' : 'Nề nếp KTX'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>Đúng giờ: {rec.criteria.punctual ? '✓ Đạt' : '✗ Cần lưu ý'}</div>
                      <div>Sách vở, bài tập: {rec.criteria.taskCompleted ? '✓ Đạt' : '✗ Chưa xong'}</div>
                      <div>Quy định thiết bị: {rec.criteria.deviceCompliant ? '✓ Tuân thủ' : '✗ Vi phạm'}</div>
                      <div>Vệ sinh phòng: {rec.criteria.cleanliness ? '✓ Sạch sẽ' : '✗ Chưa sạch'}</div>
                    </div>

                    {rec.notes && (
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                        <strong>Lời nhắc của Quản nhiệm:</strong> {rec.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Progress & Awards */}
        {activeTab === 'learning' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Khen thưởng & Ghi nhận tiến bộ</h3>
              <p className="text-slate-400 text-[11px]">Sự nỗ lực và vươn lên của em được nhà trường trân trọng ghi nhận</p>
            </div>

            {myProgress.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                Cố gắng rèn luyện và học tập tích cực để nhận tuyên dương từ thầy cô nhé!
              </div>
            ) : (
              <div className="space-y-3">
                {myProgress.map((prog) => (
                  <div key={prog.id} className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-sm text-emerald-950">{prog.category}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{prog.date}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{prog.content}</p>
                    <div className="text-[11px] text-emerald-800">
                      Người ghi nhận: <strong>{prog.recordedBy}</strong> • Mức độ: <strong>{prog.level}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Feedback / Student statement */}
        {activeTab === 'feedback' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Ý kiến, nguyện vọng & Giải trình sư phạm</h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Em có thể gửi thắc mắc, nguyện vọng học tập hoặc giải trình lý do (nếu có sự việc phát sinh) đến Giáo viên chủ nhiệm
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Ý kiến của em đã được gửi thành công!</h4>
                <p className="text-xs text-emerald-700">
                  Thầy/Cô Giáo viên chủ nhiệm sẽ đọc và phản hồi sớm nhất cho em.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chủ đề:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Em xin phép về muộn giờ tự học tối / Giải trình sự việc..."
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nội dung trình bày (*):</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Trình bày rõ ràng, trung thực và khách quan..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi đến Giáo viên chủ nhiệm</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
