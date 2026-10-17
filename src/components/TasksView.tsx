import React, { useState } from 'react';
import { ListTodo, Plus, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus, Student } from '../types';
import { db } from '../services/db';

interface TasksViewProps {
  tasks: TaskItem[];
  students: Student[];
  onRefresh: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, students, onRefresh }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    studentId: '',
    priority: 'TRUNG_BINH' as TaskPriority,
    dueDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString('vi-VN'),
    assignedTo: 'Thầy Nguyễn Văn An (GVCN)',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const student = students.find((s) => s.id === newTask.studentId);

    const task: TaskItem = {
      id: `NV-${String(tasks.length + 1).padStart(3, '0')}`,
      title: newTask.title,
      description: newTask.description,
      relatedStudentId: student?.id,
      relatedStudentName: student?.fullName,
      createdBy: 'Thầy Nguyễn Văn An (GVCN)',
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      assignedDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: newTask.dueDate,
      status: 'CHUA_BAT_DAU',
    };

    db.addTask(task);
    setIsAddOpen(false);
    onRefresh();
  };

  const handleToggleComplete = (id: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'DA_HOAN_THANH' ? 'DANG_THUC_HIEN' : 'DA_HOAN_THANH';
    db.updateTask(id, {
      status: nextStatus,
      completedAt: nextStatus === 'DA_HOAN_THANH' ? new Date().toLocaleString('vi-VN') : undefined,
    });
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Quản lý nhiệm vụ & Nhắc việc sư phạm</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {tasks.length} nhiệm vụ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cơ chế nhắc việc thông minh: trước hạn 24h, đến hạn, và cảnh báo quá hạn 24h/48h/72h
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Giao việc / Tạo nhiệm vụ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border shadow-xs space-y-3 transition-all ${
              task.status === 'DA_HOAN_THANH'
                ? 'bg-slate-50 border-slate-200 opacity-75'
                : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={task.status === 'DA_HOAN_THANH'}
                  onChange={() => handleToggleComplete(task.id, task.status)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      task.status === 'DA_HOAN_THANH' ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  task.priority === 'CAO'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {task.priority}
              </span>
            </div>

            {task.relatedStudentName && (
              <div className="text-xs text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-lg">
                Học sinh liên quan: <strong>{task.relatedStudentName}</strong>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Phụ trách: <strong>{task.assignedTo}</strong></span>
              <span className="font-semibold text-rose-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Hạn: {task.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Tạo nhiệm vụ sư phạm mới</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề nhiệm vụ (*)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trao đổi với gia đình em Minh..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Học sinh liên quan</label>
                  <select
                    value={newTask.studentId}
                    onChange={(e) => setNewTask({ ...newTask, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">(Không chọn)</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn hoàn thành</label>
                  <input
                    type="text"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
