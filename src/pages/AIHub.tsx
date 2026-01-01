import { useState } from 'react';
import { AIChat } from '../components/AIChat';
import { TokenManager } from '../components/TokenManager';
import { Bot, Coins, Sparkles, Zap } from 'lucide-react';

export function AIHub() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tokens' | 'models'>('chat');

  const aiModels = [
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      description: 'Most capable model for complex tasks',
      cost: 1,
      features: ['Advanced reasoning', 'Code generation', 'Creative writing'],
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Sonnet',
      description: 'Balanced performance and efficiency',
      cost: 1,
      features: ['Fast responses', 'Good reasoning', 'Safe outputs'],
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Google\'s multimodal AI model',
      cost: 1,
      features: ['Multimodal', 'Long context', 'Code understanding'],
    },
    {
      id: 'llama-2',
      name: 'Llama 2 70B',
      description: 'Open-source large language model',
      cost: 1,
      features: ['Open source', 'Good performance', 'Cost effective'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Hub</h1>
            <p className="text-purple-100">
              Access powerful AI models and manage your tokens
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} />
              <span className="font-semibold">Multiple Models</span>
            </div>
            <p className="text-sm text-purple-100">
              Choose from various AI models for different tasks
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={20} />
              <span className="font-semibold">Token System</span>
            </div>
            <p className="text-sm text-purple-100">
              Generous token system with unlimited earning
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} />
              <span className="font-semibold">Unlimited Access</span>
            </div>
            <p className="text-sm text-purple-100">
              No restrictions, full feature access
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-slate-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'tokens'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Token Manager
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'models'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Models
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'tokens' && <TokenManager />}
          {activeTab === 'models' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiModels.map(model => (
                <div
                  key={model.id}
                  className="border border-slate-200 rounded-lg p-6 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {model.name}
                      </h3>
                      <p className="text-slate-600 text-sm">{model.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        {model.cost} tokens
                      </div>
                      <div className="text-xs text-slate-500">per request</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {model.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Use Model
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}