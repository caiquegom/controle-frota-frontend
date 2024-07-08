import Sidebar from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-900">
      <Sidebar />
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}