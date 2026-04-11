import { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Building2, Plus, Edit2, Trash2, Search, LogOut, Eye, Home } from 'lucide-react';
import { Property, properties as seedData } from '../data/mockData';
import PropertyForm from '../components/PropertyForm';

const ADMIN_PASSWORD = 'admin888'; // 后台管理密码

const STORAGE_KEY = 'daikan_admin_properties';

function loadProperties(): Property[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  // 首次使用，用种子数据初始化
  return seedData;
}

function saveProperties(props: Property[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
  // 触发同步：写入一个时间戳 key，storage 事件会通知其他标签页
  localStorage.setItem('daikan_sync_version', Date.now().toString());
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterDistrict, setFilterDistrict] = useState('全部');

  useEffect(() => {
    if (loggedIn) {
      setProperties(loadProperties());
    }
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('密码错误，请重试');
      setPassword('');
    }
  };

  const handleSave = (data: Omit<Property, 'id'>) => {
    if (editing) {
      const updated = properties.map(p => p.id === editing.id ? { ...data, id: editing.id } : p);
      setProperties(updated);
      saveProperties(updated);
      setEditing(null);
    } else {
      const newId = Math.max(0, ...properties.map(p => p.id)) + 1;
      const newProp = { ...data, id: newId };
      const updated = [newProp, ...properties];
      setProperties(updated);
      saveProperties(updated);
    }
    // 触发同步事件，通知前台页面更新
    window.dispatchEvent(new CustomEvent('daikan_data_updated'));
    setShowForm(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = properties.filter(p => p.id !== deleteTarget.id);
    setProperties(updated);
    saveProperties(updated);
    // 触发同步事件，通知前台页面更新
    window.dispatchEvent(new CustomEvent('daikan_data_updated'));
    setDeleteTarget(null);
  };

  const handleEdit = (p: Property) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title.includes(search) || p.community.includes(search);
    const matchType = filterType === '全部' || p.type === filterType;
    const matchDistrict = filterDistrict === '全部' || p.district === filterDistrict;
    return matchSearch && matchType && matchDistrict;
  });

  const stats = {
    total: properties.length,
    sale: properties.filter(p => p.type === '二手房' || p.type === '新房').length,
    rent: properties.filter(p => p.type === '租房').length,
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-primary-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-primary-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">安鑫房产管理后台</h1>
            <p className="text-sm text-gray-400 mt-1">请输入管理员密码登录</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入密码..."
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-1.5">{loginError}</p>}
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-primary-700 transition-colors">
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800">安鑫房产管理后台</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
              <Home size={15} /> 访问网站
            </a>
            <button onClick={() => { setLoggedIn(false); setPassword(''); }} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
              <LogOut size={15} /> 退出登录
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-400">全部房源</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.sale}</div>
                <div className="text-xs text-gray-400">出售/新房</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.rent}</div>
                <div className="text-xs text-gray-400">租房</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3">
            <button onClick={handleAdd} className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <Plus size={16} /> 添加房源
            </button>
            <div className="flex-1 min-w-[200px]" />
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="搜索标题或小区..."
              />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              <option>全部</option><option>二手房</option><option>新房</option><option>租房</option>
            </select>
            <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              <option>全部</option>
              {['船营区', '昌邑区', '龙潭区', '丰满区', '高新区', '经开区', '舒兰市', '磐石市', '蛟河市'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">房源信息</th>
                  <th className="text-left px-3 py-3 font-medium">类型/区域</th>
                  <th className="text-left px-3 py-3 font-medium">户型/面积</th>
                  <th className="text-right px-3 py-3 font-medium">价格</th>
                  <th className="text-center px-3 py-3 font-medium">标签</th>
                  <th className="text-center px-3 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <Building2 size={40} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无房源，点击上方「添加房源」开始</p>
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-12 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" onError={e => (e.currentTarget.src = 'https://picsum.photos/100/80?grayscale')} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{p.title}</div>
                          <div className="text-xs text-gray-400">{p.community}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === '二手房' ? 'bg-blue-50 text-blue-600' : p.type === '新房' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                        {p.type}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{p.district}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-700">{p.rooms}</div>
                      <div className="text-xs text-gray-400">{p.area}㎡</div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-sm font-bold text-primary-600">{p.price} {p.priceUnit}</div>
                      <div className="text-xs text-gray-400">{p.unitPrice}元/㎡</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {p.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                        {p.tags.length > 2 && <span className="text-[10px] text-gray-400">+{p.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <a href={`/property/${p.id}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-600 transition-colors" title="预览">
                          <Eye size={15} />
                        </a>
                        <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="编辑">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="删除">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t bg-gray-50 text-xs text-gray-400 flex items-center justify-between">
            <span>共 {filtered.length} 套房源（筛选自 {properties.length} 套）</span>
            <span>数据保存在浏览器本地</span>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PropertyForm
          initial={editing || undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">确认删除</h3>
              <p className="text-sm text-gray-500 mt-1">
                确定要删除「<span className="font-medium">{deleteTarget.title}</span>」吗？<br />此操作不可撤销。
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
