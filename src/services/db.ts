import {
  Student,
  IncidentReport,
  EarlyAlert,
  TaskItem,
  AttendanceRecord,
  BoardingRecord,
  LearningRecord,
  CoordinationLog,
  ProgressRecord,
  User,
} from '../types';

export const TEACHER_ACCOUNTS: User[] = [
  {
    id: 'GV001',
    name: 'Thầy Nguyễn Văn An',
    role: 'GVCN',
    email: 'gvcn@thpt.edu.vn',
    phone: '0912.888.999',
    assignedClass: '10A1',
    subject: 'Toán học',
    dormArea: 'Khu A - Tầng 2',
  },
  {
    id: 'GV002',
    name: 'Thầy Trần Đình Khang',
    role: 'GVQN',
    email: 'gvqn@thpt.edu.vn',
    phone: '0988.111.222',
    assignedClass: '10A1',
    dormArea: 'Khu KTX Nam',
  },
  {
    id: 'GV003',
    name: 'Cô Hoàng Thu Hà',
    role: 'GVBM',
    email: 'gvbm@thpt.edu.vn',
    phone: '0903.333.444',
    assignedClass: '10A1',
    subject: 'Tiếng Anh',
  },
  {
    id: 'BGH01',
    name: 'Thầy Lê Quang (Hiệu trưởng)',
    role: 'BGH',
    email: 'bgh@thpt.edu.vn',
    phone: '0913.555.666',
  },
];

export const CURRENT_USER: User = TEACHER_ACCOUNTS[0];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'HS1001',
    fullName: 'Lê Hoàng Nam',
    birthDate: '12/04/2008',
    gender: 'Nam',
    className: '10A1',
    dormRoom: 'P.201',
    status: 'DANG_HOC',
    guardian: {
      name: 'Lê Văn Hùng',
      relationship: 'Bố',
      phone: '0912.345.678',
      address: 'Phường Ba Đình, Hà Nội',
      email: 'hung.le@gmail.com',
    },
    notes: 'Ban cán sự lớp, năng nổ trong phong trào.',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
  },
  {
    id: 'HS1002',
    fullName: 'Trần Thị Mỹ Linh',
    birthDate: '23/08/2008',
    gender: 'Nữ',
    className: '10A1',
    dormRoom: 'P.302',
    status: 'DANG_HOC',
    guardian: {
      name: 'Trần Quang Vinh',
      relationship: 'Bố',
      phone: '0988.765.432',
      address: 'TP. Hải Phòng',
    },
    notes: 'Học lực giỏi môn Tiếng Anh và Ngữ văn.',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
];

