import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Search, Filter, ChevronDown, Star } from 'lucide-react';
import logo from './assets/灯塔.png';
import CaseSystem from './CaseSystem';

const API_BASE_URL = 'http://localhost:3001/api';

const BIZ_TYPES = ['留学', '培训', '培训+留学'];
const GROUPS = ['少儿小初', '高中/大学生', '成人客户'];
const SOURCES = ['美团', '小红书', '抖音', '广告宣传-自动上门', '渠道推荐', '老客户推荐', '活动推广', 'Wilson老板', '内部员工', '高德/百度地图', '公众号/扫一扫/视频号'];
const ADVISORS = ['Dora', 'VIP', 'Avril'];
const CAMPUSES = ['佳兆业', '金山湖'];

const FormInput = ({ label, value, onChange, placeholder, required, type = "text", autoFocus }) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">{label}</label>
    <input
      type={type}
      required={required}
      autoFocus={autoFocus}
      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const FormSelect = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">{label}</label>
    <select
      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const FormTextArea = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">{label}</label>
    <textarea
      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const FormStarRating = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-all ${star <= value ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-400 self-center">{value}星</span>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isLoggedIn', 'true');
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] p-10 shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg" />
          <h1 className="text-2xl font-black text-gray-900">KB International</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">学生管理系统</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">账号</label>
            <input
              type="text"
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入账号"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">密码</label>
            <input
              type="password"
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1E293B] text-white rounded-2xl font-black text-lg hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const MainDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const modules = [
    { name: '市场部数据中心', path: '/crm', color: 'from-blue-600 to-blue-800', icon: '📊', desc: '客资管理 / 业绩统计' },
    { name: '案例管理系统', path: '/cases', color: 'from-emerald-500 to-emerald-700', icon: '📚', desc: '留学录取 / 案例分析' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4 rounded-3xl shadow-2xl border-4 border-white/20" />
          <h1 className="text-4xl font-black text-white mb-2">KB International Education</h1>
          <p className="text-blue-300 font-medium tracking-wider">学生管理系统</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {modules.map((mod, i) => (
            <motion.button
              key={mod.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(mod.path)}
              className={`bg-gradient-to-br ${mod.color} p-8 rounded-[28px] shadow-xl hover:scale-105 transition-all text-left group`}
            >
              <div className="text-5xl mb-4">{mod.icon}</div>
              <h2 className="text-2xl font-black text-white mb-1">{mod.name}</h2>
              <p className="text-white/70 text-sm font-medium">{mod.desc}</p>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-full text-sm font-bold transition-all duration-300 mb-8 border border-red-500/30 hover:border-red-500/50"
          >
            退出登录
          </button>
          <p className="text-slate-500 text-xs font-medium tracking-wider">
            © 2026 KB International Education. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

function CRMSystem() {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [filterAdvisor, setFilterAdvisor] = useState('全部顾问');
  const [filterSource, setFilterSource] = useState('全部来源');
  const [filterGroup, setFilterGroup] = useState('全部群体');
  const [filterCampus, setFilterCampus] = useState('全部校区');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResourceBoard, setShowResourceBoard] = useState(false);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', date: new Date().toISOString().split('T')[0],
    bizType: '培训', group_name: '高中/大学生',
    source: '小红书', advisor: 'Dora', campus: '金山湖',
    demand: '', isSigned: '否', intentLevel: 0,
    income: 0, contractor: '', salesNote: '', project: ''
  });
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/crm`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDb(res.data.data || []);
    } catch (err) { console.error("加载失败", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    return db.filter(item => {
      const matchMonth = item.date.startsWith(filterMonth);
      const matchAdvisor = filterAdvisor === '全部顾问' || item.advisor === filterAdvisor;
      const matchSource = filterSource === '全部来源' || item.source === filterSource;
      const matchGroup = filterGroup === '全部群体' || item.group_name === filterGroup;
      const matchCampus = filterCampus === '全部校区' || item.campus === filterCampus;
      const matchSearch = (item.name || "").includes(searchTerm);
      return matchMonth && matchAdvisor && matchSource && matchGroup && matchCampus && matchSearch;
    }).sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  }, [db, filterMonth, filterAdvisor, filterSource, filterGroup, filterCampus, searchTerm]);

  const dashboardData = useMemo(() => {
    return db.filter(item => item.date >= startDate && item.date <= endDate && item.isSigned !== '是');
  }, [db, startDate, endDate]);

  const leadsData = filteredData.filter(i => i.isSigned !== '是').sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });
  const salesData = db.filter(i => i.isSigned === '是' && i.date.startsWith(filterMonth)).sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });

  const totalMonthlyIncome = useMemo(() => {
    return salesData.reduce((sum, curr) => sum + (parseFloat(curr.income) || 0), 0);
  }, [salesData]);

  const resourceStats = useMemo(() => {
    const stats = {
      campuses: CAMPUSES,
      advisors: ADVISORS,
      groups: GROUPS,
      sources: SOURCES,
      campusAdvisorGroupData: {},
      groupTotal: {},
      advisorTotal: {},
      sourceCampusData: {},
      sourceTotal: {},
      campusTotal: {}
    };

    CAMPUSES.forEach(campus => {
      stats.campusAdvisorGroupData[campus] = {};
      ADVISORS.forEach(advisor => {
        stats.campusAdvisorGroupData[campus][advisor] = {};
        GROUPS.forEach(group => {
          stats.campusAdvisorGroupData[campus][advisor][group] = 0;
        });
      });
    });

    GROUPS.forEach(group => { stats.groupTotal[group] = { total: 0, campuses: {} }; });
    ADVISORS.forEach(advisor => { stats.advisorTotal[advisor] = 0; });
    SOURCES.forEach(source => { stats.sourceCampusData[source] = {}; CAMPUSES.forEach(campus => { stats.sourceCampusData[source][campus] = 0; }); });
    CAMPUSES.forEach(campus => { stats.sourceTotal[campus] = 0; stats.campusTotal[campus] = 0; });

    dashboardData.forEach(item => {
      const campus = item.campus || CAMPUSES[0];
      const advisor = item.advisor || ADVISORS[0];
      const group = item.group_name || GROUPS[0];
      const source = item.source || SOURCES[0];

      if (stats.campusAdvisorGroupData[campus]?.[advisor]) {
        if (stats.campusAdvisorGroupData[campus][advisor][group] !== undefined) {
          stats.campusAdvisorGroupData[campus][advisor][group]++;
        }
      }

      if (stats.groupTotal[group]) {
        stats.groupTotal[group].total++;
        if (!stats.groupTotal[group].campuses[campus]) stats.groupTotal[group].campuses[campus] = 0;
        stats.groupTotal[group].campuses[campus]++;
      }

      if (stats.advisorTotal[advisor] !== undefined) stats.advisorTotal[advisor]++;
      if (stats.campusTotal[campus] !== undefined) stats.campusTotal[campus]++;

      if (stats.sourceCampusData[source]?.[campus] !== undefined) {
        stats.sourceCampusData[source][campus]++;
      }
      if (stats.sourceTotal[campus] !== undefined) stats.sourceTotal[campus]++;
    });

    const grandTotal = dashboardData.length;
    return { ...stats, grandTotal };
  }, [dashboardData]);

  const openAddModal = (type) => {
    setEditingId(null);
    setFormData({
      name: '', date: new Date().toISOString().split('T')[0],
      bizType: '培训', group_name: '高中/大学生',
      source: type === 'sales' ? '' : '小红书', advisor: type === 'sales' ? '' : 'Dora', campus: '金山湖',
      demand: '', isSigned: type === 'sales' ? '是' : '否', intentLevel: 0,
      income: 0, contractor: '', salesNote: '', project: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("登录已过期，请重新登录");
        localStorage.clear();
        window.location.reload();
        return;
      }
      await axios.post(`${API_BASE_URL}/crm`, { ...formData, id: editingId || undefined }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "保存失败";
      alert("保存失败: " + msg);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`确定要删除 [${name}] 的记录吗？`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/crm/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { alert("删除失败"); }
    }
  };

  const handleChangePassword = async () => {
    if (!pwdData.oldPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
      alert('请填写所有字段');
      return;
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      alert('新密码两次输入不一致');
      return;
    }
    if (pwdData.newPassword.length < 6) {
      alert('新密码至少6位');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('密码修改成功，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || '修改失败');
    }
  };

  const resetFilters = () => {
    setFilterAdvisor('全部顾问');
    setFilterSource('全部来源');
    setFilterGroup('全部群体');
    setFilterCampus('全部校区');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl shadow" />
              <span className="font-black text-gray-700">市场部数据中心</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/cases')}
                className="bg-green-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all"
              >
                📚 案例库
              </button>
              <button
                onClick={() => setShowChangePwdModal(true)}
                className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all"
              >
                🔐 修改密码
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === 'leads' ? 'bg-[#1E293B] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📋 客资咨询表
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === 'sales' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            💰 签约业绩表
          </button>
          <button
            onClick={() => setShowResourceBoard(!showResourceBoard)}
            className={`px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all ${showResourceBoard ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📊 资源看板
          </button>
        </div>

        <AnimatePresence>
          {showResourceBoard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">开始日期</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">结束日期</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 text-white text-center py-2">
                      <h3 className="font-black text-lg">📊 资源分配看板</h3>
                      <p className="text-xs mt-1">统计周期: {startDate} 至 {endDate}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-3 py-2 text-left font-bold">资源类别</th>
                            <th className="border border-gray-400 px-3 py-2 text-center font-bold">校区/顾问</th>
                            {ADVISORS.map(a => <th key={a} className="border border-gray-400 px-3 py-2 text-center font-bold">{a}</th>)}
                            <th className="border border-gray-400 px-3 py-2 text-center font-bold bg-yellow-100">小计</th>
                          </tr>
                        </thead>
                        <tbody>
                          {GROUPS.map(group => (
                            <>
                              {CAMPUSES.map((campus, idx) => {
                                const rowTotal = ADVISORS.reduce((sum, advisor) => 
                                  sum + (resourceStats.campusAdvisorGroupData[campus]?.[advisor]?.[group] || 0), 0);
                                return (
                                  <tr key={`${group}-${campus}`} className={idx === CAMPUSES.length - 1 ? 'border-b-2 border-gray-400' : ''}>
                                    {idx === 0 && <td rowSpan={CAMPUSES.length} className="border border-gray-400 px-3 py-2 font-bold bg-gray-50">{group}</td>}
                                    <td className="border border-gray-400 px-3 py-2 text-center">{campus}</td>
                                    {ADVISORS.map(advisor => (
                                      <td key={advisor} className="border border-gray-400 px-3 py-2 text-center font-bold">
                                        {resourceStats.campusAdvisorGroupData[campus]?.[advisor]?.[group] || 0}
                                      </td>
                                    ))}
                                    <td className="border border-gray-400 px-3 py-2 text-center font-bold">{rowTotal}</td>
                                  </tr>
                                );
                              })}
                            </>
                          ))}
                          <tr className="bg-yellow-300">
                            <td className="border border-gray-400 px-3 py-2 font-black">📈 资源小计</td>
                            <td className="border border-gray-400 px-3 py-2 text-center font-black">全校区汇总</td>
                            {ADVISORS.map(advisor => (
                              <td key={advisor} className="border border-gray-400 px-3 py-2 text-center font-black">
                                {resourceStats.advisorTotal[advisor] || 0}
                              </td>
                            ))}
                            <td className="border border-gray-400 px-3 py-2 text-center font-black">{resourceStats.grandTotal}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 text-white text-center py-2">
                      <h3 className="font-black text-lg">🎯 招生来源统计</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-3 py-2 text-center font-bold">招生来源</th>
                            {SOURCES.map(s => <th key={s} className="border border-gray-400 px-3 py-2 text-center font-bold">{s}</th>)}
                            <th className="border border-gray-400 px-3 py-2 text-center font-bold bg-yellow-100">总计</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CAMPUSES.map(campus => {
                            const campusTotal = SOURCES.reduce((sum, source) => 
                              sum + (resourceStats.sourceCampusData[source]?.[campus] || 0), 0);
                            return (
                              <tr key={campus}>
                                <td className="border border-gray-400 px-3 py-2 font-bold">{campus}</td>
                                {SOURCES.map(source => (
                                  <td key={source} className="border border-gray-400 px-3 py-2 text-center font-bold">
                                    {resourceStats.sourceCampusData[source]?.[campus] || 0}
                                  </td>
                                ))}
                                <td className="border border-gray-400 px-3 py-2 text-center font-bold">{campusTotal}</td>
                              </tr>
                            );
                          })}
                          <tr className="bg-yellow-300">
                            <td className="border border-gray-400 px-3 py-2 font-black">📊 来源小计</td>
                            {SOURCES.map(source => {
                              const sourceTotal = CAMPUSES.reduce((sum, campus) => 
                                sum + (resourceStats.sourceCampusData[source]?.[campus] || 0), 0);
                              return (
                                <td key={source} className="border border-gray-400 px-3 py-2 text-center font-black">
                                  {sourceTotal}
                                </td>
                              );
                            })}
                            <td className="border border-gray-400 px-3 py-2 text-center font-black">{resourceStats.grandTotal}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              {activeTab === 'leads' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-400 uppercase">月份</span>
                    <input
                      type="month"
                      value={filterMonth}
                      onChange={e => setFilterMonth(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterAdvisor}
                    onChange={e => setFilterAdvisor(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="全部顾问">全部顾问</option>
                    {ADVISORS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select
                    value={filterSource}
                    onChange={e => setFilterSource(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="全部来源">全部来源</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={filterGroup}
                    onChange={e => setFilterGroup(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="全部群体">全部群体</option>
                    {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select
                    value={filterCampus}
                    onChange={e => setFilterCampus(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="全部校区">全部校区</option>
                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    重置
                  </button>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">
                      共 {leadsData.length} 条记录
                    </span>
                    <button
                      onClick={() => openAddModal(activeTab)}
                      className="bg-[#1E293B] text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                    >
                      <PlusCircle className="w-4 h-4" /> 录入客资
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-400 uppercase">月份</span>
                    <input
                      type="month"
                      value={filterMonth}
                      onChange={e => setFilterMonth(e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="text-sm font-black text-blue-600">{filterMonth} 签约情况统计</span>
                    <span className="text-sm font-bold text-gray-500">共 {salesData.length} 条记录</span>
                    <button
                      onClick={() => openAddModal(activeTab)}
                      className="bg-[#1E293B] text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                    >
                      <PlusCircle className="w-4 h-4" /> 录入业绩
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'leads' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest w-12">序号</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">日期 / 校区</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">客户姓名 / 来源</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">业务分类 / 群体</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">顾问</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">意向强度</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">具体需求备注</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leadsData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-5 text-sm font-bold text-gray-400">{index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-700">{item.date}</div>
                        <div className="text-[10px] font-black text-blue-500">{item.campus}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-[#1E293B]">{item.name}</div>
                        <div className="text-[10px] font-bold text-gray-400">来源：{item.source}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-600">{item.bizType}</div>
                        <div className="text-[10px] font-medium text-gray-400">{item.group_name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-[#1E293B]">{item.advisor}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= (item.intentLevel || 0) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="max-w-xs text-sm text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {item.demand || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(item)} className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50/50 border-b border-blue-100">
                    <th className="px-4 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest w-12">序号</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">日期</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">客户姓名 / 来源</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">顾问 / 对接人</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">签约项目</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">签约金额</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest">备注</th>
                    <th className="px-6 py-5 text-[11px] font-black text-blue-600 uppercase tracking-widest text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salesData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-5 text-sm font-bold text-gray-400">{index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-700">{item.date}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-[#1E293B]">{item.name}</div>
                        <div className="text-[10px] font-bold text-gray-400">来源：{item.source}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-purple-600">{item.advisor}</div>
                        <div className="text-[10px] font-bold text-gray-400">对接人：{item.contractor || '-'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-gray-600">{item.project || '-'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-green-600">¥ {(parseFloat(item.income) || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-xs text-gray-500 line-clamp-2 max-w-[120px]">{item.salesNote || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(item)} className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-600 text-white font-black">
                    <td colSpan="6" className="px-6 py-6 text-right uppercase tracking-widest text-sm">本月合计业绩总额：</td>
                    <td className="px-6 py-6 text-right text-xl">¥ {totalMonthlyIncome.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>



        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[35px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-[#1E293B]">{editingId ? '修改记录' : (activeTab === 'leads' ? '录入新客资' : '录入新业绩')}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="姓名" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="学生姓名" required autoFocus />
                    <FormInput label="日期" type="date" value={formData.date} onChange={v => setFormData({ ...formData, date: v })} />
                  </div>

                  {activeTab === 'leads' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormSelect label="业务分类" options={BIZ_TYPES} value={formData.bizType} onChange={v => setFormData({ ...formData, bizType: v })} />
                        <FormSelect label="咨询群体" options={GROUPS} value={formData.group_name} onChange={v => setFormData({ ...formData, group_name: v })} />
                      </div>
                      <FormSelect label="来源渠道" options={SOURCES} value={formData.source} onChange={v => setFormData({ ...formData, source: v })} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormSelect label="顾问老师" options={ADVISORS} value={formData.advisor} onChange={v => setFormData({ ...formData, advisor: v })} />
                        <FormSelect label="所属校区" options={CAMPUSES} value={formData.campus} onChange={v => setFormData({ ...formData, campus: v })} />
                      </div>
                      <FormStarRating label="意向强度" value={formData.intentLevel} onChange={v => setFormData({ ...formData, intentLevel: v })} />
                      <FormTextArea label="具体需求备注" value={formData.demand} onChange={v => setFormData({ ...formData, demand: v })} placeholder="填写学生的具体学习/留学需求..." />
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="签约项目" value={formData.project} onChange={v => setFormData({ ...formData, project: v })} placeholder="如：雅思一对一" />
                        <FormInput label="签约金额" type="number" value={formData.income} onChange={v => setFormData({ ...formData, income: v })} placeholder="¥ 0.00" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput label="所属顾问" value={formData.advisor} onChange={v => setFormData({ ...formData, advisor: v })} placeholder="如：Dora、VIP、Avril" />
                        <FormInput label="对接人" value={formData.contractor} onChange={v => setFormData({ ...formData, contractor: v })} />
                      </div>
                      <FormInput label="来源渠道" value={formData.source} onChange={v => setFormData({ ...formData, source: v })} />
                      <FormTextArea label="业绩备注" value={formData.salesNote} onChange={v => setFormData({ ...formData, salesNote: v })} placeholder="签约特殊情况说明..." />
                    </>
                  )}

                  <button type="submit" className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${activeTab === 'leads' ? 'bg-[#1E293B] text-white hover:bg-black' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    确认保存数据
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {showChangePwdModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900">修改密码</h3>
                  <button onClick={() => setShowChangePwdModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">原密码</label>
                    <input type="password" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500" value={pwdData.oldPassword} onChange={e => setPwdData({ ...pwdData, oldPassword: e.target.value })} placeholder="请输入原密码" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">新密码</label>
                    <input type="password" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500" value={pwdData.newPassword} onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })} placeholder="至少6位" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">确认新密码</label>
                    <input type="password" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-blue-500" value={pwdData.confirmPassword} onChange={e => setPwdData({ ...pwdData, confirmPassword: e.target.value })} placeholder="再次输入新密码" />
                  </div>
                </div>

                <button onClick={handleChangePassword} className="w-full mt-6 py-4 bg-[#1E293B] text-white rounded-2xl font-black text-lg hover:bg-black transition-all">
                  确认修改
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkTokenValidity());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard onLogout={handleLogout} />} />
        <Route path="/crm" element={<CRMSystem />} />
        <Route path="/cases/*" element={<CaseSystem />} />
      </Routes>
    </Router>
  );
}