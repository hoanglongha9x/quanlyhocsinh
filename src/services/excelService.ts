import * as XLSX from 'xlsx';
import { Student, StudentStatus } from '../types';

export interface ParsedRow {
  rowIndex: number;
  raw: Record<string, any>;
  student: Partial<Student> | null;
  isValid: boolean;
  errors: string[];
  isDuplicateInFile?: boolean;
  isDuplicateInSystem?: boolean;
}

export interface ParseResult {
  sheetNames: string[];
  currentSheet: string;
  totalRows: number;
  validRows: ParsedRow[];
  invalidRows: ParsedRow[];
  duplicateCount: number;
}

// Normalizes header names for flexible Vietnamese and English matching
const normalizeHeader = (header: string): string => {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

export const parseExcelOrCsv = async (
  file: File,
  sheetIndexOrName?: number | string,
  existingStudentIds: Set<string> = new Set()
): Promise<ParseResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;

  if (sheetNames.length === 0) {
    throw new Error('Tệp không chứa trang tính (sheet) nào.');
  }

  let sheetName = sheetNames[0];
  if (typeof sheetIndexOrName === 'string' && sheetNames.includes(sheetIndexOrName)) {
    sheetName = sheetIndexOrName;
  } else if (typeof sheetIndexOrName === 'number' && sheetNames[sheetIndexOrName]) {
    sheetName = sheetNames[sheetIndexOrName];
  }

  const worksheet = workbook.Sheets[sheetName];
  // Parse rows as array of objects
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  const validRows: ParsedRow[] = [];
  const invalidRows: ParsedRow[] = [];
  const seenIdsInFile = new Set<string>();
  let duplicateCount = 0;

  rawRows.forEach((row, idx) => {
    const rowIndex = idx + 2; // Row number in Excel (header is row 1)
    const normalizedRow: Record<string, string> = {};

    for (const [key, value] of Object.entries(row)) {
      normalizedRow[normalizeHeader(key)] = String(value || '').trim();
    }

    // Mapping fields
    const id =
      normalizedRow['mahocsinh'] ||
      normalizedRow['mahs'] ||
      normalizedRow['id'] ||
      normalizedRow['studentid'] ||
      normalizedRow['ms'] ||
      '';

    const fullName =
      normalizedRow['hovaten'] ||
      normalizedRow['hoten'] ||
      normalizedRow['ten'] ||
      normalizedRow['fullname'] ||
      normalizedRow['name'] ||
      '';

    const birthDate =
      normalizedRow['ngaysinh'] ||
      normalizedRow['dob'] ||
      normalizedRow['birthdate'] ||
      normalizedRow['ngaythangnamsinh'] ||
      '';

    let genderRaw =
      normalizedRow['gioitinh'] ||
      normalizedRow['gender'] ||
      normalizedRow['phai'] ||
      'Nam';
    let gender: 'Nam' | 'Nữ' | 'Khác' = 'Nam';
    const normGender = genderRaw.toLowerCase();
    if (normGender.includes('nu') || normGender.includes('nữ') || normGender === 'f') {
      gender = 'Nữ';
    } else if (normGender.includes('khac') || normGender.includes('other')) {
      gender = 'Khác';
    }

    const className =
      normalizedRow['lop'] ||
      normalizedRow['lopsh'] ||
      normalizedRow['class'] ||
      normalizedRow['classname'] ||
      '10A1';

    const dormRoom =
      normalizedRow['phongktx'] ||
      normalizedRow['phong'] ||
      normalizedRow['ktx'] ||
      normalizedRow['dorm'] ||
      normalizedRow['dormroom'] ||
      'P.101';

    const guardianName =
      normalizedRow['hotenphuhuynh'] ||
      normalizedRow['tenphuhuynh'] ||
      normalizedRow['nguoigiamho'] ||
      normalizedRow['phuhuynh'] ||
      normalizedRow['guardian'] ||
      'Phụ huynh';

    const guardianPhone =
      normalizedRow['sodienthoai'] ||
      normalizedRow['sdt'] ||
      normalizedRow['phone'] ||
      normalizedRow['dienthoai'] ||
      normalizedRow['sdtphuhuynh'] ||
      '';

    const guardianRelation =
      normalizedRow['quanhe'] ||
      normalizedRow['moiquanhe'] ||
      normalizedRow['relationship'] ||
      'Bố/Mẹ';

    const address =
      normalizedRow['diachi'] ||
      normalizedRow['address'] ||
      normalizedRow['quequan'] ||
      '';

    let statusRaw =
      normalizedRow['trangthai'] ||
      normalizedRow['trangthaihoctap'] ||
      normalizedRow['status'] ||
      'DANG_HOC';
    let status: StudentStatus = 'DANG_HOC';
    const normStatus = statusRaw.toLowerCase();
    if (normStatus.includes('tam') || normStatus.includes('nghi')) {
      status = 'TAM_NGHI';
    } else if (normStatus.includes('chuyen')) {
      status = 'CHUYEN_TRUONG';
    } else if (normStatus.includes('dinh')) {
      status = 'DINH_CHI';
    }

    const notes =
      normalizedRow['ghichu'] ||
      normalizedRow['notes'] ||
      normalizedRow['note'] ||
      '';

    const errors: string[] = [];

    // Validation rules
    if (!id) {
      errors.push('Thiếu Mã học sinh (bắt buộc)');
    }
    if (!fullName) {
      errors.push('Thiếu Họ và tên (bắt buộc)');
    }

    let isDuplicateInFile = false;
    let isDuplicateInSystem = false;

    if (id) {
      const upperId = id.toUpperCase();
      if (seenIdsInFile.has(upperId)) {
        errors.push(`Mã học sinh "${id}" bị trùng lặp trong tệp Excel`);
        isDuplicateInFile = true;
        duplicateCount++;
      } else {
        seenIdsInFile.add(upperId);
      }

      if (existingStudentIds.has(upperId)) {
        errors.push(`Mã học sinh "${id}" đã tồn tại trên hệ thống`);
        isDuplicateInSystem = true;
        duplicateCount++;
      }
    }

    const student: Partial<Student> = {
      id: id.toUpperCase(),
      fullName,
      birthDate: birthDate || '2008-01-01',
      gender,
      className,
      dormRoom,
      status,
      guardian: {
        name: guardianName,
        phone: guardianPhone,
        relationship: guardianRelation,
        address,
      },
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const parsedRow: ParsedRow = {
      rowIndex,
      raw: row,
      student: errors.length === 0 ? (student as Student) : null,
      isValid: errors.length === 0,
      errors,
      isDuplicateInFile,
      isDuplicateInSystem,
    };

    if (parsedRow.isValid) {
      validRows.push(parsedRow);
    } else {
      invalidRows.push(parsedRow);
    }
  });

  return {
    sheetNames,
    currentSheet: sheetName,
    totalRows: rawRows.length,
    validRows,
    invalidRows,
    duplicateCount,
  };
};

// Generates sample Excel or CSV template for GVCN to download
export const generateTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
  const sampleData = [
    {
      'Mã học sinh': 'HS1031',
      'Họ và tên': 'Nguyễn Văn An',
      'Ngày sinh': '15/03/2008',
      'Giới tính': 'Nam',
      'Lớp': '10A1',
      'Phòng KTX': 'P.201',
      'Họ tên phụ huynh': 'Nguyễn Văn Bình',
      'Mối quan hệ': 'Bố',
      'Số điện thoại': '0912345678',
      'Địa chỉ': 'Thành phố Hà Nội',
      'Trạng thái': 'Đang học',
      'Ghi chú': 'Đoàn viên tích cực, năng khiếu cờ vua',
    },
    {
      'Mã học sinh': 'HS1032',
      'Họ và tên': 'Trần Thị Mai',
      'Ngày sinh': '20/07/2008',
      'Giới tính': 'Nữ',
      'Lớp': '10A1',
      'Phòng KTX': 'P.302',
      'Họ tên phụ huynh': 'Lê Thị Cúc',
      'Mối quan hệ': 'Mẹ',
      'Số điện thoại': '0987654321',
      'Địa chỉ': 'Tỉnh Bắc Ninh',
      'Trạng thái': 'Đang học',
      'Ghi chú': 'Cần lưu ý giờ tự học môn Tiếng Anh',
    },
    {
      'Mã học sinh': 'HS1033',
      'Họ và tên': 'Lê Hoàng Long',
      'Ngày sinh': '05/11/2008',
      'Giới tính': 'Nam',
      'Lớp': '10A1',
      'Phòng KTX': 'P.202',
      'Họ tên phụ huynh': 'Lê Hoàng Minh',
      'Mối quan hệ': 'Bố',
      'Số điện thoại': '0903112233',
      'Địa chỉ': 'Tỉnh Hải Dương',
      'Trạng thái': 'Đang học',
      'Ghi chú': 'Học sinh tiến bộ môn Toán',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 14 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 20 },
    { wch: 12 },
    { wch: 16 },
    { wch: 25 },
    { wch: 14 },
    { wch: 35 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHocSinh');

  if (format === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mau_Danh_Sach_Hoc_Sinh_ClassCare.csv';
    link.click();
    URL.revokeObjectURL(url);
  } else {
    XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh_ClassCare.xlsx');
  }
};

// Export actual student list to CSV
export const exportStudentsToCsv = (students: Student[], filename = 'Danh_Sach_Hoc_Sinh_ClassCare.csv') => {
  const exportData = students.map((s) => ({
    'Mã học sinh': s.id,
    'Họ và tên': s.fullName,
    'Ngày sinh': s.birthDate,
    'Giới tính': s.gender,
    'Lớp': s.className,
    'Phòng KTX': s.dormRoom,
    'Trạng thái': s.status === 'DANG_HOC' ? 'Đang học' : s.status === 'TAM_NGHI' ? 'Tạm nghỉ' : 'Đình chỉ',
    'Phụ huynh': s.guardian.name,
    'Mối quan hệ': s.guardian.relationship,
    'SĐT Phụ huynh': s.guardian.phone,
    'Địa chỉ': s.guardian.address || '',
    'Ghi chú': s.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
