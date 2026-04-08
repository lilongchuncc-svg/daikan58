import { X } from 'lucide-react';
import { useState } from 'react';

interface AdSlotProps {
  side: 'left' | 'right';
}

export default function AdSidebar({ side }: AdSlotProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      className={`fixed top-24 ${side === 'left' ? 'left-2' : 'right-2'} z-40 w-44 hidden xl:block`}
      style={{ maxHeight: 'calc(100vh - 140px)' }}
    >
      {/* Ad Card */}
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-between">
          <span>广告</span>
          <button
            onClick={() => setClosed(true)}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
            aria-label="关闭广告"
          >
            <X size={12} />
          </button>
        </div>

        {/* Ad Content - Placeholder */}
        <a
          href="#"
          className="block p-2 hover:bg-gray-50 transition-colors"
          title="点击此处投放广告"
        >
          {/* Image area */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg w-full aspect-[4/3] flex items-center justify-center mb-2 overflow-hidden">
            <div className="text-center">
              <div className="text-3xl mb-1">🏠</div>
              <div className="text-xs text-gray-400">广告位招租</div>
            </div>
          </div>

          {/* Text area */}
          <div className="space-y-1">
            <div className="bg-gray-100 h-3 rounded w-full" />
            <div className="bg-gray-100 h-3 rounded w-3/4" />
            <div className="bg-gray-100 h-3 rounded w-1/2" />
            <div className="mt-2 text-center">
              <span className="text-xs text-orange-500 font-semibold">广告位招商中</span>
            </div>
          </div>
        </a>

        {/* Footer tip */}
        <div className="px-2 pb-2 text-center">
          <p className="text-[10px] text-gray-400">左侧/右侧广告位</p>
          <p className="text-[10px] text-gray-400">180×300</p>
        </div>
      </div>
    </div>
  );
}
