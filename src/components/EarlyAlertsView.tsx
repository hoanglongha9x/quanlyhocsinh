import React from 'react';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Flame, ShieldCheck } from 'lucide-react';
import { EarlyAlert } from '../types';
import { db } from '../services/db';

interface EarlyAlertsViewProps {
  alerts: EarlyAlert[];
  onRefresh: () => void;
}

export const EarlyAlertsView: React.FC<EarlyAlertsViewProps> = ({ alerts, onRefresh }) => {
  const handleResolveAlert = (id: string, isFalseAlert = false) => {
    db.updateAlert(id, {
      status: isFalseAlert ? 'CANH_BAO_SAI' : 'DA_GIAI_QUYET',
      resolvedAt: new Date().toLocaleString('vi-VN'),
      resolutionNotes: isFalseAlert ? 'Xác minh thông tin là cảnh báo sai/đã kiểm tra kỹ' : 'Đã trao đổi sư phạm và có biện pháp hỗ trợ',
    });
    onRefresh();
  };

  const handleConfirmAlert = (id: string) => {
    db.updateAlert(id, {
      status: 'DA_XAC_NHAN',
    });
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Hệ thống cảnh báo sớm sư phạm</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {alerts.length} cảnh báo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cơ chế kích hoạt theo quy tắc ngưỡng: Mức 1, Mức 2, Mức 3 và Khẩn cấp. Chống trùng lặp tự động.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            Hiện không có cảnh báo nào đang mở.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-5 rounded-2xl border shadow-xs space-y-3 transition-all ${
                alert.severity === 'KHAN_CAP'
                  ? 'border-rose-400 bg-rose-50/20'
                  : alert.severity === 'MUC_3'
                  ? 'border-amber-300'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {alert.id}
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {alert.studentName} ({alert.className})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      alert.severity === 'KHAN_CAP'
                        ? 'bg-rose-100 text-rose-800'
                        : alert.severity === 'MUC_3'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.severity === 'KHAN_CAP' ? 'Khẩn cấp an toàn' : alert.severity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      alert.status === 'DA_GIAI_QUYET'
                        ? 'bg-emerald-100 text-emerald-800'
                        : alert.status === 'CANH_BAO_SAI'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {alert.status === 'DA_GIAI_QUYET'
                      ? 'Đã giải quyết'
                      : alert.status === 'CANH_BAO_SAI'
                      ? 'Cảnh báo sai'
                      : alert.status === 'DA_XAC_NHAN'
                      ? 'Đã tiếp nhận'
                      : 'Đang chờ xử lý'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Quy tắc kích hoạt:
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">{alert.ruleTriggered}</p>
                <p className="text-[11px] text-slate-500 mt-1">Căn cứ: {alert.basisData}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                <div>
                  Người phụ trách: <strong>{alert.assignedStaff}</strong> • Hạn xử lý: <strong className="text-rose-600">{alert.deadline}</strong>
                </div>

                {alert.status !== 'DA_GIAI_QUYET' && alert.status !== 'CANH_BAO_SAI' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmAlert(alert.id)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Xác nhận tiếp nhận
                    </button>
                    <button
                      onClick={() => handleResolveAlert(alert.id, false)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Đã giải quyết
                    </button>
                    <button
                      onClick={() => handleResolveAlert(alert.id, true)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer"
                    >
                      Báo sai
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
