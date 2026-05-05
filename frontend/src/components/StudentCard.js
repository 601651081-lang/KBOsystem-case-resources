import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  // 录取逻辑
  const primaryOffer = student.offers?.find(o => o.is_primary === true) || student.offers?.[0];
  
  const handleCardClick = () => {
    navigate(`/cases/student/${student.id}`);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      onClick={handleCardClick}
      // 注意：这里必须有 relative，右上角的 Badge 才能正确定位
      className="relative bg-white rounded-google-lg shadow-google-md overflow-hidden hover:shadow-google-lg transition-shadow duration-300 cursor-pointer border border-google-gray-200 hover:border-google-blue-300 flex flex-col"
    >
      {/* 1. 右上角状态角标 */}
      {student.case_type === 'Success' && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold z-10 shadow-sm">
          SUCCESS CASE
        </div>
      )}
      {student.case_type === 'Failure' && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold z-10 shadow-sm">
          FAILURE CASE
        </div>
      )}

      {/* 2. 卡片头部信息 */}
      <div className="p-6 border-b border-google-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-16"> {/* 留出空间防止文字被角标遮挡 */}
            <h3 className="text-xl font-bold text-google-gray-900">{student.name}</h3>
            
            {/* 故事标签展示 */}
            {student.story_tag && (
              <span className="mt-1 inline-block bg-orange-50 text-orange-700 text-[10px] px-2 py-0.5 rounded border border-orange-100 font-medium">
                #{student.story_tag}
              </span>
            )}

            <div className="flex items-center mt-2">
              <span className="text-sm text-google-gray-600 truncate max-w-[100px]">
                {student.undergraduate_school || '未填写院校'}
              </span>
              <span className="mx-2 text-google-gray-400">•</span>
              <span className="text-sm text-google-gray-600 truncate max-w-[100px]">
                {student.undergraduate_major || '未填写专业'}
              </span>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-1">
            <button
              onClick={(e) => handleButtonClick(e, onEdit)}
              className="p-1.5 text-google-blue-600 hover:bg-google-blue-50 rounded-full transition-colors"
              title="编辑"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="p-1.5 text-google-red-600 hover:bg-google-red-50 rounded-full transition-colors"
              title="删除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* GPA & 语言 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-bold text-google-gray-400 uppercase tracking-wider mb-0.5">GPA</div>
            <div className="text-sm font-semibold text-google-gray-900">{student.gpa || '--'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-google-gray-400 uppercase tracking-wider mb-0.5">Language</div>
            <div className="text-sm font-semibold text-google-gray-900">{student.language_scores || '--'}</div>
          </div>
        </div>
      </div>

      {/* 3. 主Offer展示区 */}
      <div className="p-6 bg-google-gray-50/50 flex-grow">
        {primaryOffer ? (
          <div className="space-y-3">
            <div className="flex items-center text-google-blue-700 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M7.608 10.139a1 1 0 00-1.216.304L4.128 13.03a1 1 0 001.544 1.272l1.228-1.496a1 1 0 00.516.194l2.583.516a1 1 0 00.274-1.98l-2.665-.533z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">主录取Offer</span>
            </div>
            
            <div>
              <div className="text-lg font-black text-google-gray-900 leading-tight">
                {primaryOffer.school}
              </div>
              <div className="text-sm text-google-gray-600 mt-1 font-medium">
                {primaryOffer.major}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                primaryOffer.status === '已录取' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {primaryOffer.status}
              </span>
              <span className="text-[10px] text-google-blue-600 font-bold">
                {student.offers?.length > 1 ? `OTHER +${student.offers.length - 1}` : 'ONLY ONE'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-google-gray-400 text-xs font-medium">暂无录取信息</p>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-6 py-3 bg-white border-t border-google-gray-100 text-center">
        <span className="text-[10px] font-bold text-google-gray-400 uppercase tracking-widest">View Details</span>
      </div>
    </div>
  );
};

export default StudentCard;