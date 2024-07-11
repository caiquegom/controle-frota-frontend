import { TableCell, TableRow } from "@/components/ui/table";

export default function DeliveryTableItem() {
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