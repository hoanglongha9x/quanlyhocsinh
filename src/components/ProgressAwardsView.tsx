import React, { useState } from 'react';
import { Award, Plus, Sparkles, HeartHandshake, CheckCircle } from 'lucide-react';
import { ProgressRecord, ProgressCategory, Student } from '../types';
import { db } from '../services/db';

interface ProgressAwardsViewProps {
  students: Student[];
  progress: ProgressRecord[];
  onRefresh: () => void;
}

export const ProgressAwardsView: React.FC<ProgressAwardsViewProps> = ({
  students,
  progress,
  onRefresh,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProg, setNewProg] = useState({
    studentId: students[0]?.id || 'HS1001',
    category: 'HOC_TAP' as ProgressCategory,
    content: '',
    level: 'TIEN_BO_RO_RET' as 'TIEN_BO_RO_RET' | 'XUAT_SAC' | 'GUONG_MAU',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newProg.studentId);
    if (!student || !newProg.content.trim()) return;

    const record: ProgressRecord = {
      id: `TB-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.fullName,
      className: student.className,
      date: new Date().toLocaleDateString('vi-VN'),
      category: newProg.category,
      content: newProg.content,
      recordedBy: 'Thầy Nguyễn Văn An (GVCN)',
      level: newProg.level,
    };

    db.addProgress(record);
    setIsAddOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Theo dõi tiến bộ & Tuyên dương tích cực</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghi nhận từng nỗ lực vươn lên của học sinh: chuyên cần, nề nếp, học tập, giúp đỡ bạn bè và phong trào
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi nhận tiến bộ mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {progress.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2.5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{item.studentName}</h4>
                  <span className="text-xs text-slate-400">Lớp {item.className} • {item.date}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {item.level === 'GUONG_MAU' ? 'Gương mẫu' : item.level === 'XUAT_SAC' ? 'Xuất sắc' : 'Tiến bộ rõ rệt'}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.content}</p>

            <div className="text-[11px] text-slate-400 pt-1">
              Người ghi nhận: <strong>{item.recordedBy}</strong>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Ghi nhận tiến bộ học sinh</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Học sinh (*)</label>
                <select
                  value={newProg.studentId}
                  onChange={(e) => setNewProg({ ...newProg, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lĩnh vực tiến bộ</label>
                  <select
                    value={newProg.category}
                    onChange={(e) => setNewProg({ ...newProg, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="HOC_TAP">Học tập</option>
                    <option value="CHUYEN_CAN">Chuyên cần</option>
                    <option value="NE_NEP">Nề nếp KTX</option>
                    <option value="TRACH_NHIEM">Trách nhiệm chung</option>
                    <option value="HO_TRO_BAN_BE">Hỗ trợ bạn học</option>
                    <option value="PHONG_TRAO">Phong trào</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức độ ghi nhận</label>
                  <select
                    value={newProg.level}
                    onChange={(e) => setNewProg({ ...newProg, level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="TIEN_BO_RO_RET">Tiến bộ rõ rệt</option>
                    <option value="XUAT_SAC">Xuất sắc</option>
                    <option value="GUONG_MAU">Gương mẫu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung tuyên dương (*)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ghi nhận thành tích, thái độ tích cực hoặc tiến bộ cụ thể..."
                  value={newProg.content}
                  onChange={(e) => setNewProg({ ...newProg, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Lưu tuyên dương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