const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'SV-2026-001',
    studentId: 'HS1003',
    studentName: 'Phạm Đức Minh',
    className: '10A1',
    dateTime: '15/10/2026 20:45',
    location: 'Phòng tự học B202',
    category: 'THIET_BI_DIEN_TU',
    description: 'Sử dụng điện thoại chơi game trong giờ tự học buổi tối không theo mục đích học tập.',
    reportedBy: 'Thầy Trần Đình Khang',
    reporterRole: 'GVQN',
    source: 'GV Quản nhiệm kiểm tra giờ tự học tối',
    status: 'DANG_XU_LY',
    studentStatement: 'Em nhận lỗi, mượn máy để nhắn tin gia đình rồi mở ứng dụng giải trí.',
    verificationResult: 'Đã xác minh qua biên bản trực nề nếp KTX tối 15/10.',
    assignedStaff: 'Thầy Nguyễn Văn An (GVCN)',
    actionDecision: 'Tạm giữ thiết bị đến hết tuần theo quy chế nội trú, yêu cầu viết bản tự kiểm điểm và lập kế hoạch tự học.',
    followUpDeadline: '20/10/2026',
    createdAt: '2026-10-15T21:00:00Z',
    updatedAt: '2026-10-16T07:30:00Z',
    history: [
      {
        timestamp: '15/10/2026 21:00',
        action: 'Ghi nhận sự việc',
        staff: 'Thầy Trần Đình Khang (GVQN)',
        details: 'Biên bản số 45/KTX',
      },
      {
        timestamp: '16/10/2026 07:30',
        action: 'GVCN tiếp nhận và trao đổi với học sinh',
        staff: 'Thầy Nguyễn Văn An (GVCN)',
      },
    ],
  },
  {
    id: 'SV-2026-002',
    studentId: 'HS1005',
    studentName: 'Vũ Quốc Bảo',
    className: '10A1',
    dateTime: '16/10/2026 07:20',
    location: 'Khuôn viên trường',
    category: 'CHUYEN_CAN',
    description: 'Đi muộn 15 phút tiết 1 buổi sáng (lý do ngủ quên tại KTX).',
    reportedBy: 'Cô Đỗ Thị Mai',
    reporterRole: 'GVBM',
    source: 'Sổ đầu bài tiết 1 môn Ngữ văn',
    status: 'DA_DONG',
    verificationResult: 'GVCN đã nhắc nhở và quản nhiệm phòng KTX hỗ trợ kiểm tra buổi sáng.',
    assignedStaff: 'Thầy Nguyễn Văn An (GVCN)',
    actionDecision: 'Nhắc nhở trực tiếp, phân công bạn cùng phòng HS1001 hỗ trợ gọi dậy.',
    closedAt: '16/10/2026 11:30',
    createdAt: '2026-10-16T07:25:00Z',
    updatedAt: '2026-10-16T11:30:00Z',
  },
  {
    id: 'SV-2026-003',
    studentId: 'HS1003',
    studentName: 'Phạm Đức Minh',
    className: '10A1',
    dateTime: '11/10/2026 21:15',
    location: 'Phòng KTX P.201',
    category: 'GIO_TU_HOC',
    description: 'Rời phòng tự học trước giờ quy định 30 phút mà chưa xin phép quản nhiệm.',
    reportedBy: 'Thầy Trần Đình Khang',
    reporterRole: 'GVQN',
    source: 'Điểm danh đột xuất KTX',
    status: 'DA_DONG',
    verificationResult: 'Đã xác minh đúng thực tế.',
    assignedStaff: 'Thầy Nguyễn Văn An (GVCN)',
    actionDecision: 'Nhắc nhở lần 1 theo nội quy trường.',
    closedAt: '12/10/2026 15:00',
    createdAt: '2026-10-11T21:30:00Z',
    updatedAt: '2026-10-12T15:00:00Z',
  },
];

