require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全配置
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8888', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态资源访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const uploadPath = path.join(__dirname, 'uploads/offers');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ----------------------------------------------------------------
// 安全工具函数
// ----------------------------------------------------------------
const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权访问' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Token无效或已过期' });
  }

  req.user = decoded;
  next();
};

// 输入验证Schema
const crmSchema = Joi.object({
  id: Joi.number().allow(null),
  name: Joi.string().trim().max(100).required(),
  date: Joi.string().trim().required(),
  bizType: Joi.string().valid('留学', '培训', '培训+留学').required(),
  source: Joi.string().trim().max(100).required(),
  advisor: Joi.string().trim().max(50).required(),
  campus: Joi.string().trim().max(50).required(),
  group_name: Joi.string().trim().max(50).required(),
  training_project: Joi.string().valid('低龄', '雅思', '其他', '').allow('').optional(),
  intentLevel: Joi.number().integer().min(0).max(5).default(0),
  demand: Joi.string().trim().max(500).allow(''),
  isSigned: Joi.string().valid('是', '否').default('否'),
  income: Joi.number().min(0).default(0),
  project: Joi.string().trim().max(200).allow(''),
  salesNote: Joi.string().trim().max(500).allow(''),
  contractor: Joi.string().trim().max(50).allow('')
});

const studentSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  undergraduate_school: Joi.string().trim().max(200).allow(''),
  undergraduate_major: Joi.string().trim().max(100).allow(''),
  gpa: Joi.string().trim().max(20).allow(''),
  language_scores: Joi.string().trim().max(100).allow(''),
  case_type: Joi.string().valid('Success', 'Failure').required(),
  story_tag: Joi.string().trim().max(50).allow(''),
  case_analysis: Joi.string().trim().max(2000).allow(''),
  offers: Joi.array().items(Joi.object({
    school: Joi.string().trim().max(200).required(),
    major: Joi.string().trim().max(100).required(),
    is_primary: Joi.boolean().default(false),
    status: Joi.string().trim().max(50).default('已录取'),
    notes: Joi.string().trim().max(200).allow(''),
    image_url: Joi.string().trim().allow('')
  })).optional().allow(null)
});

// ----------------------------------------------------------------
// 管理员用户管理
// ----------------------------------------------------------------
const ADMIN_FILE = path.join(__dirname, 'admin.json');

const initAdmin = async () => {
  if (!fs.existsSync(ADMIN_FILE)) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD, 
      parseInt(process.env.BCRYPT_ROUNDS)
    );
    const admin = {
      id: 1,
      username: 'KBOadmin',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2));
    console.log('默认管理员账号已创建: KBOadmin / Admin@2024');
  }
};

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!fs.existsSync(ADMIN_FILE)) {
      return res.status(500).json({ success: false, message: '系统初始化中' });
    }

    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    
    if (username !== adminData.username) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const isValidPassword = await bcrypt.compare(password, adminData.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const token = generateToken(adminData.id, adminData.username);
    res.json({ 
      success: true, 
      message: '登录成功',
      token,
      user: { id: adminData.id, username: adminData.username }
    });

  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 修改密码接口
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!fs.existsSync(ADMIN_FILE)) {
      return res.status(500).json({ success: false, message: '系统错误' });
    }

    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    const isValidPassword = await bcrypt.compare(oldPassword, adminData.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: '旧密码错误' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: '新密码至少6位' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS));
    adminData.password = hashedPassword;
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));

    res.json({ success: true, message: '密码修改成功' });

  } catch (err) {
    console.error('修改密码错误:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ----------------------------------------------------------------
// 案例库系统逻辑 (Students & Offers)
// ----------------------------------------------------------------
let students = [];
let nextId = 1;

function loadData() {
    const DATA_FILE = path.join(__dirname, 'data.json');
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            if (data && data.trim()) {
                const parsedData = JSON.parse(data);
                students = parsedData.students || [];
                if (students.length > 0) {
                    nextId = Math.max(...students.map(s => s.id)) + 1;
                }
            }
        } catch (err) {
            console.error("加载案例库数据失败:", err);
            students = [];
        }
    }
}

