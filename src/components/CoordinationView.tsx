import React from 'react';
import { MessageSquare, Plus, ArrowRight, UserCheck } from 'lucide-react';
import { CoordinationLog, Student } from '../types';

interface CoordinationViewProps {
  students: Student[];
}

export const CoordinationView: React.FC<CoordinationViewProps> = ({ students }) => {
  const sampleLogs: CoordinationLog[] = [
    {
      id: 'PH-001',
      studentId: 'HS1003',
      studentName: 'Phạm Đức Minh',
      initiator: 'Thầy Trần Đình Khang (GVQN)',
      recipient: 'Thầy Nguyễn Văn An (GVCN)',
      recipientRole: 'GVCN',
      dateTime: '15/10/2026 21:30',
      content: 'Bàn giao thông tin học sinh sử dụng điện thoại chơi game trong giờ tự học tối tại phòng B202.',
      agreedAction: 'GVCN gặp gỡ học sinh vào sáng hôm sau, thông báo phụ huynh tình hình nề nếp.',
      assignedStaff: 'Thầy Nguyễn Văn An',
      responseDeadline: '16/10/2026 12:00',
      outcome: 'GVCN đã tiếp nhận, mời học sinh trao đổi và thống nhất kế hoạch tự học.',
      status: 'DA_HOAN_THANH',
    },
    {
      id: 'PH-002',
      studentId: 'HS1005',
      studentName: 'Vũ Quốc Bảo',
      initiator: 'Thầy Nguyễn Văn An (GVCN)',
      recipient: 'Bác Vũ Đình Cường (Phụ huynh)',
      recipientRole: 'PHU_HUYNH',
      dateTime: '16/10/2026 09:00',
      content: 'Trao đổi qua điện thoại về tình hình sức khỏe và hiện tượng thức khuya ngủ quên giờ học sáng.',
      agreedAction: 'Gia đình cùng quản nhiệm nhắc nhở em tắt đèn ngủ đúng 22h30.',
      assignedStaff: 'Thầy Nguyễn Văn An & GVQN',
      responseDeadline: '18/10/2026',
      status: 'DANG_PHOI_HOP',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nhật ký phối hợp 4 bên sư phạm</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GVCN tổng hợp thông tin, điều phối hỗ trợ giữa GVBM, GVQN và gia đình học sinh
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sampleLogs.map((log) => (
          <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {log.id}
                </span>
                <span className="font-bold text-sm text-slate-800">{log.studentName}</span>
                <span className="text-xs text-slate-400">• {log.dateTime}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  log.status === 'DA_HOAN_THANH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {log.status === 'DA_HOAN_THANH' ? 'Đã hoàn thành' : 'Đang phối hợp'}
              </span>
            </div>

            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-500">Khởi tạo:</span> {log.initiator} →{' '}
              <span className="font-semibold text-slate-500">Người nhận:</span> {log.recipient}
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-medium">{log.content}</p>

            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 text-xs text-blue-950 space-y-1">
              <div>
                <strong>Hành động đã thống nhất:</strong> {log.agreedAction}
              </div>
              {log.outcome && (
                <div className="text-emerald-800">
                  <strong>Kết quả sau phối hợp:</strong> {log.outcome}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
