import menuItems from "@/utils/menuItems";
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex items-center gap-3 pl-5 py-4 border-b border-gray-700">
        <div className="rounded-full bg-gray-700 max-w-min max-h-min p-2">
          <UserRound size={25} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-300">Usuário</p>
          <p className="text-xs text-gray-400">Perfil: administrador</p>
        </div>
      </div>
      <div>
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className="flex items-center gap-2 px-6 py-3 hover:bg-gray-700 hover:cursor-pointer" >
            <item.icon className="h-5 w-5 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}