import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    app: 'ClassCare AI',
    timestamp: new Date().toISOString(),
  });
});

// Mock database in-memory for server endpoints (syncs with client)
let serverStudents: any[] = [];

// Students Import endpoint
app.post('/api/students/import', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { students } = req.body;
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu học sinh không hợp lệ hoặc thiếu trường danh sách.',
        total: 0,
        imported: 0,
        skipped: 0,
        failed: 0,
      });
    }

    const existingIds = new Set(serverStudents.map((s: any) => String(s.id).toUpperCase()));
    const importedList: any[] = [];
    const skippedIds: string[] = [];

    for (const student of students) {
      if (!student.id || !student.fullName) continue;
      const upperId = String(student.id).toUpperCase();
      if (existingIds.has(upperId)) {
        skippedIds.push(student.id);
        continue;
      }
      existingIds.add(upperId);
      const newRecord = {
        ...student,
        id: upperId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      importedList.push(newRecord);
      serverStudents.push(newRecord);
    }

    return res.status(200).json({
      success: true,
      message:
        importedList.length > 0
          ? `Đã lưu thành công ${importedList.length} học sinh vào hệ thống${
              skippedIds.length > 0 ? ` (bỏ qua ${skippedIds.length} học sinh trùng mã)` : ''
            }.`
          : `Không có học sinh mới nào được thêm (bỏ qua ${skippedIds.length} học sinh đã tồn tại).`,
      total: students.length,
      imported: importedList.length,
      skipped: skippedIds.length,
      failed: 0,
      skippedIds,
      students: importedList,
    });
  } catch (err: any) {
    console.error('Lỗi khi lưu danh sách học sinh:', err);
    return res.status(500).json({
      success: false,
      message: `Lỗi máy chủ khi xử lý nhập danh sách: ${err?.message || 'Lỗi không xác định'}`,
      total: 0,
      imported: 0,
      skipped: 0,
      failed: 0,
    });
  }
});

// Gemini AI Assistant endpoint
app.post('/api/ai/consult', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  const { action, payload } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      success: true,
      result: `(Chế độ hỗ trợ sư phạm nội bộ - Chưa cấu hình GEMINI_API_KEY)\nLời khuyên cho GVCN: Đồng hành cùng học sinh ${payload?.studentName || ''}, phối hợp chặt chẽ với giáo viên quản nhiệm giờ tự học tối và liên hệ phụ huynh để động viên tinh thần em.`,
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = '';
    if (action === 'draft_message') {
      prompt = `Bạn là cố vấn sư phạm trường THPT nội trú. Hãy soạn một tin nhắn ngắn gọn (khoảng 3-4 đoạn), chân thành, tôn trọng và mang tính xây dựng từ Giáo viên chủ nhiệm gửi cho phụ huynh học sinh ${payload?.studentName || ''} (Lớp ${payload?.className || '10A1'}).
Nội dung thông tin cần trao đổi: ${payload?.topic || 'nề nếp giờ tự học và sự tiến bộ của em'}.
Lưu ý: Không quy chụp, không kết luận kỷ luật, đề cao sự hợp tác giữa nhà trường và gia đình vì sự tiến bộ của học sinh.`;
    } else if (action === 'support_plan') {
      prompt = `Bạn là chuyên gia sư phạm. Hãy gợi ý một kế hoạch hỗ trợ học sinh ${payload?.studentName || ''} cải thiện nề nếp và học tập trong 2 tuần tới:
Thông tin tình hình: ${JSON.stringify(payload)}.
Kế hoạch gồm: 1. Mục tiêu cụ thể, 2. Phân công (GVCN, GVBM, GVQN, bạn bè), 3. Biện pháp hỗ trợ hàng ngày, 4. Tiêu chí đánh giá tiến bộ. Không đề xuất hình thức kỷ luật tiêu cực.`;
    } else {
      prompt = `Bạn là trợ lý giáo dục ClassCare AI. Hãy tóm tắt ngắn gọn và phân tích khách quan tình hình của học sinh dựa trên thông tin sau: ${JSON.stringify(payload)}. Gợi ý hướng đồng hành sư phạm phù hợp.`;
    }

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Bạn là trợ lý sư phạm ClassCare AI. Bạn chỉ cung cấp các đề xuất tham khảo, tích cực, không tự quyết định kỷ luật hay kết luận vi phạm của học sinh.',
      },
    });

    return res.json({
      success: true,
      result: aiResponse.text || 'Không nhận được phản hồi từ AI.',
    });
  } catch (err: any) {
    console.error('Lỗi khi gọi Gemini API:', err);
    return res.json({
      success: true,
      result: `Đề xuất sư phạm tham khảo: Cần tiếp tục duy trì phối hợp giữa GVCN và GVQN để theo dõi sát sao sự tiến bộ của học sinh.`,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Only listen when running standalone, not in Vercel serverless function
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`ClassCare AI server running on http://0.0.0.0:${PORT}`);
    });
  }
}

// In standard runtime, execute startServer()
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
