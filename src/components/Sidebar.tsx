import React from 'react';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  ShieldAlert,
  ListTodo,
  CalendarCheck,
  Bed,
  BookOpen,
  MessageSquare,
  Award,
  FileBarChart,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: Role;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  alertCount: number;
  taskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  isOpenMobile,
  onCloseMobile,
  alertCount,
  taskCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard tổng quan', icon: LayoutDashboard },
    { id: 'students', label: 'Hồ sơ học sinh', icon: Users, badge: null },
    { id: 'incidents', label: 'Sự việc & Vi phạm', icon: AlertTriangle },
    { id: 'alerts', label: 'Cảnh báo sớm', icon: ShieldAlert, badge: alertCount > 0 ? alertCount : null, badgeColor: 'bg-amber-500' },
    { id: 'tasks', label: 'Nhắc việc đến hạn', icon: ListTodo, badge: taskCount > 0 ? taskCount : null, badgeColor: 'bg-indigo-500' },
    { id: 'attendance', label: 'Quản lý chuyên cần', icon: CalendarCheck },
    { id: 'boarding', label: 'Giờ tự học & KTX', icon: Bed },
    { id: 'learning', label: 'Kết quả học tập', icon: BookOpen },
    { id: 'coordination', label: 'Phối hợp 4 bên', icon: MessageSquare },
    { id: 'progress', label: 'Tiến bộ & Tuyên dương', icon: Award },
    { id: 'reports', label: 'Hệ thống báo cáo', icon: FileBarChart },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 transition-transform duration-200 border-r border-slate-800 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top items */}
        <div className="py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Phân hệ chức năng
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300">
              {currentRole}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${
                      item.badgeColor || 'bg-blue-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
          <div className="text-[11px] font-medium text-slate-400">ClassCare AI • THPT Nội Trú</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Phiên bản Sư phạm v1.0.0</div>
        </div>
      </aside>
    </>
  );
};
