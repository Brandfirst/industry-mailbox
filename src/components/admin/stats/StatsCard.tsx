
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  change?: number;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  change,
  trend = "neutral",
  isLoading = false
}: StatsCardProps) => {
  const trendColor = trend === "up" 
    ? "text-green-500" 
    : trend === "down" 
      ? "text-red-500" 
      : "text-gray-500";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-card-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 bg-muted animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold text-card-foreground">{value}</div>
            <CardDescription className="flex items-center mt-1 text-xs">
              {description}
              {change !== undefined && (
                <span className={`ml-2 flex items-center ${trendColor}`}>
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {change}%
                </span>
              )}
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
