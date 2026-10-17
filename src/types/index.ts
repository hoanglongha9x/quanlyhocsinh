export type Role = 'GVCN' | 'GVBM' | 'GVQN' | 'BGH' | 'PHU_HUYNH';

export type AuthUserType = 'TEACHER' | 'STUDENT';

export interface AuthSession {
  type: AuthUserType;
  teacher?: User;
  student?: Student;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone?: string;
  assignedClass?: string; // e.g. "10A1"
  subject?: string; // e.g. "Toán học"
  dormArea?: string; // e.g. "Khu B - Tầng 2"
}

export type StudentStatus = 'DANG_HOC' | 'TAM_NGHI' | 'CHUYEN_TRUONG' | 'DINH_CHI';

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
  email?: string;
}

export interface Student {
  id: string; // Mã học sinh duy nhất (e.g. "HS1001")
  fullName: string;
  birthDate: string; // YYYY-MM-DD or DD/MM/YYYY
  gender: 'Nam' | 'Nữ' | 'Khác';
  className: string; // e.g. "10A1"
  dormRoom: string; // e.g. "P.201"
  status: StudentStatus;
  guardian: Guardian;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Quản lý vi phạm và sự việc
export type IncidentCategory =
  | 'CHUYEN_CAN'
  | 'THIET_BI_DIEN_TU'
  | 'NHIEM_VU_HOC_TAP'
  | 'GIO_TU_HOC'
  | 'NOI_QUY_KTX'
  | 'TRANG_PHUC_TAC_PHONG'
  | 'UNG_XU_BAN_BE'
  | 'VE_SINH_TAI_SAN'
  | 'AN_TOAN'
  | 'KHAC';

export type IncidentStatus =
  | 'MOI_TIEP_NHAN'
  | 'DANG_XAC_MINH'
  | 'CHUA_DU_CAN_CU'
  | 'CHO_QUYET_DINH'
  | 'DANG_XU_LY'
  | 'DANG_THEO_DOI'
  | 'DA_DONG';

export interface IncidentReport {
  id: string; // Mã sự việc
  studentId: string;
  studentName: string;
  className: string;
  dateTime: string;
  location: string;
  category: IncidentCategory;
  description: string;
  reportedBy: string; // Người ghi nhận
  reporterRole: Role;
  source: string; // Nguồn thông tin (GVBM phản ánh, Quản nhiệm phát hiện...)
  evidenceUrl?: string;
  evidenceNotes?: string;
  status: IncidentStatus;
  studentStatement?: string; // Ý kiến của học sinh
  verificationResult?: string; // Kết quả xác minh
  assignedStaff: string; // Người phụ trách
  actionDecision?: string; // Biện pháp giáo dục
  followUpDeadline?: string;
  followUpOutcome?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  history?: Array<{
    timestamp: string;
    action: string;
    staff: string;
    details?: string;
  }>;
}

// 4. Hệ thống cảnh báo sớm
export type AlertSeverity = 'MUC_1' | 'MUC_2' | 'MUC_3' | 'KHAN_CAP';
export type AlertType =
  | 'TAI_PHAM'
  | 'SA_SUT_HOC_TAP'
  | 'VANG_BAT_THUONG'
  | 'NHIEU_SU_VIEC'
  | 'HO_SO_QUA_HAN'
  | 'CHUA_PHAN_HOI_PHOI_HOP';

export interface EarlyAlert {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  type: AlertType;
  severity: AlertSeverity;
  ruleTriggered: string;
  basisData: string;
  assignedStaff: string;
  deadline: string;
  status: 'DANG_CHO' | 'DA_XAC_NHAN' | 'DANG_XU_LY' | 'DA_GIAI_QUYET' | 'CANH_BAO_SAI';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  history: Array<{
    timestamp: string;
    event: string;
    staff: string;
  }>;
}

// 5. Quản lý nhiệm vụ & nhắc việc
export type TaskPriority = 'THAP' | 'TRUNG_BINH' | 'CAO' | 'KHAN_CAP';
export type TaskStatus =
  | 'CHUA_BAT_DAU'
  | 'DANG_THUC_HIEN'
  | 'CHO_PHAN_HOI'
  | 'DA_HOAN_THANH'
  | 'QUA_HAN'
  | 'DA_HUY';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
  relatedIncidentId?: string;
  createdBy: string;
  assignedTo: string;
  collaborators?: string[];
  priority: TaskPriority;
  assignedDate: string;
  dueDate: string;
  status: TaskStatus;
  outcome?: string;
  completedAt?: string;
  cancellationReason?: string;
}

// 6. Quản lý chuyên cần
export type AttendanceStatus =
  | 'CO_MAT'
  | 'DI_MUON'
  | 'VANG_CO_PHEP'
  | 'VANG_CHUA_XAC_MINH'
  | 'VANG_KHONG_PHEP';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string; // YYYY-MM-DD
  session: 'SANG' | 'CHIEU' | 'TOI';
  status: AttendanceStatus;
  note?: string;
  verifiedBy: string;
  updatedAt: string;
}

// 7. Quản lý giờ tự học & nội trú KTX
export interface BoardingRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  room: string;
  date: string;
  session: 'TU_HOC_TOI' | 'NE_NEP_KTX' | 'VE_SINH_PHONG';
  criteria: {
    punctual: boolean;
    materialsReady: boolean;
    taskCompleted: boolean;
    deviceCompliant: boolean;
    cleanliness: boolean;
  };
  notes?: string;
  recordedBy: string;
  needsSupport?: boolean;
}

// 8. Quản lý kết quả học tập
export interface LearningRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  teacherName: string;
  assessmentDate: string;
  assessmentType: 'MIENG' | '15_PHUT' | '1_TIET' | 'GIUA_KY' | 'CUOI_KY';
  score: number;
  uncompletedAssignments: number;
  teacherNotes?: string;
  consecutiveDecline?: boolean;
}

// 9. Phối hợp GVCN – GVBM – GVQN – Phụ huynh
export interface CoordinationLog {
  id: string;
  studentId: string;
  studentName: string;
  relatedIncidentId?: string;
  initiator: string;
  recipient: string;
  recipientRole: Role;
  dateTime: string;
  content: string;
  agreedAction: string;
  assignedStaff: string;
  responseDeadline: string;
  outcome?: string;
  status: 'CHO_PHAN_HOI' | 'DANG_PHOI_HOP' | 'DA_HOAN_THANH';
}

// 10. Theo dõi tiến bộ & tuyên dương
export type ProgressCategory =
  | 'CHUYEN_CAN'
  | 'HOC_TAP'
  | 'NE_NEP'
  | 'TRACH_NHIEM'
  | 'HO_TRO_BAN_BE'
  | 'PHONG_TRAO'
  | 'KHAC';

export interface ProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  category: ProgressCategory;
  content: string;
  recordedBy: string;
  level: 'TIEN_BO_RO_RET' | 'XUAT_SAC' | 'GUONG_MAU';
  evidence?: string;
  goalReference?: string;
}
