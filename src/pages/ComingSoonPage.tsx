import React from 'react';
import { TrendingUp } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
          <TrendingUp className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">敬请期待</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          该功能正在开发中，敬请期待。我们将很快为您带来更多精彩内容！
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="/accelerator" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors duration-200"
          >
            返回众筹
          </a>
          <a 
            href="/liqpass" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            前往保险购买
          </a>
        </div>
      </div>
      <div className="mt-16 text-sm text-gray-500">
        © 2024 LiqPass. AI量化时代 · 交易风险OS
      </div>
    </div>
  );
};

export default ComingSoonPage;
