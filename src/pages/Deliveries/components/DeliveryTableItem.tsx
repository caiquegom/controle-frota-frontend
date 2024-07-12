import { TableCell, TableRow } from "@/components/ui/table";
import { CargoProps } from "@/pages/Cargo";
import { DeliveryProps } from "..";


type DeliveryItemProps = {
  onDelete: (id: number) => void,
  onUpdate: (updatedDelivery: CargoProps) => void
} & DeliveryProps

export default function DeliveryTableItem({}: DeliveryItemProps) {
  return (
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell>Destino</TableCell>
      <TableCell>Data da entrega</TableCell>
      <TableCell>Valor total</TableCell>
      <TableCell>Caminhão</TableCell>
      <TableCell>Motorista</TableCell>
      <TableCell>Carga</TableCell>
      <TableCell>Ações</TableCell>
    </TableRow>
  )
}