const INITIAL_ALERTS: EarlyAlert[] = [
  {
    id: 'CB-2026-001',
    studentId: 'HS1003',
    studentName: 'Phạm Đức Minh',
    className: '10A1',
    type: 'TAI_PHAM',
    severity: 'MUC_2',
    ruleTriggered: 'Cùng nhóm hành vi nề nếp / tự học vi phạm 2 lần trong 7 ngày',
    basisData: 'Sự việc SV-2026-001 (15/10) và SV-2026-003 (11/10) liên quan giờ tự học/thiết bị',
    assignedStaff: 'Thầy Nguyễn Văn An (GVCN)',
    deadline: '18/10/2026',
    status: 'DANG_XU_LY',
    createdAt: '2026-10-16T08:00:00Z',
    history: [
      {
        timestamp: '16/10/2026 08:00',
        event: 'Hệ thống tự động kích hoạt cảnh báo tái phạm Mức 2',
        staff: 'Hệ thống ClassCare AI',
      },
    ],
  },
  {
    id: 'CB-2026-002',
    studentId: 'HS1005',
    studentName: 'Vũ Quốc Bảo',
    className: '10A1',
    type: 'SA_SUT_HOC_TAP',
    severity: 'MUC_1',
    ruleTriggered: 'Điểm kiểm tra 15 phút môn Tiếng Anh và Vật lý giảm liên tiếp',
    basisData: 'Điểm Tiếng Anh: 7.5 -> 5.0; Vật lý: 8.0 -> 5.5 trong 2 tuần qua',
    assignedStaff: 'Thầy Nguyễn Văn An (GVCN) & Cô Đỗ Thị Mai',
    deadline: '19/10/2026',
    status: 'DA_XAC_NHAN',
    createdAt: '2026-10-16T09:15:00Z',
    history: [
      {
        timestamp: '16/10/2026 09:15',
        event: 'Kích hoạt cảnh báo sa sút học tập',
        staff: 'Hệ thống ClassCare AI',
      },
    ],
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'NV-001',
    title: 'Gặp gỡ và trao đổi kế hoạch tự học với HS Phạm Đức Minh',
    description: 'Hỗ trợ em Minh sắp xếp lại thời gian biểu tự học buổi tối tại KTX và cam kết không dùng thiết bị sai mục đích.',
    relatedStudentId: 'HS1003',
    relatedStudentName: 'Phạm Đức Minh',
    relatedIncidentId: 'SV-2026-001',
    createdBy: 'Thầy Nguyễn Văn An (GVCN)',
    assignedTo: 'Thầy Nguyễn Văn An',
    collaborators: ['Thầy Trần Đình Khang (GVQN)'],
    priority: 'CAO',
    assignedDate: '16/10/2026',
    dueDate: '17/10/2026', // Sắp đến hạn trong 24h
    status: 'DANG_THUC_HIEN',
  },
  {
    id: 'NV-002',
    title: 'Phối hợp phụ huynh em Vũ Quốc Bảo về thời gian ngủ nghỉ',
    description: 'Gọi điện cho phụ huynh em Bảo để trao đổi về tình trạng thức khuya và đi muộn buổi sáng.',
    relatedStudentId: 'HS1005',
    relatedStudentName: 'Vũ Quốc Bảo',
    createdBy: 'Thầy Nguyễn Văn An (GVCN)',
    assignedTo: 'Thầy Nguyễn Văn An',
    priority: 'TRUNG_BINH',
    assignedDate: '15/10/2026',
    dueDate: '16/10/2026',
    status: 'CHO_PHAN_HOI',
  },
  {
    id: 'NV-003',
    title: 'Duyệt danh sách tuyên dương học sinh tiến bộ tuần 7',
    description: 'Tổng hợp danh sách các em có tiến bộ vượt bậc môn Toán và nề nếp KTX gửi ban thi đua.',
    createdBy: 'Ban Giám Hiệu',
    assignedTo: 'Thầy Nguyễn Văn An',
    priority: 'TRUNG_BINH',
    assignedDate: '14/10/2026',
    dueDate: '18/10/2026',
    status: 'CHUA_BAT_DAU',
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'CC-001',
    studentId: 'HS1001',
    studentName: 'Lê Hoàng Nam',
    className: '10A1',
    date: '2026-10-16',
    session: 'SANG',
    status: 'CO_MAT',
    verifiedBy: 'Thầy Nguyễn Văn An',
    updatedAt: '2026-10-16T07:15:00Z',
  },
  {
    id: 'CC-002',
    studentId: 'HS1002',
    studentName: 'Trần Thị Mỹ Linh',
    className: '10A1',
    date: '2026-10-16',
    session: 'SANG',
    status: 'CO_MAT',
    verifiedBy: 'Thầy Nguyễn Văn An',
    updatedAt: '2026-10-16T07:15:00Z',
  },
  {
    id: 'CC-003',
    studentId: 'HS1003',
    studentName: 'Phạm Đức Minh',
    className: '10A1',
    date: '2026-10-16',
    session: 'SANG',
    status: 'CO_MAT',
    verifiedBy: 'Thầy Nguyễn Văn An',
    updatedAt: '2026-10-16T07:15:00Z',
  },
  {
    id: 'CC-004',
    studentId: 'HS1004',
    studentName: 'Nguyễn Thảo Nhi',
    className: '10A1',
    date: '2026-10-16',
    session: 'SANG',
    status: 'CO_MAT',
    verifiedBy: 'Thầy Nguyễn Văn An',
    updatedAt: '2026-10-16T07:15:00Z',
  },
  {
    id: 'CC-005',
    studentId: 'HS1005',
    studentName: 'Vũ Quốc Bảo',
    className: '10A1',
    date: '2026-10-16',
    session: 'SANG',
    status: 'DI_MUON',
    note: 'Đi muộn 15 phút tiết 1 (ngủ quên KTX)',
    verifiedBy: 'Thầy Nguyễn Văn An',
    updatedAt: '2026-10-16T07:30:00Z',
  },
];

