import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"


export default function TableSkeleton({ columnsAmount }: { columnsAmount: number }) {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columnsAmount }).map((_, index) => (
        <TableCell key={`cell-${index}`} className="font-medium">
          <Skeleton className="w-15 h-7 my-3" />
        </TableCell>
      ))}
    </TableRow>
  ))
}