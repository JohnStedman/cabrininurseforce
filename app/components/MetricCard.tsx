import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card } from "./ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, change, trend, icon }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-[#1565C0] bg-[#E3F2FD]';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate">{value}</p>
          {change && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs sm:text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}