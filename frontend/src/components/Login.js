import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://43.139.194.125/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        onLogin(true);
      } else {
        setError(response.data.message || '登录失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '服务器错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200 mb-4">
            K
          </div>
          <h2 className="text-2xl font-black text-gray-900">侨邦教育管理系统</h2>
          <p className="text-gray-500 mt-2 text-sm font-bold">管理员登录</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">用户名</label>
            <input
              type="text"
              placeholder="admin"
              className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">密码</label>
            <input
              type="password"
              placeholder="请输入密码"
              className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username || !password}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
              loading || !username || !password
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#1E293B] text-white hover:bg-black shadow-xl'
            }`}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
