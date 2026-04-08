import { useNavigate } from 'react-router-dom';
import { Heart, Eye, MapPin, Bed, Bath, Square, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import type { Property } from '../data/mockData';

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const typeColor: Record<string, { bg: string; text: string }> = {
    '二手房': { bg: 'bg-blue-500', text: 'text-white' },
    '新房': { bg: 'bg-orange-500', text: 'text-white' },
    '租房': { bg: 'bg-green-500', text: 'text-white' },
  };

  const isRent = property.priceUnit === '元/月';

  return (
    <div
      className="card group overflow-hidden"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Type Badge */}
        <span className={`absolute top-3 left-3 tag ${typeColor[property.type].bg} ${typeColor[property.type].text}`}>
          {property.type}
        </span>
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            liked 
              ? 'bg-red-500/90 text-white' 
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
        
        {/* VR Tag */}
        {property.tags.includes('VR看房') && (
          <span className="absolute bottom-3 right-3 tag bg-black/60 text-white text-xs flex items-center gap-1 backdrop-blur-sm">
            <Eye size={12} />
            VR看房
          </span>
        )}

        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/95 text-primary-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
            查看详情
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[2.5rem]">
          {property.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-2xl font-bold price-red">{property.price}</span>
          <span className="text-sm text-gray-500">{property.priceUnit}</span>
          {!isRent && (
            <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              {(property.unitPrice / 10000).toFixed(1)}万/㎡
            </span>
          )}
        </div>

        {/* Details - 使用图标 */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <Bed size={13} className="text-gray-400" />
            {property.rooms}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <Square size={13} className="text-gray-400" />
            {property.area}㎡
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <ArrowUpRight size={13} className={`${property.floor.includes('高') ? 'text-blue-500' : 'text-amber-500'}`} />
            {property.floor.replace('楼层', '')}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin size={12} className="text-primary-400 shrink-0" />
          <span className="truncate">{property.community}</span>
          <span className="text-gray-300">·</span>
          <span className="shrink-0">{property.district}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {property.tags.filter(t => t !== 'VR看房').slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
