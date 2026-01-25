import React, { useState } from 'react';

type QuoteResponse = {
  pNow: string;      // Current probability in wad format (1e18)
  pAfter: string;    // After probability in wad format (1e18)
  expectedCost: string; // Expected cost in wei (1e18)
  maxCost: string;    // Max cost in wei (1e18)
  marketId: `0x${string}`;
  trader: `0x${string}`;
  targetPct: number;
  timestamp: number;
};

type MoveProbPanelProps = {
  marketId: `0x${string}`;
  trader: `0x${string}`;
  targetPct?: number;
  onTargetPctChange?: (pct: number) => void;
  onQuoteChange?: (quote: QuoteResponse) => void;
  onSubmitQuote?: (quote: QuoteResponse) => void;
  defaultTargetPct?: number;
};

export default function MoveProbPanel({
  marketId,
  trader,
  targetPct: externalTargetPct,
  onTargetPctChange,
  onQuoteChange,
  onSubmitQuote,
  defaultTargetPct = 50,
}: MoveProbPanelProps) {
  // Internal state for target percentage
  const [internalTargetPct, setInternalTargetPct] = useState<number>(defaultTargetPct);
  
  // Use external targetPct if provided (controlled mode)
  const isControlled = externalTargetPct !== undefined;
  const currentTargetPct = isControlled ? externalTargetPct : internalTargetPct;
  
  // Current probability (mock value for now)
  const currentProb = 63;
  
  // Calculate direction
  const direction = currentTargetPct > currentProb ? 'up' : 'down';
  const directionText = direction === 'up' ? '↑ Push Up (buy YES)' : '↓ Push Down (sell YES)';
  
  // Mock quote data for now
  const [quote, setQuote] = useState<QuoteResponse | null>({
    pNow: String(Math.round(currentProb * 1e16)), // 63% in wad format
    pAfter: String(Math.round((currentTargetPct / 100) * 1e18)),
    expectedCost: String(Math.round(Math.abs(currentTargetPct - currentProb) * 20 * 1e18)), // Mock cost: $20 per 1% change
    maxCost: String(Math.round(Math.abs(currentTargetPct - currentProb) * 24 * 1e18)), // 20% more than expected
    marketId,
    trader,
    targetPct: currentTargetPct,
    timestamp: Date.now(),
  });
  
  // Update target percentage and quote
  const handleTargetPctChange = (pct: number) => {
    if (!isControlled) {
      setInternalTargetPct(pct);
    }
    if (onTargetPctChange) {
      onTargetPctChange(pct);
    }
    
    // Update mock quote
    const newQuote: QuoteResponse = {
      pNow: String(Math.round(currentProb * 1e16)),
      pAfter: String(Math.round((pct / 100) * 1e18)),
      expectedCost: String(Math.round(Math.abs(pct - currentProb) * 20 * 1e18)),
      maxCost: String(Math.round(Math.abs(pct - currentProb) * 24 * 1e18)),
      marketId,
      trader,
      targetPct: pct,
      timestamp: Date.now(),
    };
    setQuote(newQuote);
    if (onQuoteChange) {
      onQuoteChange(newQuote);
    }
  };
  
  // Handle submit button click - show confirmation modal
  const handleSubmit = () => {
    if (quote) {
      // Calculate direction text for modal
      const dirText = currentTargetPct > currentProb ? 'buy' : 'sell';
      const confirmText = `Current → Target: ${currentProb}% → ${currentTargetPct}%\n` +
                         `Direction: ${dirText.toUpperCase()}\n` +
                         `Expected: $${(Number(quote.expectedCost) / 1e18).toFixed(2)}\n` +
                         `Protected: $${(Number(quote.maxCost) / 1e18).toFixed(2)}\n` +
                         `Deadline: 60s`;
      
      if (window.confirm(confirmText)) {
        if (onSubmitQuote) {
          onSubmitQuote(quote);
        }
      }
    }
  };
  
  return (
    <div className='p-4'>
      <div className='p-4 border-b border-gray-100 bg-white'>
        <div className='text-sm font-bold text-stripe-900'>Move Probability</div>
        <div className='text-xs text-stripe-400 mt-0.5'>Adjust the probability slider</div>
      </div>
      
      <div className='p-4 space-y-4'>
        <div>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-stripe-500'>Target Probability</span>
            <span className='text-lg font-bold text-stripe-900'>{currentTargetPct}%</span>
          </div>
          
          {/* Direction indicator */}
          <div className='mb-2 text-sm font-medium text-stripe-600'>
            {directionText}
          </div>
          
          <input
            type='range'
            min='1'
            max='99'
            value={currentTargetPct}
            onChange={(e) => handleTargetPctChange(Number(e.target.value))}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500'
          />
          <div className='flex justify-between text-xs text-stripe-400 mt-1'>
            <span>1%</span>
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>
        
        {quote && (
          <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-stripe-500'>Expected Cost</span>
              <span className='font-mono text-lg font-bold text-stripe-900'>
                ${(Number(quote.expectedCost) / 1e18).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-stripe-500'>Max Cost</span>
              <span className='font-mono text-lg font-bold text-stripe-900'>
                ${(Number(quote.maxCost) / 1e18).toFixed(2)}
              </span>
            </div>
          </div>
        )}
        
        <button
          type='button'
          onClick={handleSubmit}
          className='w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] bg-green-500 hover:bg-green-600 shadow-green-500/20'
        >
          Confirm Move
        </button>
      </div>
    </div>
  );
}