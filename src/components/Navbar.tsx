import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Home, Building2, Key, User, Phone, ChevronDown, Settings, Heart, Bell } from 'lucide-react';

const navLinks = [
  { label: '二手房', path: '/list?type=二手房', icon: Home },
  { label: '新房', path: '/list?type=新房', icon: Building2 },
  { label: '租房', path: '/list?type=租房', icon: Key },
  { label: '找经纪人', path: '/agents', icon: User },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/list?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${isHome ? 'bg-white/95 backdrop-blur' : 'bg-white'} border-b border-gray-100 shadow-sm`}>
      {/* Top Bar - Trust Badge */}
      <div className="bg-gray-50 border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone size={11} className="text-primary-500" />
                服务热线：18686321666
              </span>
              <span className="text-gray-300">|</span>
              <span>吉林市 · 专注本地房源</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary-600 transition-colors">买房指南</a>
              <a href="#" className="hover:text-primary-600 transition-colors">租房攻略</a>
              <a href="#" className="hover:text-primary-600 transition-colors">关于我们</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <Home size={18} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">安鑫看房</span>
              <span className="text-primary-600 font-bold">吉林</span>
            </div>
          </Link>

          {/* City Selector */}
          <button className="hidden md:flex items-center gap-1 text-gray-700 hover:text-primary-600 shrink-0 font-medium text-sm transition-colors">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            吉林市
            <ChevronDown size={14} />
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname.includes(link.path.split('?')[0])
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar (hidden on home page) */}
          {!isHome && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索小区、地址、楼盘..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 bg-gray-50 focus:bg-white transition-colors"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button type="submit" className="ml-2 px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                搜索
              </button>
            </form>
          )}

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Quick Actions */}
            <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart size={18} />
              <span className="text-xs">收藏</span>
            </button>
            
            {/* Phone CTA */}
            <a 
              href="tel:18686321666" 
              className="hidden lg:flex items-center gap-1.5 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
            >
              <Phone size={14} />
              <span>18686321666</span>
            </a>
            
            {/* Admin Link */}
            <a href="/admin" target="_blank" className="hidden md:flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary-300 transition-colors">
              <Settings size={14} />
              <span>管理</span>
            </a>
            
            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {/* Quick Phone CTA */}
          <div className="px-4 py-3 bg-green-50 border-b border-green-100">
            <a 
              href="tel:18686321666" 
              className="flex items-center justify-center gap-2 text-green-600 font-medium"
            >
              <Phone size={18} />
              立即拨打：18686321666
            </a>
          </div>
          
          {/* Nav Links */}
          <div className="px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 py-3 text-gray-700 hover:text-primary-600 border-b border-gray-50 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="px-4 pb-4 flex gap-2">
            <input
              type="text"
              placeholder="搜索小区或楼盘..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
            <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium">
              搜索
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
