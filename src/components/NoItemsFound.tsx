import { SearchX } from "lucide-react";

export default function NoItemsFound() {
  return (
    <div className="flex gap-3 items-center justify-center opacity-50 w-full py-8 col-span-3" >
      <SearchX size={30} />
      <span className="text-lg font-semibold">Nenhum item foi encontrado</span>
    </div >
  )
}