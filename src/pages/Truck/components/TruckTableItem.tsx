import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SquarePen, Trash } from "lucide-react";

type TruckItemProps = {
  id: number,
  name: string,
  brand: string,
  model: string,
  year: string,
  capacity: number,
}

export default function TruckTableItem({ id, name, brand, model, year, capacity }: TruckItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className="w-fit">{name}</TableCell>
      <TableCell className="w-fit">
        {brand}
      </TableCell>
      <TableCell>{model}</TableCell>
      <TableCell>{year}</TableCell>
      <TableCell>{capacity}</TableCell>
      <TableCell className="flex">
        <Button size="icon" className="bg-transparent hover:bg-transparent p-0 ">
          <SquarePen size={20} color="blue" />
        </Button>
        <Button size="icon" className="bg-transparent hover:bg-transparent p-0 ">
          <Trash size={20} color="red" />
        </Button>
      </TableCell>
    </TableRow>
  )
}