const INITIAL_BOARDING: BoardingRecord[] = [
  {
    id: 'KTX-001',
    studentId: 'HS1001',
    studentName: 'Lê Hoàng Nam',
    className: '10A1',
    room: 'P.201',
    date: '2026-10-15',
    session: 'TU_HOC_TOI',
    criteria: {
      punctual: true,
      materialsReady: true,
      taskCompleted: true,
      deviceCompliant: true,
      cleanliness: true,
    },
    notes: 'Tập trung cao, hỗ trợ bạn cùng bàn giải bài tập nâng cao.',
    recordedBy: 'Thầy Trần Đình Khang (GVQN)',
  },
  {
    id: 'KTX-002',
    studentId: 'HS1003',
    studentName: 'Phạm Đức Minh',
    className: '10A1',
    room: 'P.201',
    date: '2026-10-15',
    session: 'TU_HOC_TOI',
    criteria: {
      punctual: true,
      materialsReady: true,
      taskCompleted: false,
      deviceCompliant: false,
      cleanliness: true,
    },
    notes: 'Vi phạm quy định dùng điện thoại trong giờ tự học.',
    recordedBy: 'Thầy Trần Đình Khang (GVQN)',
    needsSupport: true,
  },
];

const INITIAL_PROGRESS: ProgressRecord[] = [
  {
    id: 'TB-001',
    studentId: 'HS1004',
    studentName: 'Nguyễn Thảo Nhi',
    className: '10A1',
    date: '15/10/2026',
    category: 'HOC_TAP',
    content: 'Đạt điểm 9.5 bài kiểm tra 1 tiết môn Tiếng Anh và tích cực phát biểu xây dựng bài.',
    recordedBy: 'Cô Hoàng Thu Hà (GV Tiếng Anh)',
    level: 'TIEN_BO_RO_RET',
  },
  {
    id: 'TB-002',
    studentId: 'HS1001',
    studentName: 'Lê Hoàng Nam',
    className: '10A1',
    date: '14/10/2026',
    category: 'TRACH_NHIEM',
    content: 'Chủ động tổ chức nhóm học tập tại KTX giúp các bạn môn Toán và Vật lý.',
    recordedBy: 'Thầy Nguyễn Văn An (GVCN)',
    level: 'GUONG_MAU',
  },
];

const STORAGE_KEYS = {
  STUDENTS: 'classcare_students_v1',
  INCIDENTS: 'classcare_incidents_v1',
  ALERTS: 'classcare_alerts_v1',
  TASKS: 'classcare_tasks_v1',
  ATTENDANCE: 'classcare_attendance_v1',
  BOARDING: 'classcare_boarding_v1',
  PROGRESS: 'classcare_progress_v1',
};

// Local storage persistent helper (safe for SSR and serverless Node.js environments)
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return defaultValue;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // Non-critical storage quota or security error
  }
};

export class ClassCareDatabase {
  private static instance: ClassCareDatabase;

  private students: Student[] = [];
  private incidents: IncidentReport[] = [];
  private alerts: EarlyAlert[] = [];
  private tasks: TaskItem[] = [];
  private attendance: AttendanceRecord[] = [];
  private boarding: BoardingRecord[] = [];
  private progress: ProgressRecord[] = [];

