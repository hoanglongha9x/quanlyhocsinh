import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { Student } from '../types';
import { apiService } from '../services/api';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, students }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'HS1001');
  const [actionType, setActionType] = useState<'draft_message' | 'support_plan' | 'summarize_student'>('draft_message');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const handleConsult = async () => {
    setIsLoading(true);
    setAiOutput(null);

    try {
      const result = await apiService.consultAI(actionType, {
        studentId: currentStudent?.id,
        studentName: currentStudent?.fullName,
        className: currentStudent?.className,
        dormRoom: currentStudent?.dormRoom,
        topic: topic || 'nề nếp tự học buổi tối và chuyên cần',
        notes: currentStudent?.notes,
      });
      setAiOutput(result);
    } catch (err: any) {
      setAiOutput(`Lỗi khi tham vấn AI: ${err?.message || 'Không thể kết nối'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-indigo-700 via-blue-700 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Trợ lý Cố vấn Sư phạm ClassCare AI</h2>
              <p className="text-xs text-blue-100">
                Đồng hành cùng Giáo viên Chủ nhiệm xây dựng phương pháp giáo dục tích cực
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Regulatory disclaimer notice */}
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Nguyên tắc sư phạm:</strong> Mọi kết quả từ AI chỉ mang tính chất đề xuất tham khảo. AI không tự quyết định hình thức kỷ luật hay thay đổi hạnh kiểm học sinh.
          </span>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn học sinh cần hỗ trợ</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.id} - Lớp {s.className} - KTX {s.dormRoom})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mục tiêu trợ giúp</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActionType('draft_message')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  actionType === 'draft_message'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 mb-1 text-blue-600" />
                Soạn tin nhắn phụ huynh
              </button>
              <button
                type="button"
                onClick={() => setActionType('support_plan')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  actionType === 'support_plan'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1 text-indigo-600" />
                Gợi ý kế hoạch hỗ trợ
              </button>
              <button
                type="button"
                onClick={() => setActionType('summarize_student')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  actionType === 'summarize_student'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 mb-1 text-emerald-600" />
                Tóm tắt & Phân tích xu hướng
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chi tiết hoặc lưu ý bổ sung (tùy chọn)
            </label>
            <textarea
              rows={2}
              placeholder="VD: Em tiến bộ môn Toán nhưng tuần này đi muộn 1 lần, cần phụ huynh động viên giờ ngủ..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleConsult}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang phân tích sư phạm...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tạo nội dung tư vấn
                </>
              )}
            </button>
          </div>

          {/* AI Result Box */}
          {aiOutput && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Kết quả đề xuất sư phạm:
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Đã sao chép' : 'Sao chép nội dung'}
                </button>
              </div>
              <p className="whitespace-pre-line text-slate-800 leading-relaxed font-sans text-xs">
                {aiOutput}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
