
import React from "react";
import { useScheduleMetrics } from "@/hooks/useScheduleMetrics";
import { ScheduleEvent } from "@/hooks/useScheduleData";
import { useThemeSettings } from "@/context/ThemeSettingsContext";

interface ScheduleMetricsCardsProps {
  scheduleEvents: ScheduleEvent[];
}

export function ScheduleMetricsCards({ scheduleEvents }: ScheduleMetricsCardsProps) {
  const { settings } = useThemeSettings();
  const metrics = useScheduleMetrics(scheduleEvents);

  const metricsData = [
    { label: "Hoje", value: metrics.today, icon: "📅" },
    { label: "Esta Semana", value: metrics.thisWeek, icon: "📊" },
    { label: "Este Mês", value: metrics.thisMonth, icon: "📈" },
    { label: "Confirmados", value: metrics.confirmed, icon: "✅" },
    { label: "Total", value: metrics.total, icon: "🎯" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 px-4">
      {metricsData.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">{metric.icon}</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">{metric.label}</p>
            <p className="text-white text-xl font-bold">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
