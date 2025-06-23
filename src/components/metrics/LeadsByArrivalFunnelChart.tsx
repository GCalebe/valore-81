import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface LeadsByArrivalFunnelChartProps {
  data: FunnelStage[];
  loading?: boolean;
}

const LeadsByArrivalFunnelChart: React.FC<LeadsByArrivalFunnelChartProps> = ({ data, loading = false }) => {
  return (
    <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Funil por Data de Chegada
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-80 flex flex-col justify-center space-y-4">
            {data.map((stage, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {stage.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-lg transition-all duration-500 ease-in-out"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color,
                    }}
                  ></div>
                </div>
                {index < data.length - 1 && (
                  <div className="flex justify-center my-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 dark:text-gray-600"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsByArrivalFunnelChart;