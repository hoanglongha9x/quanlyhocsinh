import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Eye,
} from 'lucide-react';
import { IncidentReport, IncidentCategory, IncidentStatus, Student, User } from '../types';
import { db } from '../services/db';

interface IncidentsViewProps {
  incidents: IncidentReport[];
  students: Student[];
  onRefresh: () => void;
  currentTeacher?: User;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({ incidents, students, onRefresh, currentTeacher }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Incident form
  const [newIncident, setNewIncident] = useState({
    studentId: students[0]?.id || 'HS1001',
    category: 'THIET_BI_DIEN_TU' as IncidentCategory,
    dateTime: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    location: 'Phòng KTX',
    description: '',
    source: 'GV Quản nhiệm kiểm tra nề nếp',
    assignedStaff: currentTeacher ? `${currentTeacher.name} (${currentTeacher.role})` : 'Giáo viên chủ nhiệm',
    actionDecision: '',
  });

  const filteredIncidents = incidents.filter((i) => {
    const matchesSearch =
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || i.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || i.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newIncident.studentId);
    if (!student || !newIncident.description.trim()) {
      alert('Vui lòng chọn học sinh và nhập nội dung mô tả');
      return;
    }

    const created: IncidentReport = {
      id: `SV-2026-${String(incidents.length + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: student.fullName,
      className: student.className,
      dateTime: newIncident.dateTime,
      location: newIncident.location,
      category: newIncident.category,
      description: newIncident.description,
      reportedBy: currentTeacher?.name || 'Giáo viên phụ trách',
      reporterRole: currentTeacher?.role || 'GVCN',
      source: newIncident.source,
      status: 'MOI_TIEP_NHAN',
      assignedStaff: newIncident.assignedStaff,
      actionDecision: newIncident.actionDecision,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toLocaleString('vi-VN'),
          action: 'Tiếp nhận báo cáo sự việc',
          staff: currentTeacher?.name || 'Giáo viên phụ trách',
        },
      ],
    };

    db.addIncident(created);
    setIsAddModalOpen(false);
    onRefresh();
  };

  const handleUpdateStatus = (id: string, status: IncidentStatus) => {
    db.updateIncident(id, {
      status,
      closedAt: status === 'DA_DONG' ? new Date().toLocaleString('vi-VN') : undefined,
    });
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Quản lý vi phạm và sự việc nội trú</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {incidents.length} sự việc
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy trình xác minh khách quan 7 bước, không quy chụp và lưu trữ lịch sử xử lý sư phạm
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi nhận sự việc mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã sự việc, học sinh, nội dung..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
        >
          <option value="ALL">Tất cả nhóm sự việc</option>
          <option value="THIET_BI_DIEN_TU">Thiết bị điện tử</option>
          <option value="CHUYEN_CAN">Chuyên cần & đi muộn</option>
          <option value="GIO_TU_HOC">Vi phạm giờ tự học</option>
          <option value="NOI_QUY_KTX">Nội quy ký túc xá</option>
          <option value="NHIEM_VU_HOC_TAP">Nhiệm vụ học tập</option>
          <option value="AN_TOAN">An toàn & trật tự</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="MOI_TIEP_NHAN">Mới tiếp nhận</option>
          <option value="DANG_XAC_MINH">Đang xác minh</option>
          <option value="DANG_XU_LY">Đang xử lý</option>
          <option value="DANG_THEO_DOI">Đang theo dõi</option>
          <option value="DA_DONG">Đã đóng</option>
        </select>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            Không tìm thấy sự việc nào phù hợp.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700 text-xs px-2 py-0.5 bg-blue-50 rounded">
                    {inc.id}
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {inc.studentName} ({inc.className})
                  </span>
                  <span className="text-xs text-slate-400">• {inc.dateTime}</span>
                  <span className="text-xs text-slate-500">tại {inc.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inc.status}
                    onChange={(e) => handleUpdateStatus(inc.id, e.target.value as IncidentStatus)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="MOI_TIEP_NHAN">Mới tiếp nhận</option>
                    <option value="DANG_XAC_MINH">Đang xác minh</option>
                    <option value="CHUA_DU_CAN_CU">Chưa đủ căn cứ</option>
                    <option value="CHO_QUYET_DINH">Chờ quyết định</option>
                    <option value="DANG_XU_LY">Đang xử lý</option>
                    <option value="DANG_THEO_DOI">Đang theo dõi</option>
                    <option value="DA_DONG">Đã đóng</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {inc.description}
              </p>

              {inc.studentStatement && (
                <div className="text-xs bg-slate-50 p-2.5 rounded-lg border-l-2 border-blue-500 text-slate-600">
                  <span className="font-semibold text-slate-700">Ý kiến học sinh:</span> {inc.studentStatement}
                </div>
              )}

              {inc.actionDecision && (
                <div className="text-xs bg-blue-50/60 p-2.5 rounded-lg border-l-2 border-emerald-500 text-slate-700">
                  <span className="font-semibold text-emerald-800">Biện pháp giáo dục sư phạm:</span> {inc.actionDecision}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-3">
                  <span>Người ghi nhận: <strong>{inc.reportedBy}</strong></span>
                  <span>Phụ trách: <strong>{inc.assignedStaff}</strong></span>
                  <span>Nguồn: {inc.source}</span>
                </div>
                {inc.followUpDeadline && (
                  <span className="text-amber-700 font-semibold">
                    Thời hạn theo dõi: {inc.followUpDeadline}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Incident */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Ghi nhận sự việc mới
            </h3>
            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Học sinh liên quan (*)</label>
                <select
                  value={newIncident.studentId}
                  onChange={(e) => setNewIncident({ ...newIncident, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.id} - Lớp {s.className} - KTX {s.dormRoom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhóm hành vi (*)</label>
                  <select
                    value={newIncident.category}
                    onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="THIET_BI_DIEN_TU">Sử dụng điện thoại/thiết bị</option>
                    <option value="CHUYEN_CAN">Chuyên cần & đi muộn</option>
                    <option value="GIO_TU_HOC">Vi phạm giờ tự học</option>
                    <option value="NOI_QUY_KTX">Nội quy ký túc xá</option>
                    <option value="NHIEM_VU_HOC_TAP">Nhiệm vụ học tập</option>
                    <option value="AN_TOAN">An toàn & trật tự</option>
                    <option value="KHAC">Nhóm khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung mô tả khách quan (*)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả sự việc một cách khách quan, ghi rõ thời gian, hành vi cụ thể..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Biện pháp sư phạm bước đầu</label>
                <input
                  type="text"
                  placeholder="VD: Nhắc nhở, trao đổi riêng, hướng dẫn lập thời gian biểu tự học..."
                  value={newIncident.actionDecision}
                  onChange={(e) => setNewIncident({ ...newIncident, actionDecision: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu sự việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
