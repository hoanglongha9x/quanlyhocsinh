import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit2,
  Phone,
  Home,
  CheckCircle2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { Student, StudentStatus } from '../types';
import { exportStudentsToCsv } from '../services/excelService';
import { StudentImportModal } from './StudentImportModal';
import { StudentDetailModal } from './StudentDetailModal';
import { db } from '../services/db';

interface StudentsViewProps {
  students: Student[];
  onRefresh: () => void;
  incidents: any[];
  attendance: any[];
  progress: any[];
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onRefresh,
  incidents,
  attendance,
  progress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDorm, setSelectedDorm] = useState<string>('ALL');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Quick Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: '',
    fullName: '',
    birthDate: '',
    gender: 'Nam' as 'Nam' | 'Nữ' | 'Khác',
    className: '10A1',
    dormRoom: 'P.201',
    status: 'DANG_HOC' as StudentStatus,
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Bố',
    guardianAddress: '',
    notes: '',
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardian.phone.includes(searchQuery) ||
      s.dormRoom.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    const matchesDorm = selectedDorm === 'ALL' || s.dormRoom === selectedDorm;

    return matchesSearch && matchesClass && matchesStatus && matchesDorm;
  });

  const existingIdsSet = new Set(students.map((s) => s.id.toUpperCase()));

  // Extract unique classes and dorms for filters
  const classesList = Array.from(new Set(students.map((s) => s.className))).filter(Boolean);
  const dormsList = Array.from(new Set(students.map((s) => s.dormRoom))).filter(Boolean);

  const handleOpenDetail = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleExportCsv = () => {
    exportStudentsToCsv(filteredStudents, `Danh_Sach_Hoc_Sinh_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.id.trim() || !newStudent.fullName.trim()) {
      alert('Vui lòng nhập Mã học sinh và Họ tên');
      return;
    }

    try {
      db.addStudent({
        id: newStudent.id.toUpperCase().trim(),
        fullName: newStudent.fullName.trim(),
        birthDate: newStudent.birthDate || '2008-01-01',
        gender: newStudent.gender,
        className: newStudent.className,
        dormRoom: newStudent.dormRoom,
        status: newStudent.status,
        guardian: {
          name: newStudent.guardianName || 'Phụ huynh',
          phone: newStudent.guardianPhone || '',
          relationship: newStudent.guardianRelation || 'Bố/Mẹ',
          address: newStudent.guardianAddress || '',
        },
        notes: newStudent.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsAddModalOpen(false);
      onRefresh();
      // Reset form
      setNewStudent({
        id: '',
        fullName: '',
        birthDate: '',
        gender: 'Nam',
        className: '10A1',
        dormRoom: 'P.201',
        status: 'DANG_HOC',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: 'Bố',
        guardianAddress: '',
        notes: '',
      });
    } catch (err: any) {
      alert(err?.message || 'Lỗi thêm học sinh');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Hồ sơ học sinh nội trú</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Tổng số: {students.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin cá nhân, hồ sơ KTX, người giám hộ và lịch sử rèn luyện
          </p>
        </div>

        {/* Buttons Toolbar: Nhập danh sách học sinh đặt cạnh Xuất CSV */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Nút Nhập danh sách học sinh từ Excel/CSV */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            id="btn-import-students"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:shadow"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập danh sách học sinh</span>
          </button>

          {/* Nút Xuất CSV */}
          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất CSV</span>
          </button>

          {/* Nút Thêm học sinh */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã HS, họ tên, SĐT phụ huynh, phòng KTX..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Lớp */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả lớp</option>
            {classesList.map((c) => (
              <option key={c} value={c}>
                Lớp {c}
              </option>
            ))}
          </select>

          {/* KTX */}
          <select
            value={selectedDorm}
            onChange={(e) => setSelectedDorm(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả phòng KTX</option>
            {dormsList.map((d) => (
              <option key={d} value={d}>
                Phòng {d}
              </option>
            ))}
          </select>

          {/* Trạng thái */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DANG_HOC">Đang học</option>
            <option value="TAM_NGHI">Tạm nghỉ</option>
            <option value="CHUYEN_TRUONG">Chuyển trường</option>
            <option value="DINH_CHI">Đình chỉ</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Phòng KTX</th>
                <th className="py-3 px-4">Giới tính & Ngày sinh</th>
                <th className="py-3 px-4">Người giám hộ & SĐT</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Không tìm thấy học sinh phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử điều chỉnh bộ lọc hoặc bấm "Nhập danh sách học sinh" để thêm mới.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(s)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {s.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {s.fullName.slice(-1)}
                      </div>
                      <div>
                        <div>{s.fullName}</div>
                        {s.notes && (
                          <div className="text-[11px] font-normal text-slate-400 truncate max-w-xs">
                            {s.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                        {s.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      <span className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-slate-400" />
                        {s.dormRoom}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{s.gender}</div>
                      <div className="text-[11px] text-slate-400">{s.birthDate}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium">
                        {s.guardian.name}{' '}
                        <span className="text-slate-400 font-normal">({s.guardian.relationship})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {s.guardian.phone || 'Chưa có'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.status === 'DANG_HOC'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === 'TAM_NGHI'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.status === 'DANG_HOC' ? 'Đang học' : s.status === 'TAM_NGHI' ? 'Tạm nghỉ' : 'Đình chỉ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(s)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Xem chi tiết hồ sơ 360"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer / status */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Hiển thị <strong>{filteredStudents.length}</strong> / <strong>{students.length}</strong> học sinh
          </span>
          <span className="text-[11px] text-slate-400">
            Dữ liệu bảo mật tuân thủ quy định giáo dục nội trú THPT
          </span>
        </div>
      </div>

      {/* Modal Import Excel/CSV */}
      <StudentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingStudentIds={existingIdsSet}
        onImportSuccess={() => {
          onRefresh();
        }}
      />

      {/* Modal Student Detail 360 */}
      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        student={selectedStudent}
        incidents={incidents}
        attendance={attendance}
        progress={progress}
      />

      {/* Modal Quick Add Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Thêm hồ sơ học sinh mới
            </h3>
            <form onSubmit={handleQuickAdd} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã học sinh (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: HS1035"
                    value={newStudent.id}
                    onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lớp</label>
                  <input
                    type="text"
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng KTX</label>
                  <input
                    type="text"
                    value={newStudent.dormRoom}
                    onChange={(e) => setNewStudent({ ...newStudent, dormRoom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ tên phụ huynh</label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn B"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SĐT Phụ huynh</label>
                  <input
                    type="text"
                    placeholder="VD: 0912345678"
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi chú sư phạm</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về sở trường, nề nếp hoặc lưu ý sức khỏe..."
                  value={newStudent.notes}
                  onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
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
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
