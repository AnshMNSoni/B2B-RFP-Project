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
    { category: 'Conductor Raw Metal', value: 55, color: '#6366F1' },
    { category: 'Polymer Insulation', value: 20, color: '#38BDF8' },
    { category: 'Armor & Sheath', value: 15, color: '#818CF8' },
    { category: 'Testing & Freight', value: 10, color: '#94A3B8' },
  ];

  const trendData = chartsData?.commodityTrend || defaultCommodityTrend;
  const distributionData = chartsData?.costDistribution || defaultCostDistribution;

  return (
    <Card className="w-full border border-[#2E3B52] bg-[#1C2638] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in duration-300" data-testid="card-risk-charts">
      <CardHeader className="p-6 bg-[#151D2A] border-b border-[#2E3B52]/60">
        <CardTitle className="text-base font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/40 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Activity className="w-4 h-4 text-[#6366F1]" />
          </div>
          AI Commercial Risk & Market Volatility Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Top 3 Metric Risk Score Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#151D2A] border border-[#2E3B52]/60 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Commodity Risk</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#6366F1]" />
            </div>
            <p className="text-sm font-bold font-mono text-[#6366F1]">High Volatility (LME)</p>
          </div>

          <div className="p-3 bg-[#151D2A] border border-[#2E3B52]/60 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Lead Time & Logistics</span>
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <p className="text-sm font-bold font-mono text-[#38BDF8]">Low Exposure (Standard)</p>
          </div>

          <div className="p-3 bg-[#151D2A] border border-[#2E3B52]/60 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Spec Compliance</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#818CF8]" />
            </div>
            <p className="text-sm font-bold font-mono text-[#818CF8]">Zero Discrepancy</p>
          </div>
        </div>

        {/* Interactive Charts Tabs */}
        <Tabs defaultValue="commodity" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#151D2A] border border-[#2E3B52]/60 p-1 rounded-xl">
            <TabsTrigger value="commodity" className="text-xs font-mono data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              LME Metal Spot Volatility
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs font-mono data-[state=active]:bg-[#6366F1] data-[state=active]:text-white">
              <PieChartIcon className="w-3.5 h-3.5 mr-1.5" />
              Cost Exposure Breakdown
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: AreaChart Commodity Price Volatility */}
          <TabsContent value="commodity" className="pt-4">
            <div className="h-64 w-full bg-[#151D2A]/60 border border-[#2E3B52]/60 rounded-xl p-4">
              <p className="text-xs font-mono text-[#94A3B8] mb-2">6-Month LME Spot Price Curve ($/Ton)</p>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCopper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAluminium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E3B52" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C2638', borderColor: '#2E3B52', borderRadius: '8px', fontSize: '12px', color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="copperPrice" name="Copper (₹/t)" stroke="#6366F1" fillOpacity={1} fill="url(#colorCopper)" strokeWidth={2} />
                  <Area type="monotone" dataKey="aluminiumPrice" name="Aluminium (₹/t)" stroke="#38BDF8" fillOpacity={1} fill="url(#colorAluminium)" strokeWidth={2} />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Tab 2: PieChart Cost Distribution */}
          <TabsContent value="distribution" className="pt-4">
            <div className="h-64 w-full bg-[#151D2A]/60 border border-[#2E3B52]/60 rounded-xl p-4">
              <p className="text-xs font-mono text-[#94A3B8] mb-2">Cost Risk Component Share (%)</p>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C2638', borderColor: '#2E3B52', borderRadius: '8px', fontSize: '12px', color: '#F8FAFC' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#94A3B8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Risk Mitigation Note */}
        <div className="p-4 bg-[#151D2A] border border-[#2E3B52]/60 border-l-4 border-l-[#6366F1] rounded-xl space-y-1">
          <h4 className="text-xs font-bold text-[#F8FAFC] tracking-tight">
            Strategic Mitigation Recommendation
          </h4>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
            {riskAnalysisText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
