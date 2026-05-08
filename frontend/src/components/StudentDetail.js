import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://43.139.194.125/api';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(response.data.data);
        setFormData(response.data.data);
      } catch (err) {
        console.error('获取失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/students/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(response.data.data);
      setIsEditing(false);
      alert('档案更新成功！');
    } catch (err) {
      alert('更新失败');
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">读取数据中...</div>;
  if (!student) return <div className="p-20 text-center text-gray-500 font-medium">找不到该学员</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden pb-20">
      
      {/* 1. 背景装饰：消除单调感的核心 */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full"></div>
        <div className="absolute top-[30%] -right-[5%] w-[30%] h-[40%] bg-orange-100/30 blur-[100px] rounded-full"></div>
      </div>

      <nav className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate('/cases')} className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center">
          <span className="mr-1">←</span> 返回列表
        </button>
        <div className="space-x-4">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 font-bold">编辑档案</button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 font-bold transition-all">取消</button>
              <button onClick={handleUpdate} className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 font-bold">保存修改</button>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左侧栏：学员概况与标签 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200/60 sticky top-28">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100 mb-4">
                {student.name.charAt(0)}
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{student.name}</h1>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {student.case_type === 'Success' && (
                  <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg shadow-sm">SUCCESS CASE</span>
                )}
                {student.case_type === 'Failure' && (
                  <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg shadow-sm">FAILURE CASE</span>
                )}
                {student.story_tag && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-lg border border-orange-100">#{student.story_tag}</span>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div>
                <p className="text-[15px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic / 本科背景</p>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">{student.undergraduate_school}<br/>{student.undergraduate_major}</p>
              </div>
              <div>
                <p className="text-[15px] font-black text-gray-400 uppercase tracking-widest mb-1">Scores / 成绩</p>
                <p className="text-sm font-bold text-gray-700">{student.language_scores || '无'} (GPA: {student.gpa})</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧主内容区 */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 策略复盘区块 - 强化 UI 设计 */}
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-orange-600 rounded-l-3xl"></div>
            <div className="bg-white p-8 pl-10 rounded-3xl shadow-sm border border-gray-100 transition-all group-hover:shadow-md">
              <h2 className="text-sm font-black text-orange-600 mb-4 flex items-center uppercase tracking-widest">
                <span className="mr-2 text-lg">📝</span> Case Analysis / 核心复盘与策略分析
              </h2>
              {isEditing ? (
                <textarea 
                  name="case_analysis" 
                  value={formData.case_analysis || ''} 
                  onChange={handleInputChange}
                  className="w-full p-4 border border-orange-200 rounded-2xl text-sm min-h-[160px] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                  placeholder="在此输入深度复盘内容..."
                />
              ) : (
                /* 关键修改：添加 whitespace-pre-wrap 类名 */
                <div className="text-gray-700 leading-relaxed text-base italic bg-orange-50/30 p-5 rounded-2xl border border-orange-100/50 whitespace-pre-wrap">
                  {student.case_analysis ? student.case_analysis : <span className="text-gray-300">暂无分析数据</span>}
               </div>
              )}
              
            </div>
          </div>

          {/* 录取结果展示 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-black mb-8 flex items-center text-gray-800 tracking-tight">
              <span className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></span>
              Admission Results / 录取结果清单
            </h2>

            <div className="grid gap-6">
              {(isEditing ? formData : student).offers?.map((offer, idx) => (
                <div key={idx} className={`p-6 border rounded-2xl flex justify-between items-center transition-all hover:scale-[1.01] hover:shadow-lg ${offer.is_primary ? 'bg-blue-50/30 border-blue-100 shadow-blue-50/50' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-black text-gray-800">{offer.school}</h3>
                      {offer.is_primary && <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tighter shadow-md shadow-blue-200">Main Offer</span>}
                    </div>
                    <p className="text-gray-500 font-bold text-sm tracking-tight">{offer.major}</p>
                    {offer.notes && <p className="text-xs text-blue-400 mt-2 font-bold italic"># {offer.notes}</p>}
                  </div>
                  
                  {offer.image_url && (
                    <div 
                      className="cursor-zoom-in relative group/img"
                      onClick={() => setPreviewImage(`http://localhost:3001${offer.image_url}`)}
                    >
                      <img 
                        src={`http://localhost:3001${offer.image_url}`} 
                        className="w-32 h-20 object-cover rounded-xl shadow-md border-2 border-white transition-all group-hover/img:brightness-90"
                        alt="Offer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm">查看大图</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 图片预览 Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-pointer transition-all" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} className="max-w-full max-h-[85vh] border-8 border-white shadow-2xl rounded-3xl transition-transform" alt="Large" />
          <p className="text-white mt-8 font-black uppercase tracking-widest text-sm opacity-50">Click anywhere to close</p>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;