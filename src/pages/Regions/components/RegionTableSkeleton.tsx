import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export default function RegionTableSkeleton() {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell className="font-medium">
        <Skeleton className="w-15 h-5" />
      </TableCell>
      <TableCell className="font-medium">
        <Skeleton className="w-15 h-5" />
      </TableCell>
      <TableCell className="font-medium">
        <Skeleton className="w-14 h-5" />
      </TableCell>
    </TableRow>
  ))

}