import { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Plus, Upload, Loader2 } from 'lucide-react';
import { Property } from '../data/mockData';

interface Props {
  initial?: Partial<Property>;
  onSave: (data: Omit<Property, 'id'>) => void;
  onCancel: () => void;
}

const DISTRICTS = ['船营区', '昌邑区', '龙潭区', '丰满区', '高新区', '经开区', '舒兰市', '磐石市', '蛟河市'];
const TYPES: Property['type'][] = ['二手房', '新房', '租房'];
const BUILDING_TYPES: Property['buildingType'][] = ['电梯房', '步梯房'];
const ORIENTATIONS = ['东', '南', '西', '北', '东南', '东北', '西南', '西北', '南北', '东西'];
const DECORATIONS = ['毛坯', '简装', '精装', '豪装'];
const TAG_OPTIONS = ['VR看房', '满五唯一', '江景房', '地铁房', '学区房', '近学校', '近医院', '电梯房', '步梯房', '低总价', '急售'];

export default function PropertyForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Property, 'id'>>({
    title: '',
    price: 0,
    priceUnit: '万',
    type: '二手房',
    area: 0,
    rooms: '',
    floor: '',
    totalFloor: 0,
    buildingType: '电梯房',
    community: '',
    district: '船营区',
    city: '吉林市',
    tags: [],
    images: [],
    yearBuilt: new Date().getFullYear(),
    orientation: '南北',
    decoration: '精装',
    unitPrice: 0,
    desc: '',
  });
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setForm(f => ({ ...f, ...initial }));
    }
  }, []);

  const set = (key: keyof Omit<Property, 'id'>, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
    // Auto-calculate unit price for sale properties
    if (key === 'price' || key === 'area') {
      const price = key === 'price' ? value : form.price;
      const area = key === 'area' ? value : form.area;
      if (price > 0 && area > 0) {
        setForm(f => ({ ...f, unitPrice: Math.round((price * 10000) / area) }));
      }
    }
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (url && url.startsWith('http')) {
      setForm(f => ({ ...f, images: [...f.images, url] }));
      setImageInput('');
    }
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  // 上传图片到COS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} 不是图片文件`);
          continue;
        }
        // 验证文件大小 (最大4MB)
        if (file.size > 4 * 1024 * 1024) {
          alert(`${file.name} 太大，请压缩后上传（最大4MB）`);
          continue;
        }

        // 转换为base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // 移除data URL前缀，只保留base64数据
        const base64Data = base64.split(',')[1];

        // 调用API上传到COS
        const res = await fetch('/api/cos-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            filename: file.name,
          }),
        });

        if (!res.ok) throw new Error('上传失败');

        const data = await res.json();

        if (data.success && data.fileUrl) {
          setForm(f => ({ ...f, images: [...f.images, data.fileUrl] }));
        } else {
          throw new Error(data.error || '上传失败');
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = '请输入标题';
    if (!form.price || form.price <= 0) e.price = '请输入有效价格';
    if (!form.area || form.area <= 0) e.area = '请输入面积';
    if (!form.rooms.trim()) e.rooms = '请输入户型';
    if (!form.community.trim()) e.community = '请输入小区名称';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';
  const errCls = 'text-xs text-red-500 mt-0.5';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {initial?.title ? '编辑房源' : '添加新房源'}
          </h2>
          <button onClick={onCancel} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 基础信息 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              基础信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>房源标题 *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="如：江湾城 精装三居 松花江景" />
                {errors.title && <p className={errCls}>{errors.title}</p>}
              </div>
              <div>
                <label className={labelCls}>类型</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>区域</label>
                <select value={form.district} onChange={e => set('district', e.target.value)} className={inputCls}>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>价格 {form.type === '租房' ? '(元/月)' : '(万)'} *</label>
                <input type="number" value={form.price || ''} onChange={e => set('price', parseFloat(e.target.value) || 0)} className={inputCls} placeholder="0" />
                {errors.price && <p className={errCls}>{errors.price}</p>}
              </div>
              <div>
                <label className={labelCls}>单价 (元/㎡)</label>
                <input type="number" value={form.unitPrice || ''} onChange={e => set('unitPrice', parseFloat(e.target.value) || 0)} className={inputCls} placeholder="自动计算" />
              </div>
              <div>
                <label className={labelCls}>面积 (㎡) *</label>
                <input type="number" value={form.area || ''} onChange={e => set('area', parseFloat(e.target.value) || 0)} className={inputCls} placeholder="0" step="0.1" />
                {errors.area && <p className={errCls}>{errors.area}</p>}
              </div>
              <div>
                <label className={labelCls}>户型 *</label>
                <input value={form.rooms} onChange={e => set('rooms', e.target.value)} className={inputCls} placeholder="如：3室2厅2卫" />
                {errors.rooms && <p className={errCls}>{errors.rooms}</p>}
              </div>
            </div>
          </div>

          {/* 房屋信息 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              房屋信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>楼层</label>
                <input value={form.floor} onChange={e => set('floor', e.target.value)} className={inputCls} placeholder="如：高/中/低 或 5" />
              </div>
              <div>
                <label className={labelCls}>总楼层</label>
                <input type="number" value={form.totalFloor || ''} onChange={e => set('totalFloor', parseInt(e.target.value) || 0)} className={inputCls} placeholder="如：26" />
              </div>
              <div>
                <label className={labelCls}>楼栋类型</label>
                <select value={form.buildingType} onChange={e => set('buildingType', e.target.value)} className={inputCls}>
                  {BUILDING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>建成年份</label>
                <input type="number" value={form.yearBuilt || ''} onChange={e => set('yearBuilt', parseInt(e.target.value) || 0)} className={inputCls} placeholder="如：2020" />
              </div>
              <div>
                <label className={labelCls}>朝向</label>
                <select value={form.orientation} onChange={e => set('orientation', e.target.value)} className={inputCls}>
                  {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>装修</label>
                <select value={form.decoration} onChange={e => set('decoration', e.target.value)} className={inputCls}>
                  {DECORATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>小区名称 *</label>
                <input value={form.community} onChange={e => set('community', e.target.value)} className={inputCls} placeholder="如：江湾城" />
                {errors.community && <p className={errCls}>{errors.community}</p>}
              </div>
            </div>
          </div>

          {/* 图片 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              房源图片
            </h3>
            <div className="flex gap-2 mb-3">
              <input value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} className={inputCls} placeholder="粘贴图片网址（https://...）" />
              <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-1 transition-colors">
                <Plus size={16} /> 添加链接
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? '上传中...' : '上传图片'}
              </button>
            </div>
            {form.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-200">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = 'https://picsum.photos/400/300?grayscale')} />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded">封面</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">暂无图片</p>
              </div>
            )}
          </div>

          {/* 标签 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              房源标签
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {TAG_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => {
                  if (!form.tags.includes(tag)) set('tags', [...form.tags, tag]);
                }} className="px-2.5 py-1 text-xs border border-gray-300 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors">
                  + {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className={inputCls} placeholder="输入自定义标签" />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">添加</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 描述 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              房源描述
            </h3>
            <textarea
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
              rows={4}
              className={inputCls + ' resize-none'}
              placeholder="详细描述房源优势、交通、配套等信息..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
              {initial?.title ? '保存修改' : '添加房源'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
