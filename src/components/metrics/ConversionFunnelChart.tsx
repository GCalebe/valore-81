
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
}

interface ConversionFunnelChartProps {
  data: FunnelData[];
  loading?: boolean;
}

const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ data, loading = false }) => {
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899'  // pink-500
  ];

  return (
    <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          Funil de Conversão de Leads
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-80 flex flex-col justify-center space-y-2">
            {data.map((item, index) => (
              <div key={item.stage} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.stage}
                </div>
                <div className="flex-1 relative">
                  <div 
                    className="h-8 rounded-lg flex items-center justify-between px-3 text-white font-medium"
                    style={{ 
                      backgroundColor: colors[index % colors.length],
                      width: `${item.percentage}%`,
                      minWidth: '60px'
                    }}
                  >
                    <span className="text-sm">{item.value}</span>
                    <span className="text-xs">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversionFunnelChart;
