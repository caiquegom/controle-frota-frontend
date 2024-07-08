import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePen, Trash } from "lucide-react";

export default function Cargo() {
  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cargas</h1>
      <Card className="w-full">
        <CardHeader className="flex items-end">
          <Button className="w-fit">Adicionar carga</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Tipo de carga</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell className="w-fit">Combustível</TableCell>
                <TableCell>Abastecimento de carros</TableCell>
                <TableCell className="flex">
                  <Button size="icon" className="bg-transparent hover:bg-transparent p-0 ">
                    <SquarePen size={20} color="blue" />
                  </Button>
                  <Button size="icon" className="bg-transparent hover:bg-transparent p-0 ">
                    <Trash size={20} color="red" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}