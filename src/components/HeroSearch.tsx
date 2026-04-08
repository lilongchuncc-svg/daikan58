import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Building, Home, Car } from 'lucide-react';

// 吉林市热门区域
const hotDistricts = ['船营区', '昌邑区', '龙潭区', '丰满区', '高新区', '经开区', '舒兰市', '磐石市'];

const propertyTypes = [
  { label: '二手房', value: '二手房', icon: Home, count: '2.3万+' },
  { label: '新房', value: '新房', icon: Building, count: '500+' },
  { label: '租房', value: '租房', icon: Car, count: '1.2万+' },
];

export default function HeroSearch() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('二手房');
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = () => {
    const query = new URLSearchParams({ type: activeType });
    if (searchVal.trim()) query.set('q', searchVal.trim());
    navigate(`/list?${query.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const activeTypeInfo = propertyTypes.find(t => t.value === activeType) || propertyTypes[0];
  const ActiveIcon = activeTypeInfo.icon;

  return (
    <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
          alt="吉林市城市背景"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-700/60" />
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDE0di0yaDIyek0zNiAyNnYySDR2LTJoMzJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center pt-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          吉林市真实房源平台 · 覆盖六区一市
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          找到你在吉林市的
          <span className="text-yellow-300">理想家</span>
        </h1>
        <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          覆盖船营 · 昌邑 · 龙潭 · 丰满 · 高新 · 经开 全区域
        </p>

        {/* Type Tabs with Icons */}
        <div className="flex justify-center mb-0">
          {propertyTypes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => setActiveType(t.value)}
                className={`group flex items-center gap-2 px-6 py-3.5 text-base font-semibold rounded-t-2xl transition-all ${
                  activeType === t.value
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                }`}
              >
                <Icon size={18} className={activeType === t.value ? 'text-primary-600' : 'text-white/80'} />
                <span>{t.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeType === t.value 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-white/20 text-white/80'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl p-5">
          <div className="flex items-center gap-4">
            {/* City Selector */}
            <div className="hidden md:flex items-center gap-2 text-gray-500 border-r-2 border-gray-100 pr-4 shrink-0">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700">吉林市</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`搜索 ${activeType} 小区、楼盘、街道...`}
                className="w-full text-base outline-none py-3 px-4 text-gray-700 placeholder-gray-400 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-primary-300 focus:bg-white transition-all"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 shrink-0"
            >
              <Search size={20} />
              <span>搜索</span>
            </button>
          </div>

          {/* Hot Districts */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 shrink-0 font-medium">热门区域：</span>
            {hotDistricts.map((d) => (
              <button
                key={d}
                onClick={() => navigate(`/list?type=${activeType}&district=${d}`)}
                className="text-xs text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary-300 transition-all font-medium"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 md:gap-16 mt-10">
          {[
            { label: '真实房源', value: '5000+', desc: '覆盖全市' },
            { label: '专业经纪人', value: '200+', desc: '持证上岗' },
            { label: '覆盖区域', value: '10+', desc: '六区一市' },
            { label: '服务好评', value: '98%', desc: '用户满意' },
          ].map((s) => (
            <div key={s.label} className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-primary-200 text-sm">{s.label}</div>
              <div className="text-primary-300/60 text-xs mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
