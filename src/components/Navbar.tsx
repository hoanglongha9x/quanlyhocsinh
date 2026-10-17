import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Shield,
  Bell,
  Search,
  User,
  Menu,
} from 'lucide-react';
import { Role, User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType;
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  selectedClass: string;
  onChangeClass: (className: string) => void;
  onOpenAiAssistant: () => void;
  onToggleSidebar?: () => void;
  alertCount: number;
  onOpenAlerts: () => void;
  onLogout: () => void;
  onResetData: () => void;
  onUpdateTeacherName?: (newName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onChangeRole,
  selectedClass,
  onChangeClass,
  onOpenAiAssistant,
  onToggleSidebar,
  alertCount,
  onOpenAlerts,
  onLogout,
  onResetData,
  onUpdateTeacherName,
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [newNameInput, setNewNameInput] = React.useState(currentUser.name);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNameInput.trim() && onUpdateTeacherName) {
      onUpdateTeacherName(newNameInput.trim());
    }
    setIsEditingName(false);
  };
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Brand */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-base tracking-tight text-slate-900 block leading-tight">
              ClassCare <span className="text-blue-600 font-extrabold">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest hidden sm:block">
              Nội trú THPT
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Class Selector */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
        <span className="text-slate-500 pl-2">Lớp phụ trách:</span>
        {(['10A1', '11B2', '12C3'] as const).map((c) => (
          <button
            key={c}
            onClick={() => onChangeClass(c)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              selectedClass === c ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Right: AI Assistant Button + Role Switcher + Alerts + Profile + Logout */}
      <div className="flex items-center gap-2.5">
        {/* Gemini AI Pedagogical Assistant button */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Cố vấn AI</span>
        </button>

        {/* Alert notification badge */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Cảnh báo sớm"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* Role Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
          <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as Role)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="GVCN">Vai trò: GVCN (Chủ nhiệm)</option>
            <option value="GVBM">Vai trò: GVBM (Bộ môn)</option>
            <option value="GVQN">Vai trò: GVQN (Quản nhiệm KTX)</option>
            <option value="BGH">Vai trò: BGH (Quản trị)</option>
            <option value="PHU_HUYNH">Vai trò: Phụ huynh</option>
          </select>
        </div>

        {/* Profile Avatar with click to edit name */}
        <div
          onClick={() => {
            setNewNameInput(currentUser.name);
            setIsEditingName(true);
          }}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors group"
          title="Bấm để đổi tên giáo viên hiển thị"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            {currentUser.name.trim().slice(-2)}
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <span className="font-bold text-slate-900 block truncate max-w-36 group-hover:text-blue-600">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {currentRole} • Lớp {selectedClass} (Đổi tên)
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
          title="Đăng xuất về màn hình chọn luồng"
        >
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>

      {/* Edit Teacher Name Modal */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Đổi tên Giáo viên hiển thị</h3>
            <p className="text-slate-500 mb-4">
              Nhập tên Thầy/Cô để hiển thị trên toàn hệ thống và trong các báo cáo, biên bản:
            </p>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên của Thầy/Cô (*):</label>
                <input
                  type="text"
                  required
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  placeholder="VD: Thầy Hoàng Long Hà"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
