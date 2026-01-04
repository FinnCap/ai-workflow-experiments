import { Outlet } from "react-router";


import Sidebar from "~/components/Sidebar";
import type { Route } from "./+types/app-layout";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
}

export default function AppLayoutRoute() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}