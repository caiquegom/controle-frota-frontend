import { SearchX } from "lucide-react";
import { TableRow } from "./ui/table";

export default function NoItemsFound() {
  return (
    <TableRow className="flex gap-3 items-center justify-center opacity-50 w-full py-3">
      <SearchX size={30} />
      <span className="text-lg font-semibold">Nenhum item foi encontrado</span>
    </TableRow>
  )
}