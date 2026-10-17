import React from 'react';
import { Bed, BookOpen, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BoardingRecord, Student } from '../types';

interface BoardingViewProps {
  students: Student[];
  boarding: BoardingRecord[];
}

export const BoardingView: React.FC<BoardingViewProps> = ({ students, boarding }) => {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý giờ tự học & Nề nếp KTX</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dành cho Giáo viên Quản nhiệm: theo dõi kỷ luật phòng ở, thiết bị và thói quen tự học buổi tối
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boarding.map((rec) => (
          <div key={rec.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="font-bold text-sm text-slate-800">{rec.studentName}</h4>
                <p className="text-xs text-slate-400">
                  Lớp {rec.className} • Phòng {rec.room} • {rec.date}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                {rec.session === 'TU_HOC_TOI' ? 'Giờ tự học tối' : 'Nề nếp KTX'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className={rec.criteria.punctual ? 'text-emerald-600' : 'text-rose-500'}>
                  {rec.criteria.punctual ? '✓' : '✗'}
                </span>
                <span>Có mặt đúng giờ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={rec.criteria.materialsReady ? 'text-emerald-600' : 'text-rose-500'}>
                  {rec.criteria.materialsReady ? '✓' : '✗'}
                </span>
                <span>Chuẩn bị sách vở</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={rec.criteria.taskCompleted ? 'text-emerald-600' : 'text-rose-500'}>
                  {rec.criteria.taskCompleted ? '✓' : '✗'}
                </span>
                <span>Hoàn thành bài tập</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={rec.criteria.deviceCompliant ? 'text-emerald-600' : 'text-rose-500'}>
                  {rec.criteria.deviceCompliant ? '✓' : '✗'}
                </span>
                <span>Tuân thủ thiết bị</span>
              </div>
            </div>

            {rec.notes && (
              <div className="text-xs bg-slate-50 p-2.5 rounded-lg text-slate-700">
                <span className="font-semibold text-slate-600">Nhận xét GVQN:</span> {rec.notes}
              </div>
            )}

            <div className="text-[11px] text-slate-400 pt-1">Người ghi nhận: {rec.recordedBy}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
