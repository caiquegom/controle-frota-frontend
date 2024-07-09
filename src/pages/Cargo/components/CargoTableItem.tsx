import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SquarePen, Trash } from "lucide-react";

type CargoItemProps = {
  id: number,
  name: string,
  type: 'eletronic' | 'fuel' | 'other'
  description?: string
}

const cargoTypeBadge = {
  eletronic: <Badge className="bg-blue-900">Eletrônico</Badge>,
  fuel: <Badge className="bg-green-900">Combustível</Badge>,
  other: <Badge className="bg-black">Combustível</Badge>
}

export default function CargoTableItem({ id, name, type, description }: CargoItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className="w-fit">{name}</TableCell>
      <TableCell className="w-fit">
        {cargoTypeBadge[type]}
      </TableCell>
      <TableCell>{description}</TableCell>
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