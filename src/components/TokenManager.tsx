import { useState, useEffect } from 'react';
import { Coins, Plus, Minus, RefreshCw } from 'lucide-react';

type TokenTransaction = {
  id: string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus';
  description: string;
  timestamp: Date;
};

export function TokenManager() {
  const [tokens, setTokens] = useState(1000);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([
    {
      id: '1',
      amount: 1000,
      type: 'bonus',
      description: 'Welcome bonus',
      timestamp: new Date(),
    },
  ]);

  const addTokens = (amount: number, description: string) => {
    const transaction: TokenTransaction = {
      id: Date.now().toString(),
      amount,
      type: 'earned',
      description,
      timestamp: new Date(),
    };
    setTokens(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev]);
  };

  const spendTokens = (amount: number, description: string) => {
    if (tokens >= amount) {
      const transaction: TokenTransaction = {
        id: Date.now().toString(),
        amount: -amount,
        type: 'spent',
        description,
        timestamp: new Date(),
      };
      setTokens(prev => prev - amount);
      setTransactions(prev => [transaction, ...prev]);
      return true;
    }
    return false;
  };

  const dailyBonus = () => {
    const bonusAmount = Math.floor(Math.random() * 100) + 50;
    addTokens(bonusAmount, 'Daily bonus');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
            <Coins size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Token Balance</h3>
            <p className="text-sm text-slate-600">Manage your platform tokens</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-900">{tokens.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Available Tokens</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={dailyBonus}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Plus size={20} />
          <div className="text-left">
            <div className="font-medium">Daily Bonus</div>
            <div className="text-sm opacity-90">Claim free tokens</div>
          </div>
        </button>

        <button
          onClick={() => addTokens(500, 'Activity reward')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
        >
          <RefreshCw size={20} />
          <div className="text-left">
            <div className="font-medium">Activity Reward</div>
            <div className="text-sm opacity-90">+500 tokens</div>
          </div>
        </button>

        <button
          onClick={() => spendTokens(100, 'Premium feature')}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Minus size={20} />
          <div className="text-left">
            <div className="font-medium">Use Tokens</div>
            <div className="text-sm opacity-90">Premium features</div>
          </div>
        </button>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-slate-900 mb-3">Recent Transactions</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.amount > 0
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.amount > 0 ? <Plus size={16} /> : <Minus size={16} />}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{transaction.description}</div>
                  <div className="text-xs text-slate-500">
                    {transaction.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className={`font-bold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}