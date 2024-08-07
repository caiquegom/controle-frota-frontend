import { Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-900">
      <Sidebar />
      <main className="p-4 w-full">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}