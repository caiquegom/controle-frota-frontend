import menuItems from "@/utils/menuItems";
import { UserRound } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex items-center gap-2 pl-5 py-4 border-b border-gray-700">
        <div className="rounded-full bg-gray-800 max-w-min max-h-min p-2">
          <UserRound size={25} color="white" />
        </div>
        <div>
          <p className="text-md font-semibold text-gray-300">Nome do usuário</p>
          <p className="text-sm text-gray-400">Perfil: administrador</p>
        </div>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li className="flex items-center px-6 py-3 hover:bg-gray-700">
            <a href={item.path} className="flex items-center gap-2">
              <item.icon className="h-5 w-5 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}