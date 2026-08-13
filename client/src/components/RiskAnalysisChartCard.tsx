import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ShieldAlert, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import type { RiskChartsData } from '@shared/schema';
import { motion } from 'framer-motion';

interface RiskAnalysisChartCardProps {
  riskAnalysisText?: string;
  chartsData?: RiskChartsData;
}

export default function RiskAnalysisChartCard({
  riskAnalysisText = "Material pricing calibrated for current copper market spot rates (+20% copper factor). Standard testing & 5% service markup included.",
  chartsData
}: RiskAnalysisChartCardProps) {
  const [activeTab, setActiveTab] = useState('commodity');

  const defaultCommodityTrend = [
    { month: 'Jan', copperPrice: 8400, aluminiumPrice: 2200 },
    { month: 'Feb', copperPrice: 8650, aluminiumPrice: 2250 },
    { month: 'Mar', copperPrice: 8900, aluminiumPrice: 2310 },
    { month: 'Apr', copperPrice: 8750, aluminiumPrice: 2280 },
    { month: 'May', copperPrice: 9150, aluminiumPrice: 2360 },
    { month: 'Jun', copperPrice: 9400, aluminiumPrice: 2420 },
  ];

  const defaultCostDistribution = [
    { category: 'Conductor Raw Metal', value: 55, color: '#3B82F6' },
    { category: 'Polymer Insulation', value: 20, color: '#0EA5E9' },
    { category: 'Armor & Sheath', value: 15, color: '#6366F1' },
    { category: 'Testing & Freight', value: 10, color: '#94A3B8' },
  ];

  const trendData = chartsData?.commodityTrend || defaultCommodityTrend;
  const distributionData = chartsData?.costDistribution || defaultCostDistribution;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <Card className="w-full border border-slate-200 bg-white shadow-md rounded-2xl overflow-hidden" data-testid="card-risk-charts">
        <CardHeader className="p-6 bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            AI Commercial Risk & Market Volatility Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Top 3 Metric Risk Score Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Commodity Risk</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-bold font-mono text-blue-600">High Volatility (LME)</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Lead Time & Logistics</span>
                <Activity className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-sm font-bold font-mono text-sky-600">Low Exposure (Standard)</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Spec Compliance</span>
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-sm font-bold font-mono text-indigo-600">Zero Discrepancy</p>
            </div>
          </div>

          {/* Interactive Charts Tabs */}
          <Tabs defaultValue="commodity" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100 border border-slate-200 p-1.5 rounded-xl shadow-inner">
              <TabsTrigger value="commodity" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg px-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                LME Metal Spot Volatility
              </TabsTrigger>
              <TabsTrigger value="distribution" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg px-4">
                <PieChartIcon className="w-4 h-4 mr-2" />
                Cost Exposure Breakdown
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: AreaChart Commodity Price Volatility */}
            <TabsContent value="commodity" className="pt-5">
              <div className="h-72 w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">6-Month LME Spot Price Curve ($/Ton)</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorCopper" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAluminium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#1E293B', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="copperPrice" name="Copper (₹/t)" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCopper)" strokeWidth={3} />
                    <Area type="monotone" dataKey="aluminiumPrice" name="Aluminium (₹/t)" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorAluminium)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Tab 2: PieChart Cost Distribution */}
            <TabsContent value="distribution" className="pt-5">
              <div className="h-72 w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Cost Risk Component Share (%)</p>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#1E293B', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#475569', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          {/* Risk Mitigation Note */}
          <div className="p-5 bg-blue-50/50 border border-blue-100 border-l-4 border-l-blue-500 rounded-xl space-y-1.5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Strategic Mitigation Recommendation
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {riskAnalysisText}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
