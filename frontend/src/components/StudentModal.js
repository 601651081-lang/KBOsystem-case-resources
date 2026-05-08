import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://43.139.194.125/api';

const StudentModal = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState({
    name: '',
    undergraduate_school: '',
    undergraduate_major: '',
    gpa: '',
    language_scores: '',
    offers: [],
    // 初始化新增字段
    case_type: 'Normal',
    story_tag: '',
    case_analysis: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        undergraduate_school: student.undergraduate_school || '',
        undergraduate_major: student.undergraduate_major || '',
        gpa: student.gpa || '',
        language_scores: student.language_scores || '',
        offers: student.offers || [],
        // 确保编辑时加载这些字段
        case_type: student.case_type || 'Normal',
        story_tag: student.story_tag || '',
        case_analysis: student.case_analysis || ''
      });
    } else if (isOpen) {
      setFormData({
        name: '', 
        undergraduate_school: '', 
        undergraduate_major: '',
        gpa: '', 
        language_scores: '', 
        offers: [],
        case_type: 'Normal', 
        story_tag: '', 
        case_analysis: ''
      });
    }
  }, [student, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOfferChange = (index, field, value) => {
    const newOffers = [...formData.offers];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setFormData({ ...formData, offers: newOffers });
  };

  const addOffer = () => {
    const newOffer = { school: '', major: '', status: '已录取', is_primary: formData.offers.length === 0, notes: '' };
    setFormData({ ...formData, offers: [...formData.offers, newOffer] });
  };

  const removeOffer = (index) => {
    const newOffers = formData.offers.filter((_, i) => i !== index);
    setFormData({ ...formData, offers: newOffers });
  };

  const setPrimary = (index) => {
    const newOffers = formData.offers.map((offer, i) => ({
      ...offer,
      is_primary: i === index
    }));
    setFormData({ ...formData, offers: newOffers });
  };

  const handleFileChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('offer_image', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, uploadData);
      handleOfferChange(index, 'image_url', res.data.imageUrl);
      alert('Offer图片上传成功');
    } catch (err) {
      alert('上传失败');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{student ? '编辑学员档案' : '录入新学员'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">✕</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          {/* 1. 基础信息区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">姓名 *</label>
              <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">本科学校</label>
              <input name="undergraduate_school" value={formData.undergraduate_school} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">本科专业</label>
              <input name="undergraduate_major" value={formData.undergraduate_major} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">GPA / 绩点</label>
                <input name="gpa" value={formData.gpa} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">语言成绩</label>
                <input name="language_scores" value={formData.language_scores} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* 2. 案例包装区 (核心新增) */}
          <div className="bg-orange-50 p-6 rounded-xl mb-8 border border-orange-200 shadow-inner">
            <h3 className="text-sm font-black text-orange-800 mb-4 flex items-center uppercase tracking-wider">
              <span className="mr-2 text-lg">💡</span> Case Packaging / 案例分析包装
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-orange-700 mb-1 uppercase tracking-widest">案例性质</label>
                <select 
                  name="case_type" 
                  value={formData.case_type} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-orange-300 rounded-lg bg-white text-sm font-bold focus:ring-2 focus:ring-orange-400 outline-none"
                >
                  <option value="Normal">常规案例 (Normal)</option>
                  <option value="Success">⭐ 成功案例 (Success)</option>
                  <option value="Failure">⚠️ 失败案例 (Failure)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-700 mb-1 uppercase tracking-widest">特殊标签 (Story Tag)</label>
                <input 
                  name="story_tag" 
                  placeholder="如：低分逆袭、跨专业、大龄、名企背景" 
                  value={formData.story_tag} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-orange-300 rounded-lg text-base font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-orange-700 mb-1 uppercase tracking-widest">核心复盘与策略分析 (Case Analysis)</label>
                <textarea 
                  name="case_analysis" 
                  rows="3"
                  value={formData.case_analysis} 
                  onChange={handleInputChange}
                  placeholder="请输入该案例的难点、亮点以及最终成功的关键因素，供内部参考..."
                  className="w-full p-3 border border-orange-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* 3. 录取信息区 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">录取 Offer 详情</h3>
              <button type="button" onClick={addOffer} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold text-xs transition-colors">+ 添加录入院校</button>
            </div>
            
            <div className="space-y-4">
              {formData.offers.map((offer, index) => (
                <div key={index} className={`p-6 border rounded-xl transition-all ${offer.is_primary ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input placeholder="录取院校名称" value={offer.school} onChange={(e) => handleOfferChange(index, 'school', e.target.value)} className="p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-400 outline-none" />
                    <input placeholder="录取专业" value={offer.major} onChange={(e) => handleOfferChange(index, 'major', e.target.value)} className="p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-400 outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select value={offer.status} onChange={(e) => handleOfferChange(index, 'status', e.target.value)} className="p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-400 outline-none">
                      <option value="已录取">已录取</option>
                      <option value="待确认">待确认</option>
                      <option value="已拒绝">已拒绝</option>
                    </select>
                    <input placeholder="备注信息 (如: 奖学金, 语言要求等)" value={offer.notes} onChange={(e) => handleOfferChange(index, 'notes', e.target.value)} className="p-3 border rounded-md bg-white focus:ring-2 focus:ring-blue-400 outline-none" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center text-sm font-bold cursor-pointer text-gray-700">
                        <input type="radio" checked={offer.is_primary} onChange={() => setPrimary(index)} className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        设为主录取展示
                      </label>
                      <div className="flex items-center">
                        <label className="text-xs text-gray-500 mr-2 font-medium">上传凭证:</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeOffer(index)} className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">移除此条</button>
                  </div>
                  {offer.image_url && <p className="text-green-600 text-[11px] mt-2 font-black italic">✓ 真实Offer电子凭证已存档</p>}
                </div>
              ))}
              {formData.offers.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400 text-sm">暂无录入院校信息，请点击上方按钮添加</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. 底部操作按钮 */}
          <div className="flex justify-end space-x-4 border-t border-gray-100 pt-8 mt-8">
            <button type="button" onClick={onClose} className="px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-bold transition-all">取消</button>
            <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg font-black transition-all transform active:scale-95">保存学员档案</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;