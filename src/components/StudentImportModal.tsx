import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { parseExcelOrCsv, generateTemplate, ParseResult } from '../services/excelService';
import { apiService, ImportApiResponse } from '../services/api';
import { Student } from '../types';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingStudentIds: Set<string>;
  onImportSuccess: (result: ImportApiResponse) => void;
}

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  isOpen,
  onClose,
  existingStudentIds,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<ImportApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'valid' | 'invalid'>('valid');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParseError(null);
    setImportResult(null);
    await processFile(file);
  };

  const processFile = async (file: File, sheetName?: string) => {
    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseExcelOrCsv(file, sheetName, existingStudentIds);
      setParseResult(result);
      setSelectedSheet(result.currentSheet);
      setActiveTab(result.validRows.length > 0 ? 'valid' : 'invalid');
    } catch (err: any) {
      console.error('File parsing error:', err);
      setParseError(err?.message || 'Không thể đọc tệp. Vui lòng kiểm tra định dạng .xlsx, .xls hoặc .csv.');
      setParseResult(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSheetChange = async (newSheet: string) => {
    if (!selectedFile) return;
    setSelectedSheet(newSheet);
    await processFile(selectedFile, newSheet);
  };

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;

    setIsSubmitting(true);
    try {
      const validStudents = parseResult.validRows
        .map((r) => r.student)
        .filter((s): s is Student => s !== null);

      const response = await apiService.importStudents(validStudents);
      setImportResult(response);
      onImportSuccess(response);
    } catch (err: any) {
      console.error('Lỗi lưu danh sách học sinh:', err);
      setImportResult({
        success: false,
        message: err?.message || 'Có lỗi xảy ra khi lưu vào hệ thống.',
        total: parseResult.validRows.length,
        imported: 0,
        skipped: 0,
        failed: parseResult.validRows.length,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParseResult(null);
    setParseError(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nhập danh sách học sinh từ Excel / CSV</h2>
              <p className="text-xs text-blue-100">
                Hệ thống Quản lý Giáo dục & Nội trú THPT ClassCare AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Success summary screen if completed */}
          {importResult && (
            <div
              className={`p-5 rounded-xl border ${
                importResult.success
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-base">
                    {importResult.success ? 'Nhập dữ liệu hoàn tất!' : 'Nhập dữ liệu không thành công'}
                  </h3>
                  <p className="text-sm mt-1">{importResult.message}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-medium">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60 shadow-xs">
                      <div className="text-slate-500">Tổng dòng trong tệp</div>
                      <div className="text-base font-bold text-slate-800">{importResult.total}</div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                      <div className="text-emerald-700">Đã nhập thành công</div>
                      <div className="text-base font-bold text-emerald-700">
                        {importResult.imported} học sinh
                      </div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 shadow-xs">
                      <div className="text-amber-700">Bỏ qua (trùng lặp)</div>
                      <div className="text-base font-bold text-amber-700">{importResult.skipped}</div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-slate-500">Lỗi không thể nhập</div>
                      <div className="text-base font-bold text-rose-600">{importResult.failed}</div>
                    </div>
                  </div>

                  {importResult.skippedIds && importResult.skippedIds.length > 0 && (
                    <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <strong>Mã học sinh đã tồn tại (không ghi đè):</strong>{' '}
                      {importResult.skippedIds.join(', ')}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Đóng hộp thoại
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer"
                    >
                      Nhập tệp khác
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload file section if not finished */}
          {!importResult && (
            <>
              {/* Template download & instructions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-blue-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Tải file mẫu chuẩn ClassCare AI
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Sử dụng biểu mẫu có sẵn các cột (Mã học sinh, Họ tên, Ngày sinh, Lớp, KTX...) để hệ thống tự động nhận diện.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => generateTemplate('xlsx')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white hover:bg-blue-100/60 border border-blue-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Mẫu Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => generateTemplate('csv')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Mẫu CSV (.csv)
                  </button>
                </div>
              </div>

              {/* Drag and Drop or File Chooser */}
              {!selectedFile && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      Bấm để chọn tệp hoặc kéo thả file vào đây
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ Microsoft Excel (.xlsx, .xls) và tệp văn bản CSV (.csv)
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800">
                    Tối đa 10MB
                  </span>
                </div>
              )}

              {/* Parsing status */}
              {isParsing && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium">Đang đọc dữ liệu bảng tính...</p>
                </div>
              )}

              {/* Parse error */}
              {parseError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-3 text-xs">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div className="flex-1">
                    <strong className="block font-semibold">Lỗi khi đọc tệp:</strong>
                    {parseError}
                    <button
                      onClick={handleReset}
                      className="mt-2 block underline text-rose-700 font-medium cursor-pointer"
                    >
                      Thử lại với tệp khác
                    </button>
                  </div>
                </div>
              )}

              {/* File Preview and Validation Report */}
              {parseResult && (
                <div className="space-y-4">
                  {/* File Info Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">
                        {selectedFile?.name} ({(selectedFile?.size! / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    {/* Sheet selector if multiple sheets */}
                    {parseResult.sheetNames.length > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Trang tính (Sheet):</span>
                        <select
                          value={selectedSheet}
                          onChange={(e) => handleSheetChange(e.target.value)}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                        >
                          {parseResult.sheetNames.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      onClick={handleReset}
                      className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Đổi tệp khác
                    </button>
                  </div>

                  {/* Summary badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                      <div className="text-slate-500">Tổng dòng đọc được</div>
                      <div className="text-base font-bold text-slate-800">
                        {parseResult.totalRows} dòng
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab('valid')}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        activeTab === 'valid'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Hợp lệ có thể nhập</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-base font-bold text-emerald-600">
                        {parseResult.validRows.length} học sinh
                      </div>
                    </div>
                    <div
                      onClick={() => setActiveTab('invalid')}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        activeTab === 'invalid'
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Dòng lỗi / trùng lặp</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="text-base font-bold text-rose-600">
                        {parseResult.invalidRows.length} dòng
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900">
                      <div>Mã học sinh trùng</div>
                      <div className="text-base font-bold text-amber-700">
                        {parseResult.duplicateCount}
                      </div>
                    </div>
                  </div>

                  {/* Preview Table Tabs */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
                      <button
                        onClick={() => setActiveTab('valid')}
                        className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                          activeTab === 'valid'
                            ? 'border-blue-600 text-blue-700 bg-white'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Bản xem trước hợp lệ ({parseResult.validRows.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('invalid')}
                        className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                          activeTab === 'invalid'
                            ? 'border-rose-600 text-rose-700 bg-white'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Dòng có vấn đề ({parseResult.invalidRows.length})
                      </button>
                    </div>

                    <div className="max-h-60 overflow-x-auto overflow-y-auto">
                      {activeTab === 'valid' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                            <tr>
                              <th className="p-2 border-b border-slate-200">Dòng</th>
                              <th className="p-2 border-b border-slate-200">Mã HS</th>
                              <th className="p-2 border-b border-slate-200">Họ và tên</th>
                              <th className="p-2 border-b border-slate-200">Lớp</th>
                              <th className="p-2 border-b border-slate-200">Phòng KTX</th>
                              <th className="p-2 border-b border-slate-200">Phụ huynh</th>
                              <th className="p-2 border-b border-slate-200">SĐT Liên hệ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {parseResult.validRows.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-400">
                                  Không có dòng nào hợp lệ để hiển thị.
                                </td>
                              </tr>
                            ) : (
                              parseResult.validRows.map((row) => (
                                <tr key={row.rowIndex} className="hover:bg-slate-50/80">
                                  <td className="p-2 font-mono text-slate-400">{row.rowIndex}</td>
                                  <td className="p-2 font-semibold text-blue-700">
                                    {row.student?.id}
                                  </td>
                                  <td className="p-2 font-medium text-slate-800">
                                    {row.student?.fullName}
                                  </td>
                                  <td className="p-2 text-slate-600">{row.student?.className}</td>
                                  <td className="p-2 text-slate-600">{row.student?.dormRoom}</td>
                                  <td className="p-2 text-slate-600">
                                    {row.student?.guardian?.name} ({row.student?.guardian?.relationship})
                                  </td>
                                  <td className="p-2 text-slate-600">
                                    {row.student?.guardian?.phone || '—'}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}

                      {activeTab === 'invalid' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-rose-50 text-rose-900 font-semibold sticky top-0">
                            <tr>
                              <th className="p-2 border-b border-rose-200">Dòng</th>
                              <th className="p-2 border-b border-rose-200">Mã HS</th>
                              <th className="p-2 border-b border-rose-200">Họ và tên</th>
                              <th className="p-2 border-b border-rose-200">Nguyên nhân lỗi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-rose-100">
                            {parseResult.invalidRows.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-4 text-center text-emerald-700">
                                  Tuyệt vời! Toàn bộ các dòng trong tệp đều hợp lệ.
                                </td>
                              </tr>
                            ) : (
                              parseResult.invalidRows.map((row) => (
                                <tr key={row.rowIndex} className="bg-rose-50/30 hover:bg-rose-50/60">
                                  <td className="p-2 font-mono text-slate-400">{row.rowIndex}</td>
                                  <td className="p-2 font-mono text-slate-700">
                                    {row.raw['Mã học sinh'] || row.raw['Mã HS'] || '—'}
                                  </td>
                                  <td className="p-2 text-slate-800">
                                    {row.raw['Họ và tên'] || row.raw['Họ tên'] || '—'}
                                  </td>
                                  <td className="p-2 text-rose-700">
                                    <ul className="list-disc list-inside space-y-0.5">
                                      {row.errors.map((err, eIdx) => (
                                        <li key={eIdx}>{err}</li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            {parseResult ? (
              <span>
                Sẵn sàng nhập <strong>{parseResult.validRows.length}</strong> học sinh vào hệ thống
              </span>
            ) : (
              <span>Định dạng hỗ trợ: .xlsx, .xls, .csv</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>

            {parseResult && !importResult && (
              <button
                onClick={handleConfirmImport}
                disabled={isSubmitting || parseResult.validRows.length === 0}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang lưu vào hệ thống...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Xác nhận nhập ({parseResult.validRows.length} học sinh)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