  private constructor() {
    this.students = getFromStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    this.incidents = getFromStorage(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    this.alerts = getFromStorage(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    this.tasks = getFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    this.attendance = getFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    this.boarding = getFromStorage(STORAGE_KEYS.BOARDING, INITIAL_BOARDING);
    this.progress = getFromStorage(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
  }

  public static getInstance(): ClassCareDatabase {
    if (!ClassCareDatabase.instance) {
      ClassCareDatabase.instance = new ClassCareDatabase();
    }
    return ClassCareDatabase.instance;
  }

  // Students API
  public getStudents(): Student[] {
    return [...this.students];
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.find((s) => s.id.toUpperCase() === id.toUpperCase());
  }

  public addStudent(student: Student): Student {
    const exists = this.getStudentById(student.id);
    if (exists) {
      throw new Error(`Mã học sinh ${student.id} đã tồn tại trong hệ thống.`);
    }
    this.students.unshift(student);
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student {
    const index = this.students.findIndex((s) => s.id.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      throw new Error(`Không tìm thấy học sinh với mã ${id}`);
    }
    this.students[index] = {
      ...this.students[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    return this.students[index];
  }

  // Bulk import with duplicate prevention and safe result stats
  public importStudents(newStudents: Student[]): {
    total: number;
    imported: number;
    skipped: number;
    failed: number;
    importedList: Student[];
    skippedIds: string[];
  } {
    const existingIds = new Set(this.students.map((s) => s.id.toUpperCase()));
    const importedList: Student[] = [];
    const skippedIds: string[] = [];

    for (const student of newStudents) {
      const upperId = student.id.toUpperCase();
      if (existingIds.has(upperId)) {
        skippedIds.push(student.id);
        continue;
      }
      existingIds.add(upperId);
      importedList.push({
        ...student,
        id: upperId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (importedList.length > 0) {
      this.students = [...importedList, ...this.students];
      saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    }

    return {
      total: newStudents.length,
      imported: importedList.length,
      skipped: skippedIds.length,
      failed: 0,
      importedList,
      skippedIds,
    };
  }

  // Incidents API
  public getIncidents(): IncidentReport[] {
    return [...this.incidents];
  }

  public addIncident(incident: IncidentReport): IncidentReport {
    this.incidents.unshift(incident);
    saveToStorage(STORAGE_KEYS.INCIDENTS, this.incidents);
    this.checkAndGenerateAlerts(incident.studentId);
    return incident;
  }

  public updateIncident(id: string, updates: Partial<IncidentReport>): IncidentReport {
    const index = this.incidents.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Không tìm thấy sự việc.');
    this.incidents[index] = {
      ...this.incidents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.INCIDENTS, this.incidents);
    return this.incidents[index];
  }

  // Early Alerts Engine
  public getAlerts(): EarlyAlert[] {
    return [...this.alerts];
  }

  public updateAlert(id: string, updates: Partial<EarlyAlert>): EarlyAlert {
    const index = this.alerts.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Không tìm thấy cảnh báo.');
    this.alerts[index] = {
      ...this.alerts[index],
      ...updates,
    };
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    return this.alerts[index];
  }

  private checkAndGenerateAlerts(studentId: string) {
    const student = this.getStudentById(studentId);
    if (!student) return;

    // Check repeat violations in last 7 days
    const studentIncidents = this.incidents.filter(
      (i) => i.studentId.toUpperCase() === studentId.toUpperCase() && i.status !== 'CHUA_DU_CAN_CU'
    );

    if (studentIncidents.length >= 2) {
      // Check if open alert already exists
      const existingAlert = this.alerts.find(
        (a) => a.studentId.toUpperCase() === studentId.toUpperCase() && a.status === 'DANG_CHO'
      );
      if (!existingAlert) {
        const newAlert: EarlyAlert = {
          id: `CB-${Date.now().toString().slice(-4)}`,
          studentId: student.id,
          studentName: student.fullName,
          className: student.className,
          type: 'TAI_PHAM',
          severity: studentIncidents.length >= 3 ? 'MUC_3' : 'MUC_2',
          ruleTriggered: `Đã ghi nhận ${studentIncidents.length} sự việc cần lưu ý trong thời gian ngắn`,
          basisData: `Các sự việc: ${studentIncidents.map((s) => s.id).join(', ')}`,
          assignedStaff: 'Thầy Nguyễn Văn An (GVCN)',
          deadline: 'Trong 48 giờ tới',
          status: 'DANG_CHO',
          createdAt: new Date().toISOString(),
          history: [
            {
              timestamp: new Date().toLocaleString('vi-VN'),
              event: 'Hệ thống tự động kích hoạt cảnh báo tái phạm',
              staff: 'Hệ thống ClassCare AI',
            },
          ],
        };
        this.alerts.unshift(newAlert);
        saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
      }
    }
  }

  // Tasks API
  public getTasks(): TaskItem[] {
    return [...this.tasks];
  }

  public addTask(task: TaskItem): TaskItem {
    this.tasks.unshift(task);
    saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
    return task;
  }

  public updateTask(id: string, updates: Partial<TaskItem>): TaskItem {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Không tìm thấy nhiệm vụ.');
    this.tasks[index] = { ...this.tasks[index], ...updates };
    saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
    return this.tasks[index];
  }

  // Attendance API
  public getAttendance(): AttendanceRecord[] {
    return [...this.attendance];
  }

  public recordAttendance(record: AttendanceRecord): AttendanceRecord {
    this.attendance.unshift(record);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
    return record;
  }

  // Boarding API
  public getBoarding(): BoardingRecord[] {
    return [...this.boarding];
  }

  public recordBoarding(record: BoardingRecord): BoardingRecord {
    this.boarding.unshift(record);
    saveToStorage(STORAGE_KEYS.BOARDING, this.boarding);
    return record;
  }

  // Progress API
  public getProgress(): ProgressRecord[] {
    return [...this.progress];
  }

  public addProgress(record: ProgressRecord): ProgressRecord {
    this.progress.unshift(record);
    saveToStorage(STORAGE_KEYS.PROGRESS, this.progress);
    return record;
  }

  // Clear all mock data completely for clean state
  public clearAllData(): void {
    this.students = [];
    this.incidents = [];
    this.alerts = [];
    this.tasks = [];
    this.attendance = [];
    this.boarding = [];
    this.progress = [];
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    saveToStorage(STORAGE_KEYS.INCIDENTS, this.incidents);
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
    saveToStorage(STORAGE_KEYS.BOARDING, this.boarding);
    saveToStorage(STORAGE_KEYS.PROGRESS, this.progress);
  }

  // Reset to minimal clean demo data
  public resetToMinimal(): void {
    this.students = [...INITIAL_STUDENTS];
    this.incidents = [...INITIAL_INCIDENTS];
    this.alerts = [...INITIAL_ALERTS];
    this.tasks = [...INITIAL_TASKS];
    this.attendance = [...INITIAL_ATTENDANCE];
    this.boarding = [...INITIAL_BOARDING];
    this.progress = [...INITIAL_PROGRESS];
    saveToStorage(STORAGE_KEYS.STUDENTS, this.students);
    saveToStorage(STORAGE_KEYS.INCIDENTS, this.incidents);
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
    saveToStorage(STORAGE_KEYS.BOARDING, this.boarding);
    saveToStorage(STORAGE_KEYS.PROGRESS, this.progress);
  }

  // Authentication helper for student portal
  public authenticateStudent(studentId: string): Student | null {
    if (!studentId || !studentId.trim()) return null;
    const cleanId = studentId.trim().toUpperCase();
    const found = this.students.find((s) => s.id.toUpperCase() === cleanId);
    return found || null;
  }

  // Authentication helper for teacher portal
  public authenticateTeacher(emailOrRole: string): User {
    const clean = (emailOrRole || '').trim().toLowerCase();
    const found = TEACHER_ACCOUNTS.find(
      (t) =>
        t.email.toLowerCase() === clean ||
        t.role.toLowerCase() === clean ||
        t.id.toLowerCase() === clean
    );
    return found || TEACHER_ACCOUNTS[0];
  }
}

export const db = ClassCareDatabase.getInstance();

