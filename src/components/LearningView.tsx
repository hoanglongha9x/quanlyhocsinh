import React from 'react';
import { BookOpen, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Student } from '../types';

interface LearningViewProps {
  students: Student[];
}

export const LearningView: React.FC<LearningViewProps> = ({ students }) => {
  const sampleLearningData = [
    {
      id: 'KQ-01',
      studentName: 'Lê Hoàng Nam',
      className: '10A1',
      subject: 'Toán học',
      score: 8.5,
      trend: 'up',
      assessmentType: '1 Tiết',
      date: '12/10/2026',
      teacherNotes: 'Tư duy tốt, hoàn thành bài tập nâng cao đúng hạn.',
    },
    {
      id: 'KQ-02',
      studentName: 'Vũ Quốc Bảo',
      className: '10A1',
      subject: 'Tiếng Anh',
      score: 5.0,
      trend: 'down',
      assessmentType: '15 Phút',
      date: '14/10/2026',
      teacherNotes: 'Giảm 2 điểm so với bài trước, cần bổ sung từ vựng và xem lại bài tập KTX.',
    },
    {
      id: 'KQ-03',
      studentName: 'Phạm Đức Minh',
      className: '10A1',
      subject: 'Vật lý',
      score: 6.5,
      trend: 'down',
      assessmentType: '1 Tiết',
      date: '10/10/2026',
      teacherNotes: 'Chưa tập trung trong giờ tự học tối để giải bài tập.',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý kết quả học tập & Cảnh báo sa sút</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tiến trình các môn học, phát hiện điểm giảm liên tiếp để kịp thời đề xuất biện pháp hỗ trợ sư phạm
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Học sinh</th>
              <th className="py-3 px-4">Môn học</th>
              <th className="py-3 px-4">Bài đánh giá</th>
              <th className="py-3 px-4">Điểm số</th>
              <th className="py-3 px-4">Xu hướng</th>
              <th className="py-3 px-4">Nhận xét của GVBM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sampleLearningData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-800">{item.studentName}</td>
                <td className="py-3 px-4 font-medium text-blue-700">{item.subject}</td>
                <td className="py-3 px-4 text-slate-500">{item.assessmentType} ({item.date})</td>
                <td className="py-3 px-4 font-bold text-sm text-slate-800">{item.score}</td>
                <td className="py-3 px-4">
                  {item.trend === 'up' ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> Tiến bộ
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5" /> Sa sút
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600">{item.teacherNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
