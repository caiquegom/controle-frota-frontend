import NoItemsFound from "@/components/NoItemsFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TruckTableItem from "./components/TruckTableItem";
import TruckTableSkeleton from "./components/TruckTableSkeleton";

export default function Truck() {
  const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/trucks', method: 'get' })
  const [trucksList, setTrucksList] = useState<Array<string | null>>([])

  useEffect(() => {
    if (!response) return
    setTrucksList(response?.data)
  }, [response])

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Caminhões</h1>
      <Card className="w-full">
        <CardHeader className="flex items-end">
          <Button className="w-fit" onClick={() => navigate('/truck/add')}>Adicionar caminhão</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Capacidade(t)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (<TruckTableSkeleton />) : (
                (!trucksList || trucksList.length === 0) ? (
                  <NoItemsFound />
                ) : trucksList.map(truck => (
                  <TruckTableItem key={truck.id} id={truck.id} name={truck.name} brand={truck.brand} capacity={truck.capacity} model={truck.model} year={truck.year} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}