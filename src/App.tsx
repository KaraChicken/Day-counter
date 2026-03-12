/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, RefreshCw, Info, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  // Initialize endDate to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEndDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const calculateDiff = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset hours to compare dates only
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    setResult(diffDays);
  };

  useEffect(() => {
    calculateDiff();
  }, [startDate, endDate]);

  const reset = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setStartDate(today);
    setEndDate(tomorrowStr);
  };

  const [offsetValue, setOffsetValue] = useState<number>(1);
  const [offsetUnit, setOffsetUnit] = useState<'days' | 'months' | 'years'>('days');

  const applyOffset = (direction: 'past' | 'future') => {
    const baseDate = new Date();
    const val = direction === 'past' ? -offsetValue : offsetValue;
    
    if (offsetUnit === 'days') baseDate.setDate(baseDate.getDate() + val);
    else if (offsetUnit === 'months') baseDate.setMonth(baseDate.getMonth() + val);
    else if (offsetUnit === 'years') baseDate.setFullYear(baseDate.getFullYear() + val);
    
    const dateStr = baseDate.toISOString().split('T')[0];
    setStartDate(dateStr);
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">實用工具</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            日期計算器
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-500 max-w-md"
          >
            精確計算兩個日期之間的天數，簡單又快速。
          </motion.p>
        </header>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      開始日期
                    </label>
                    <button 
                      onClick={() => setStartDate(new Date().toISOString().split('T')[0])}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-tight"
                    >
                      設為今天
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="flex justify-center md:hidden">
                  <ArrowRight className="text-slate-300 rotate-90" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      結束日期
                    </label>
                    <button 
                      onClick={() => setEndDate(new Date().toISOString().split('T')[0])}
                      className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-tight"
                    >
                      設為今天
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {/* Result Display */}
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={result}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <span className="text-6xl md:text-7xl font-light tracking-tighter text-slate-900">
                      {result !== null ? Math.abs(result) : '--'}
                    </span>
                    <p className="text-slate-400 font-medium mt-2 uppercase tracking-widest text-xs">
                      天
                    </p>
                    <p className="text-slate-500 text-sm mt-4">
                      {result !== null && result > 0 ? '相隔' : result !== null && result < 0 ? '已過' : '同一天'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Custom Offset Tool */}
            <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <h3 className="text-xs font-bold text-indigo-900 uppercase mb-4 tracking-widest flex items-center gap-2">
                <RefreshCw size={14} />
                快速設置開始日期 (相對於今天)
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <input 
                  type="number" 
                  value={offsetValue}
                  onChange={(e) => setOffsetValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                />
                <select 
                  value={offsetUnit}
                  onChange={(e) => setOffsetUnit(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-indigo-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="days">日</option>
                  <option value="months">月</option>
                  <option value="years">年</option>
                </select>
                <div className="flex gap-2 ml-auto">
                  <button 
                    onClick={() => applyOffset('past')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    設為過去
                  </button>
                  <button 
                    onClick={() => applyOffset('future')}
                    className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
                  >
                    設為未來
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-indigo-400 font-medium">
                * 點擊按鈕將「開始日期」設為今天的偏移值，並將「結束日期」設為今天。
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4 justify-between items-center">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                重置計算器
              </button>
              
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  <Info size={12} />
                  包含結束日期
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-4 rounded-2xl bg-white/50 border border-slate-200/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase mb-2 flex items-center gap-2">
              <History size={14} className="text-indigo-500" />
              使用技巧
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              您可以自由選擇任何兩個日期來計算它們之間的時間跨度。
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/50 border border-slate-200/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase mb-2 flex items-center gap-2">
              <Calendar size={14} className="text-indigo-500" />
              精確度
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              計算基於 24 小時制，不考慮具體的小時或分鐘差異。
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/50 border border-slate-200/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase mb-2 flex items-center gap-2">
              <ArrowRight size={14} className="text-indigo-500" />
              方向性
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              結果會顯示結束日期是處於開始日期的未來（剩餘）還是過去（已過）。
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

