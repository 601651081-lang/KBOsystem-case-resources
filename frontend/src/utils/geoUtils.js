// src/utils/geoUtils.js

const regionRules = [
  { label: '中国香港', keywords: ['香港', 'HKU', 'CUHK', 'HKUST', 'PolyU', 'CityU', 'BU'] },
  { label: '英国', keywords: ['英国', 'London', 'Manchester', 'Edinburgh', 'King\'s College', 'UCL', 'Leeds', 'Southampton', 'Bristol', 'Warwick', 'Glasgow', 'Sheffield'] },
  { label: '美国', keywords: ['美国', 'USA', 'Columbia', 'NYU', 'California', 'Stanford', 'Harvard', 'Pennsylvania', 'Chicago', 'Johns Hopkins'] },
  
  // --- 修改这一行，加入悉尼、昆士兰、西澳等关键词 ---
  { 
    label: '澳大利亚', 
    keywords: [
      '澳大利亚', 'Australia', 'Melbourne', 'Sydney', 'UNSW', 'Queensland', 'Monash', 'Adelaide', 
      '悉尼', '昆士兰', '西澳', '墨尔本', '莫纳什', '阿德莱德' // 加入中文名
    ] 
  },
  
  { label: '新加坡', keywords: ['新加坡', 'Singapore', 'NUS', 'NTU', 'SMU'] },
  { label: '中国澳门', keywords: ['澳门', 'Macau', 'MUST'] },
  { label: '马来西亚', keywords: ['马来西亚', 'Malaysia', 'Malaya'] },
  { label: '欧洲', keywords: ['荷兰', '德国', '法国', '瑞士', 'Delft', 'Munich', 'ETH', 'Zurich'] },
];

export const getRegionBySchool = (schoolName) => {
  if (!schoolName) return '其他';
  
  const schoolLower = schoolName.toLowerCase();
  
  for (const rule of regionRules) {
    if (rule.keywords.some(key => schoolLower.includes(key.toLowerCase()))) {
      return rule.label;
    }
  }
  
  return '其他';
};

// 新增：专业分类识别规则
export const categoryRules = [
  { label: '商科', keywords: ['Management', 'Business', 'Finance', 'Accounting', 'Marketing', 'MBA', 'Economics', 'Commerce', '管理', '金融', '会计', '市场', '经济', '商科'] },
  { label: '工科', keywords: ['Engineering', 'Computer Science', 'Data', 'IT', 'Software', 'Electronic', 'Mechanical', 'Civil', '工程', '计算机', '电子', '机械', '土木', '自动化'] },
  { label: '理科', keywords: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics', 'Science', '数学', '物理', '化学', '生物', '统计', '理学'] },
  { label: '社科', keywords: ['Social', 'Education', 'Sociology', 'Psychology', 'Law', 'Media', 'Communication', 'Music', 'Arts', '教育', '社会', '心理', '法律', '传媒', '传播', '音乐', '艺术'] },
];

export const getCategoryByMajor = (majorName) => {
  if (!majorName) return '其他';
  const majorLower = majorName.toLowerCase();
  for (const rule of categoryRules) {
    if (rule.keywords.some(key => majorLower.includes(key.toLowerCase()))) {
      return rule.label;
    }
  }
  return '其他';
};

// 985大学名单简表（提取核心关键词）
const list985 = [
  '清华', '北京大学', '中国科学技术大学', '复旦', '中国人民大学', '上海交通大学', '南京大学', '同济', '浙江大学', '南开', 
  '北京航空航天', '北京师范', '武汉大学', '西安交通', '天津大学', '华中科技', '北京理工', '东南大学', '中山大学', '华东师范', 
  '哈尔滨工业', '厦门大学', '西北工业', '中南大学', '大连理工', '四川大学', '电子科技', '华南理工', '吉林大学', '湖南大学', 
  '重庆大学', '山东大学', '中国农业大学', '中国海洋大学', '中央民族大学', '东北大学', '兰州大学', '西北农林科技', '国防科技大学'
];

// 211大学名单简表（剔除已在985中的，剩余的核心211）
const list211 = [
  '上海财经', '中央财经', '对外经济贸易', '北京外国语', '中国政法', '北京邮电', '上海外国语', '西南财经', '中国传媒', '中南财经政法', 
  '南京航空航天', '北京科技', '北京交通', '华东理工', '西安电子', '天津医科', '南京理工', '华中师范', '哈尔滨工程', '华北电力', 
  '北京中医药', '暨南大学', '苏州大学', '武汉理工', '中国药科', '东华大学', '河海大学', '北京林业', '河北工业', '北京工业', 
  '江南大学', '北京化工', '西南交通', '上海大学', '南京师范', '中国地质', '西北大学', '东北师范', '长安大学', '中国矿业', 
  '华中农业', '合肥工业', '广西大学', '中国石油', '陕西师范', '南京农业', '湖南师范', '福州大学', '大连海事', '西南大学', 
  '云南大学', '太原理工', '华南师范', '北京体育', '安徽大学', '东北林业', '东北农业', '辽宁大学', '南昌大学', '延边大学', 
  '内蒙古大学', '四川农业', '海南大学', '贵州大学', '郑州大学', '新疆大学', '宁夏大学', '石河子大学', '青海大学', '中央音乐', 
  '第二军医', '第四军医', '西藏大学'
];

// 海外本科常见关键词
const overseasKeywords = ['University', 'College', 'Institute', 'School of', 'Polytechnic', 'UC', 'UCL', 'NYU'];

/**
 * 识别本科院校类型
 * 逻辑：985 > 211 > 海外 > 普通本科
 */
export const getSchoolType = (schoolName) => {
  if (!schoolName) return '普通本科';
  
  // 1. 检查是否是 985
  if (list985.some(key => schoolName.includes(key))) {
    return '985院校';
  }
  
  // 2. 检查是否是 211
  if (list211.some(key => schoolName.includes(key))) {
    return '211院校';
  }
  
  // 3. 检查是否是海外本科
  const isOverseas = overseasKeywords.some(key => 
    schoolName.toLowerCase().includes(key.toLowerCase())
  ) || /^[A-Za-z\s&]+$/.test(schoolName); // 如果全是英文也视为海外
  
  if (isOverseas) {
    return '海外本科';
  }
  
  // 4. 默认返回
  return '普通本科';
};

// --- 以下是你之前的 getRegionBySchool 和 getCategoryByMajor 函数 ---
// ... 保持不变即可