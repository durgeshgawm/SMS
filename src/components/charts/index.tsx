"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Theme colors mapped from globals.css HSL values
const COLORS = {
  primary: "#6366f1", // Indigo
  success: "#22c55e", // Green
  info: "#3b82f6",    // Blue
  warning: "#f59e0b", // Amber
  danger: "#ef4444",  // Red
  purple: "#8b5cf6",  // Purple
  cyan: "#06b6d4",    // Cyan
};

export const chartColors = [
  COLORS.primary,
  COLORS.success,
  COLORS.info,
  COLORS.warning,
  COLORS.purple,
  COLORS.cyan,
  COLORS.danger,
];

// --- 1. Chart Container ---
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function ChartContainer({ title, subtitle, action, className, children, ...props }: ChartContainerProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm space-y-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="h-[260px] w-full">{children}</div>
    </div>
  );
}

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-2.5 shadow-md text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-muted-foreground">{item.name}:</span>
              <span className="font-bold text-foreground">
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- 2. Line Chart ---
interface LineChartProps {
  data: any[];
  xAxisKey: string;
  series: { key: string; name: string; color?: string }[];
}

export function LineChart({ data, xAxisKey, series }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
        {series.map((s, idx) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color || chartColors[idx % chartColors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// --- 3. Bar Chart ---
interface BarChartProps {
  data: any[];
  xAxisKey: string;
  series: { key: string; name: string; color?: string }[];
}

export function BarChart({ data, xAxisKey, series }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
        {series.map((s, idx) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color || chartColors[idx % chartColors.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// --- 4. Area Chart ---
interface AreaChartProps {
  data: any[];
  xAxisKey: string;
  series: { key: string; name: string; color?: string }[];
}

export function AreaChart({ data, xAxisKey, series }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          {series.map((s, idx) => {
            const color = s.color || chartColors[idx % chartColors.length];
            return (
              <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
        {series.map((s, idx) => {
          const color = s.color || chartColors[idx % chartColors.length];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${s.key})`}
            />
          );
        })}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

// --- 5. Donut Chart ---
interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  innerRadius?: number;
  outerRadius?: number;
}

export function DonutChart({ data, innerRadius = 55, outerRadius = 80 }: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex h-full w-full items-center justify-center gap-6">
      <div className="h-full w-1/2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                "Count",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        {/* Centered Total */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-foreground">{total.toLocaleString()}</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Total</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-1/2 flex flex-col justify-center space-y-2 text-xs">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color || chartColors[idx % chartColors.length] }}
              />
              <span className="text-muted-foreground truncate max-w-[100px]">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">
              {item.value} ({((item.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. Stacked Bar Chart ---
interface StackedBarChartProps {
  data: any[];
  xAxisKey: string;
  series: { key: string; name: string; color?: string }[];
}

export function StackedBarChart({ data, xAxisKey, series }: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
        {series.map((s, idx) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId="a"
            fill={s.color || chartColors[idx % chartColors.length]}
            maxBarSize={40}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// --- 7. Horizontal Bar Chart ---
interface HorizontalBarChartProps {
  data: any[];
  yAxisKey: string;
  barKey: string;
  barName: string;
  color?: string;
}

export function HorizontalBarChart({ data, yAxisKey, barKey, barName, color = COLORS.primary }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart layout="vertical" data={data} margin={{ top: 5, right: 15, left: -5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.4)" />
        <XAxis
          type="number"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey={yAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={barKey}
          name={barName}
          fill={color}
          radius={[0, 4, 4, 0]}
          maxBarSize={20}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// --- 8. Trend Sparkline ---
interface TrendSparklineProps {
  data: number[];
  color?: string;
}

export function TrendSparkline({ data, color = COLORS.primary }: TrendSparklineProps) {
  const chartData = data.map((v, i) => ({ index: i, value: v }));

  return (
    <div className="h-6 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
