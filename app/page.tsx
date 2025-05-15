"use client"

import TaskDashboard from "@/components/task-dashboard";
import NotificationRequest from "@/components/notification-request";
import { useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string>("");

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-900 mb-6">Recordatorio de Tareas Mensuales</h1>
        <TaskDashboard token={token} />
        <NotificationRequest setToken={setToken} />
      </div>
    </main>
  );
}
