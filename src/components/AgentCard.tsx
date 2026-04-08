import { Star, Phone, MessageCircle, BadgeCheck, Clock, ThumbsUp, MapPin } from 'lucide-react';
import type { Agent } from '../data/mockData';

interface Props {
  agent: Agent;
}

export default function AgentCard({ agent }: Props) {
  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar with Badge */}
        <div className="relative shrink-0">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-18 h-18 rounded-2xl bg-gray-100 object-cover shadow-sm"
            style={{ width: '72px', height: '72px' }}
          />
          <span className="absolute -bottom-1 -right-1 bg-primary-600 rounded-full p-1 shadow-sm">
            <BadgeCheck size={16} className="text-white" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name and Title */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-gray-800 text-lg">{agent.name}</h3>
            <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 rounded-full font-medium">
              {agent.title}
            </span>
          </div>
          
          {/* Company */}
          <p className="text-xs text-gray-400 mb-2">{agent.company}</p>
          
          {/* District Badge */}
          {'district' in agent && (agent as Agent).district && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full mb-3">
              <MapPin size={11} />
              {(agent as Agent).district}
            </span>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm mb-4">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-800">{agent.rating}</span>
              <span className="text-xs text-gray-400">分</span>
            </div>
            
            {/* Deals */}
            <div className="flex items-center gap-1 text-gray-500">
              <ThumbsUp size={13} className="text-green-500" />
              <span>成交 <strong className="text-gray-700">{agent.dealCount}</strong> 套</span>
            </div>
            
            {/* Response */}
            <div className="flex items-center gap-1 text-gray-500">
              <Clock size={13} className="text-blue-500" />
              <span>快速响应</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={`tel:${agent.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm rounded-xl font-medium hover:from-primary-700 hover:to-primary-600 transition-all shadow-sm"
            >
              <Phone size={15} />
              电话咨询
            </a>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-primary-600 text-primary-600 text-sm rounded-xl font-medium hover:bg-primary-50 transition-colors">
              <MessageCircle size={15} />
              在线聊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
