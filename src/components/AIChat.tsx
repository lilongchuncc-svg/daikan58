import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Home, Building2, Key, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 快速问题快捷入口
const QUICK_QUESTIONS = [
  { label: '二手房有哪些？', icon: Home, query: '二手房有哪些？推荐几个优质的' },
  { label: '新房楼盘', icon: Building2, query: '新房楼盘有哪些？' },
  { label: '租房推荐', icon: Key, query: '租房有什么推荐？' },
  { label: '各区房价', icon: Sparkles, query: '吉林市各区最新房价是多少？' },
];

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '您好！我是安安，**安鑫看房吉林**的AI助手 😊\n\n我可以帮您：\n• 查询各区二手房/新房/租房\n• 了解吉林市最新房价行情\n• 推荐适合您的房源\n• 解答买房租房疑问\n\n请问有什么可以帮到您？',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // 发送消息
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '请求失败');
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误，请稍后重试');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '抱歉，AI客服暂时离线了 😅 请稍后再试，或直接拨打客服电话 18686321666',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 快捷问题点击
  const handleQuickQuestion = (q: string) => {
    sendMessage(q);
  };

  // 快捷按钮点击跳转到对应页面
  const handleQuickLink = (type: string, district?: string) => {
    if (district) {
      navigate(`/list?type=${type}&district=${district}`);
    } else {
      navigate(`/list?type=${type}`);
    }
    setIsOpen(false);
  };

  // 渲染消息内容（支持简单的markdown-like格式）
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // 处理粗体 **文字**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-1.5 last:mb-0">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j} className="font-semibold text-primary-700">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-600 text-white rotate-0'
            : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-xl hover:scale-110'
        }`}
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        title={isOpen ? '关闭客服' : 'AI智能客服'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        {/* 未读气泡 */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: '580px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <div className="text-white font-semibold text-base">安安 AI 客服</div>
                <div className="text-primary-100 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block" />
                  在线 · 随时为您服务
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {/* 加载中 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-2">
                  <Loader2 size={16} className="text-primary-600 animate-spin" />
                  <span className="text-sm text-gray-500">安安正在思考...</span>
                </div>
              </div>
            )}

            {/* 快捷问题（第一条消息后显示） */}
            {messages.length === 1 && !isLoading && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2 text-center">试试这样问我：</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleQuickQuestion(q.query)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                    >
                      <q.icon size={12} />
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 底部导航 */}
            {messages.length >= 2 && !isLoading && (
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2 text-center">快速找房</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '🏠 二手房', type: '二手房' },
                    { label: '🏢 新房', type: '新房' },
                    { label: '🔑 租房', type: '租房' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleQuickLink(item.type)}
                      className="px-2 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all text-center"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="输入您的问题..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
