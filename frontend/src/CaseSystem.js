import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 导入组件
import StudentCard from './components/StudentCard';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';

// 导入工具函数
import { getRegionBySchool, getCategoryByMajor, getSchoolType } from './utils/geoUtils';

// 导入 Logo
import logo from './assets/灯塔.png';

// 导入公司前台图片
import officeImg from './assets/office.png';

const API_BASE_URL = 'http://43.139.194.125/api';

const REGIONS = ['不限', '中国香港', '英国', '美国', '澳大利亚', '新加坡', '中国澳門', '马来西亚', '欧洲'];
const CATEGORIES = ['不限', '商科', '社科', '工科', '理科'];
const SCHOOL_TYPES = ['不限', '985院校', '211院校', '普通本科', '海外本科'];

function CaseSystem() {
  const navigate = useNavigate();
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(checkTokenValidity());
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 搜索与筛选状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [undergradSchoolSearch, setUndergradSchoolSearch] = useState('');
  const [undergradMajorSearch, setUndergradMajorSearch] = useState(''); 
  const [admittedSchoolSearch, setAdmittedSchoolSearch] = useState('');
  const [majorSearch, setMajorSearch] = useState('');

  const [selectedRegion, setSelectedRegion] = useState('不限');
  const [selectedCategory, setSelectedCategory] = useState('不限');
  const [selectedSchoolType, setSelectedSchoolType] = useState('不限');
  const [caseFilter, setCaseFilter] = useState('all'); 

  // --- 分页相关状态 ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [deletingStudentName, setDeletingStudentName] = useState('');

  // 获取数据
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (err) {
      console.error('获取学员列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchStudents();
  }, [isLoggedIn, fetchStudents]);

  // 当筛选条件改变时，重置页码到第 1 页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, undergradSchoolSearch, undergradMajorSearch, admittedSchoolSearch, majorSearch, selectedRegion, selectedCategory, selectedSchoolType, caseFilter]);

  // 1. 先进行过滤
  const filteredStudents = students.filter(student => {
    const nameMatch = (student.name || '').toLowerCase().includes(searchKeyword.toLowerCase());
    const ugSchoolMatch = (student.undergraduate_school || '').toLowerCase().includes(undergradSchoolSearch.toLowerCase());
    const ugMajorMatch = (student.undergraduate_major || '').toLowerCase().includes(undergradMajorSearch.toLowerCase());
    const schoolTypeMatch = selectedSchoolType === '不限' || getSchoolType(student.undergraduate_school) === selectedSchoolType;
    const caseMatch = caseFilter === 'all' || student.case_type === caseFilter;

    const hasMatchingOffer = (student.offers || []).some(offer => {
      const sSchoolMatch = (offer.school || '').toLowerCase().includes(admittedSchoolSearch.toLowerCase());
      const sMajorMatch = (offer.major || '').toLowerCase().includes(majorSearch.toLowerCase());
      const regionMatch = selectedRegion === '不限' || getRegionBySchool(offer.school) === selectedRegion;
      const categoryMatch = selectedCategory === '不限' || getCategoryByMajor(offer.major) === selectedCategory;
      return sSchoolMatch && sMajorMatch && regionMatch && categoryMatch;
    });

    const isSearchingOffer = admittedSchoolSearch || majorSearch || selectedRegion !== '不限' || selectedCategory !== '不限';
    
    return nameMatch && ugSchoolMatch && ugMajorMatch && schoolTypeMatch && caseMatch && (isSearchingOffer ? hasMatchingOffer : true);
  });

  // 2. 再进行分页计算
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 操作函数
  const handleAddStudent = () => { setEditingStudent(null); setIsModalOpen(true); };
  const handleEditStudent = (student) => { setEditingStudent(student); setIsModalOpen(true); };
  const handleDeleteClick = (student) => { setDeletingStudentId(student.id); setDeletingStudentName(student.name); setIsDeleteModalOpen(true); };

  const handleSaveStudent = async (studentData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingStudent) {
        await axios.put(`${API_BASE_URL}/students/${editingStudent.id}`, studentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/students`, studentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchStudents();
      setIsModalOpen(false);
    } catch (err) { alert('保存失败'); }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/students/${deletingStudentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      setIsDeleteModalOpen(false);
    } catch (err) { alert('删除失败'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden">
        
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/10 blur-[100px] rounded-full"></div>
        </div>

        <Routes>
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
              
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="flex items-center">
                  <div className="mr-6 w-24 h-24 p-3 bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-white flex items-center justify-center transition-transform hover:scale-105">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        案例管理系统 <span className="text-blue-600">.</span>
                      </h1>
                    </div>
                    <p className="text-gray-500/80 text-sm font-black uppercase tracking-[0.3em] ml-1">
                      KB International Education
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white/70 backdrop-blur-md border border-white p-4 rounded-2xl shadow-sm min-w-[140px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">总档案</p>
                    <p className="text-3xl font-black text-gray-900">{students.length}</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md border border-white p-4 rounded-2xl shadow-sm min-w-[140px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">已筛选</p>
                    <p className="text-3xl font-black text-blue-600">{filteredStudents.length}</p>
                  </div>
                  <button onClick={() => navigate('/')} className="h-14 w-14 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all" title="返回主页">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </button>
                  <button onClick={() => navigate('/crm')} className="h-14 w-14 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all" title="客资管理系统">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </button>
                  <button onClick={handleLogout} className="h-14 w-14 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-6 w-full h-60 overflow-hidden rounded-[2.5rem] shadow-xl border border-white">
                <img src={officeImg} className="w-full h-full object-cover" alt="前台" />
              </div>

              <div className="bg-white/75 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white/80 mb-10">
                <div className="flex space-x-2 mb-8 bg-gray-100/60 p-1.5 rounded-2xl w-fit">
                  <button onClick={() => setCaseFilter('all')} className={`px-14 py-5 rounded-xl text-base font-black transition-all ${caseFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>全部学员</button>
                  <button onClick={() => setCaseFilter('Success')} className={`px-14 py-5 rounded-xl text-base font-black transition-all ${caseFilter === 'Success' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'text-gray-400'}`}>🏆 成功案例</button>
                  <button onClick={() => setCaseFilter('Failure')} className={`px-14 py-5 rounded-xl text-base font-black transition-all ${caseFilter === 'Failure' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'text-gray-400'}`}>⚠️ 借鉴案例</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {[
                    { label: '搜索姓名...', val: searchKeyword, set: setSearchKeyword, icon: '👤' },
                    { label: '本科院校...', val: undergradSchoolSearch, set: setUndergradSchoolSearch, icon: '🏫' },
                    { label: '本科专业...', val: undergradMajorSearch, set: setUndergradMajorSearch, icon: '📘' },
                    { label: '录取院校...', val: admittedSchoolSearch, set: setAdmittedSchoolSearch, icon: '🎓' },
                    { label: '录取专业...', val: majorSearch, set: setMajorSearch, icon: '✨' }
                  ].map((item, i) => (
                    <div key={i} className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{item.icon}</span>
                      <input 
                        type="text" 
                        placeholder={item.label} 
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-medium" 
                        value={item.val} 
                        onChange={(e) => item.set(e.target.value)} 
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {[
                    { title: '录取地区', options: REGIONS, current: selectedRegion, set: setSelectedRegion },
                    { title: '申请专业', options: CATEGORIES, current: selectedCategory, set: setSelectedCategory },
                    { title: '本科背景', options: SCHOOL_TYPES, current: selectedSchoolType, set: setSelectedSchoolType }
                  ].map((row, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[14px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-0 sm:mr-6 w-24">{row.title}</span>
                      <div className="flex flex-wrap gap-2">
                        {row.options.map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => row.set(opt)} 
                            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${row.current === opt ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white/80 text-gray-500 border border-gray-100 hover:text-blue-600'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-10 px-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">学员档案库</h2>
                <button 
                  onClick={handleAddStudent} 
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 shadow-xl transition-all active:scale-95 font-bold"
                >
                  + 新增学员档案
                </button>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 改用 currentStudents 渲染当前页 */}
                    {currentStudents.map(student => (
                      <StudentCard key={student.id} student={student} onEdit={() => handleEditStudent(student)} onDelete={() => handleDeleteClick(student)} />
                    ))}
                  </div>

                  {/* 分页控制 UI */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-16 gap-3">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-sm disabled:opacity-20 transition-all active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`h-12 w-12 rounded-2xl text-sm font-black transition-all shadow-sm ${
                              currentPage === i + 1 
                              ? 'bg-blue-600 text-white shadow-blue-200 scale-110' 
                              : 'bg-white text-gray-400 border border-gray-100 hover:text-blue-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-sm disabled:opacity-20 transition-all active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}

              <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveStudent} student={editingStudent} />
              <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} studentName={deletingStudentName} />
            </main>
          } />
        </Routes>
      </div>
  );
}

export default CaseSystem;