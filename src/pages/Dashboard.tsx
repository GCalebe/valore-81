import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useDashboardRealtime } from "@/hooks/useDashboardRealtime";
import { useScheduleData } from "@/hooks/useScheduleData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsCard from "@/components/dashboard/MetricsCard";
import ChatsCard from "@/components/dashboard/ChatsCard";
import KnowledgeCard from "@/components/dashboard/KnowledgeCard";
import ClientsCard from "@/components/dashboard/ClientsCard";
import EvolutionCard from "@/components/dashboard/EvolutionCard";
import ScheduleCard from "@/components/dashboard/ScheduleCard";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { refetchScheduleData } = useScheduleData();

  // Initialize real-time updates for the dashboard
  useDashboardRealtime({ refetchScheduleData });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Painel Administrativo Valore
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <MetricsCard />
          <ChatsCard />
          <KnowledgeCard />
          <ClientsCard />
          <EvolutionCard />
          <ScheduleCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