function saveData() {
    const DATA_FILE = path.join(__dirname, 'data.json');
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ students }, null, 2), 'utf8');
    } catch (err) {
        console.error("保存案例库数据失败:", err);
    }
}

// 案例库接口（需要认证）
app.get('/api/students', authenticateToken, (req, res) => {
  res.json({ success: true, data: students });
});

app.get('/api/students/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ success: false, message: '未找到学员' });
    res.json({ success: true, data: student });
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const { error } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const newStudent = { ...req.body, id: nextId++, created_at: new Date().toISOString() };
    students.push(newStudent);
    saveData();
    res.json({ success: true, data: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: '保存失败' });
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: '未找到学员' });
    students[index] = { ...students[index], ...req.body, id };
    saveData();
    res.json({ success: true, data: students[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

app.delete('/api/students/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    saveData();
    res.json({ success: true });
});

// ----------------------------------------------------------------
// CRM 市场部系统逻辑 (Leads & Sales)
// ----------------------------------------------------------------
const CRM_DATA_FILE = path.join(__dirname, 'crm_data.json');

app.get('/api/crm', authenticateToken, (req, res) => {
    try {
        if (fs.existsSync(CRM_DATA_FILE)) {
            const data = fs.readFileSync(CRM_DATA_FILE, 'utf8');
            res.json({ success: true, data: JSON.parse(data || '[]') });
        } else {
            res.json({ success: true, data: [] });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "读取CRM失败" });
    }
});

app.post('/api/crm', authenticateToken, async (req, res) => {
    try {
        const { error } = crmSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newItem = req.body;
        let db = [];
        if (fs.existsSync(CRM_DATA_FILE)) {
            const data = fs.readFileSync(CRM_DATA_FILE, 'utf8');
            db = JSON.parse(data || '[]');
        }

        if (newItem.id) {
            const index = db.findIndex(item => Number(item.id) === Number(newItem.id));
            if (index !== -1) {
                db[index] = { ...db[index], ...newItem };
            }
        } else {
            const newEntry = {
                id: Date.now(),
                date: newItem.date || new Date().toISOString().split('T')[0],
                name: newItem.name,
                bizType: newItem.bizType || "培训",
                source: newItem.source || "自媒体",
                advisor: newItem.advisor || "Dora",
                campus: newItem.campus || "金山湖",
                isSigned: newItem.isSigned || "否",
                income: newItem.income || 0,
                group_name: newItem.group_name || "高中",
                training_project: newItem.training_project || "",
                demand: newItem.demand || "",
                intentLevel: newItem.intentLevel || 0,
                project: newItem.project || "",
                salesNote: newItem.salesNote || "",
                contractor: newItem.contractor || ""
            };
            db.push(newEntry);
        }

        fs.writeFileSync(CRM_DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
        res.json({ success: true, message: "同步成功" });
    } catch (err) {
        console.error("保存CRM失败:", err);
        res.status(500).json({ success: false, message: '保存失败' });
    }
});

app.delete('/api/crm/:id', authenticateToken, (req, res) => {
    try {
        const id = Number(req.params.id);
        if (fs.existsSync(CRM_DATA_FILE)) {
            const data = fs.readFileSync(CRM_DATA_FILE, 'utf8');
            let db = JSON.parse(data || '[]');
            
            const initialLength = db.length;
            const newDb = db.filter(item => Number(item.id) !== id);

            if (newDb.length === initialLength) {
                return res.status(404).json({ success: false, message: "未找到该记录" });
            }

            fs.writeFileSync(CRM_DATA_FILE, JSON.stringify(newDb, null, 2), 'utf8');
            res.json({ success: true, message: "删除成功" });
        } else {
            res.status(404).json({ success: false, message: "数据库文件不存在" });
        }
    } catch (err) {
        console.error("删除CRM记录失败:", err);
        res.status(500).json({ success: false, message: "服务器错误" });
    }
});

// ----------------------------------------------------------------
// 启动服务器
// ----------------------------------------------------------------
initAdmin().then(() => {
  loadData();
  app.listen(PORT, () => {
      console.log(`
      =========================================
      🚀 后端服务已启动 (安全版)
      📍 API地址: http://localhost:${PORT}
      🔐 安全特性: JWT认证 | BCrypt加密 | 输入验证
      =========================================
      `);
  });
});
