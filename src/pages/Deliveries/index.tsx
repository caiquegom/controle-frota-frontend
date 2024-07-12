import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export type DeliveryProps = {
  id: number;
  name: string;
  tax: number;
};

export default function Deliveries() {
  const navigate = useNavigate()

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Entregas</h1>
      <Card className="w-full h-[90%] overflow-auto">
        <CardHeader className="flex items-end sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 shadow-sm mb-4">
          <Button className="w-fit" onClick={() => navigate('/delivery/add')}>
            Criar entrega
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Data da entrega</TableHead>
                <TableHead>Valor total</TableHead>
                <TableHead>Caminhão</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Carga</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}