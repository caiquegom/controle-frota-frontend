import NoItemsFound from "@/components/NoItemsFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CargoTableItem from "./components/CargoTableItem";
import CargoTableSkeleton from "./components/CargoTableSkeleton";

export default function Cargo() {
  const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/cargos', method: 'get' })
  const [cargosList, setCargoList] = useState<Array<string | null>>([])

  useEffect(() => {
    if (!response) return
    setCargoList(response?.data)
  }, [response])

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cargas</h1>
      <Card className="w-full">
        <CardHeader className="flex items-end">
          <Button className="w-fit" onClick={() => navigate('/cargo/add')}>Adicionar carga</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo de carga</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (<CargoTableSkeleton />) : (
                (!cargosList || cargosList.length === 0) ? (
                  <NoItemsFound />
                ) : cargosList.map(cargo => (
                  <CargoTableItem id={cargo.id} name={cargo.name} type={cargo.type} description={cargo.description} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}