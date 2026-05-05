import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-google-gray-900 bg-opacity-70 p-4">
      <div className="bg-white rounded-google-lg shadow-google-xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-google-red-100 mb-4">
          <svg className="h-6 w-6 text-google-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-google-gray-900 mb-2">确认删除？</h3>
        <p className="text-sm text-google-gray-600 mb-6">
          你确定要删除学员 <span className="font-bold text-google-gray-800">"{studentName}"</span> 吗？此操作不可撤销。
        </p>
        <div className="flex justify-center space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-google-gray-100 text-google-gray-700 rounded-google-md hover:bg-google-gray-200 transition-colors font-medium">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-google-red-500 text-white rounded-google-md hover:bg-google-red-600 transition-colors shadow-google-sm font-medium">确认删除</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;