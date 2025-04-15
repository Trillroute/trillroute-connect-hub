
import React from "react";
import {
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export interface ChartProps {
  data: Record<string, any>[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  layout?: "vertical" | "horizontal";
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  const chartConfig = categories.reduce(
    (acc, category, i) => {
      acc[category] = {
        label: category,
        color: `hsl(var(--${colors[i % colors.length]}))`,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--foreground))" }}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          content={({ active, payload, label }: TooltipProps<any, any>) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={valueFormatter}
            />
          )}
        />
        <Legend />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={`var(--color-${category})`}
            fill={`var(--color-${category})`}
            fillOpacity={0.2}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => `${value}`,
  layout = "horizontal",
  className,
}: ChartProps) {
  const chartConfig = categories.reduce(
    (acc, category, i) => {
      acc[category] = {
        label: category,
        color: `hsl(var(--${colors[i % colors.length]}))`,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsBarChart
        data={data}
        layout={layout}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {layout === "horizontal" ? (
          <>
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--foreground))" }}
              tickFormatter={valueFormatter}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--foreground))" }}
              tickFormatter={valueFormatter}
            />
            <YAxis
              type="category"
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
          </>
        )}
        <Tooltip
          content={({ active, payload, label }: TooltipProps<any, any>) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={valueFormatter}
            />
          )}
        />
        <Legend />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`var(--color-${category})`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  const chartConfig = categories.reduce(
    (acc, category, i) => {
      acc[category] = {
        label: category,
        color: `hsl(var(--${colors[i % colors.length]}))`,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <ChartContainer config={chartConfig} className={className}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--foreground))" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--foreground))" }}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          content={({ active, payload, label }: TooltipProps<any, any>) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={valueFormatter}
            />
          )}
        />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={`var(--color-${category})`}
            strokeWidth={2}
            dot={{ fill: `var(--color-${category})` }}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}
