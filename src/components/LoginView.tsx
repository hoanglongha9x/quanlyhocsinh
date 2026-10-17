import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  School,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { AuthSession, Role, Student, User } from '../types';
import { db, TEACHER_ACCOUNTS } from '../services/db';

interface LoginViewProps {
  onLogin: (session: AuthSession) => void;
  availableStudents: Student[];
  onDataReset: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  availableStudents,
  onDataReset,
}) => {
  // Stream tab: 'TEACHER' or 'STUDENT'
  const [activeStream, setActiveStream] = useState<'TEACHER' | 'STUDENT'>('TEACHER');

  // Teacher Form State
  const [teacherName, setTeacherName] = useState(() => {
    try {
      return localStorage.getItem('classcare_teacher_name') || 'Thầy Hoàng Long Hà';
    } catch {
      return 'Thầy Hoàng Long Hà';
    }
  });
  const [teacherEmail, setTeacherEmail] = useState('hoanglongha.9x@gmail.com');
  const [teacherPassword, setTeacherPassword] = useState('••••••••');
  const [teacherRole, setTeacherRole] = useState<Role>('GVCN');

  // Student Form State
  const [studentIdInput, setStudentIdInput] = useState('HS1001');
  const [studentPassword, setStudentPassword] = useState('••••••••');
  const [studentError, setStudentError] = useState<string | null>(null);

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = teacherName.trim() || 'Thầy/Cô Giáo Viên';
    try {
      localStorage.setItem('classcare_teacher_name', cleanName);
    } catch {}

    const userToLogin: User = {
      id: 'GV001',
      name: cleanName,
      role: teacherRole,
      email: teacherEmail.trim() || 'gv@thpt.edu.vn',
      assignedClass: '10A1',
      subject: teacherRole === 'GVBM' ? 'Môn học' : 'Toán học',
      dormArea: 'Khu A - Tầng 2',
    };

    onLogin({
      type: 'TEACHER',
      teacher: userToLogin,
    });
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const student = db.authenticateStudent(studentIdInput);
    if (!student) {
      setStudentError(
        `Không tìm thấy mã học sinh "${studentIdInput.toUpperCase()}". Vui lòng kiểm tra lại mã định danh do nhà trường cấp.`
      );
      return;
    }

    onLogin({
      type: 'STUDENT',
      student,
    });
  };

  const handleQuickTeacherLogin = (role: Role) => {
    const cleanName = teacherName.trim() || 'Thầy Hoàng Long Hà';
    try {
      localStorage.setItem('classcare_teacher_name', cleanName);
    } catch {}

    onLogin({
      type: 'TEACHER',
      teacher: {
        id: 'GV001',
        name: cleanName,
        role: role,
        email: teacherEmail || (role === 'GVCN' ? 'gvcn@thpt.edu.vn' : 'gvqn@thpt.edu.vn'),
        assignedClass: '10A1',
        subject: role === 'GVBM' ? 'Môn học' : 'Toán học',
        dormArea: 'Khu A - Tầng 2',
      },
    });
  };

  const handleQuickStudentLogin = (studentId: string) => {
    const student = db.authenticateStudent(studentId);
    if (student) {
      onLogin({
        type: 'STUDENT',
        student,
      });
    }
  };

  const handleResetToClean = () => {
    if (confirm('Bạn có muốn xóa dữ liệu mẫu để hệ thống sạch sẽ, sẵn sàng nhập danh sách học sinh từ file Excel?')) {
      db.clearAllData();
      onDataReset();
    }
  };

  const handleRestoreMinimal = () => {
    db.resetToMinimal();
    onDataReset();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-tight">
              ClassCare <span className="text-blue-400 font-extrabold">AI</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Hệ thống Quản lý Giáo dục & Nội trú THPT Sư phạm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToClean}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-800"
            title="Xóa trắng toàn bộ dữ liệu mẫu"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa sạch dữ liệu mẫu</span>
          </button>
          <button
            onClick={handleRestoreMinimal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-800"
            title="Khôi phục 2 học sinh mẫu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dữ liệu mẫu tối giản</span>
          </button>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Stream Selector Buttons (2 Luồng Đăng Nhập) */}
          <div className="grid grid-cols-2 p-2 bg-slate-100/90 border-b border-slate-200 text-xs font-bold gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveStream('TEACHER');
                setStudentError(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all cursor-pointer ${
                activeStream === 'TEACHER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Cán bộ & Giáo viên</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveStream('STUDENT');
                setStudentError(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all cursor-pointer ${
                activeStream === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Học sinh nội trú</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Stream 1: Giáo viên & Cán bộ */}
            {activeStream === 'TEACHER' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900">
                    Cổng thông tin Giáo viên & Quản nhiệm
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhập họ tên của bạn để hệ thống cá nhân hóa toàn bộ hồ sơ, báo cáo và lớp chủ nhiệm
                  </p>
                </div>

                <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs">
                  {/* Họ và tên giáo viên */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Họ và tên của Thầy/Cô (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Nhập họ và tên của Thầy/Cô (VD: Thầy Hoàng Long Hà)"
                      className="w-full px-3.5 py-2.5 bg-blue-50/60 border border-blue-300 rounded-xl font-bold text-sm text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tên của Thầy/Cô sẽ hiển thị trên góc giao diện, sổ điểm danh, sổ trực KTX và biên bản báo cáo.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vai trò công tác (*):
                    </label>
                    <select
                      value={teacherRole}
                      onChange={(e) => {
                        const r = e.target.value as Role;
                        setTeacherRole(r);
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="GVCN">Giáo viên chủ nhiệm (Toàn quyền lớp phụ trách)</option>
                      <option value="GVQN">Giáo viên Quản nhiệm KTX (Nề nếp, tự học, phòng ở)</option>
                      <option value="GVBM">Giáo viên Bộ môn (Điểm số, chuyên cần môn học)</option>
                      <option value="BGH">Ban Giám Hiệu (Tổng quan toàn trường & báo cáo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email / Tài khoản công vụ (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="VD: hoanglongha.9x@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mật khẩu:
                    </label>
                    <input
                      type="password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Đăng nhập với tên {teacherName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick teacher login demo buttons */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                    Đăng nhập nhanh theo vai trò:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleQuickTeacherLogin('GVCN')}
                      className="p-2.5 text-left bg-blue-50 hover:bg-blue-100/80 rounded-xl border border-blue-200 text-blue-900 transition-colors cursor-pointer"
                    >
                      <div className="font-bold truncate">{teacherName || 'Tôi'} (GVCN)</div>
                      <div className="text-[10px] text-blue-700">Chủ nhiệm lớp 10A1</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTeacherLogin('GVQN')}
                      className="p-2.5 text-left bg-indigo-50 hover:bg-indigo-100/80 rounded-xl border border-indigo-200 text-indigo-900 transition-colors cursor-pointer"
                    >
                      <div className="font-bold truncate">{teacherName || 'Tôi'} (GVQN)</div>
                      <div className="text-[10px] text-indigo-700">Quản nhiệm KTX</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stream 2: Học sinh nội trú */}
            {activeStream === 'STUDENT' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900">
                    Cổng tra cứu Học sinh nội trú
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Học sinh tra cứu chuyên cần, nề nếp KTX, giờ tự học, kết quả học tập và khen thưởng của cá nhân
                  </p>
                </div>

                <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mã học sinh (*):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={studentIdInput}
                        onChange={(e) => {
                          setStudentIdInput(e.target.value);
                          setStudentError(null);
                        }}
                        placeholder="VD: HS1001, HS1002 hoặc mã từ file Excel"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-500 uppercase"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Nhập mã học sinh do nhà trường cấp (không phân biệt chữ hoa/thường)
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mật khẩu cá nhân / Ngày sinh:
                    </label>
                    <input
                      type="password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Mặc định là ngày sinh hoặc mật khẩu được cấp"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {studentError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{studentError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>Đăng nhập Cổng Học sinh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick student selection from current database */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                    Học sinh có sẵn trong hệ thống:
                  </span>
                  {availableStudents.length === 0 ? (
                    <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200 text-center">
                      Chưa có học sinh nào. Giáo viên có thể đăng nhập để nhập danh sách từ file Excel.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {availableStudents.slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setStudentIdInput(s.id);
                            handleQuickStudentLogin(s.id);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-xl font-medium transition-colors cursor-pointer"
                        >
                          <strong className="font-mono text-blue-600">{s.id}</strong> - {s.fullName} ({s.dormRoom})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-800/60 bg-slate-900/60">
        ClassCare AI • Bảo mật dữ liệu học sinh & Sư phạm nội trú THPT
      </footer>
    </div>
  );
};
