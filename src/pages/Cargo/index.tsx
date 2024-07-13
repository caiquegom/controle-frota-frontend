import NoItemsFound from "@/components/NoItemsFound";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import useAxios from "@/hooks/useAxios";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryProps } from "../Deliveries";
import CargoTableItem from "./components/CargoTableItem";

export type CargoProps = {
  id: number,
  name: string,
  type: 'eletronic' | 'fuel' | 'other'
  description?: string,
  delivery?: DeliveryProps,
}

export default function Cargo() {
  const navigate = useNavigate();
  const tableHeaders = ['Id', 'Nome', 'Tipo de carga', 'Descrição', 'Entrega (id)', 'Ações']
  const { response, loading } = useAxios({ url: '/cargos', method: 'get' })
  const [cargosList, setCargoList] = useState<CargoProps[]>([])

  async function deleteCargo(id: number) {
    try {
      await axios.delete(`/cargo/${id}`);
      setCargoList(cargosList.filter(cargo => cargo.id !== id));
      toast({
        title: 'Carga excluída com sucesso!',
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Erro ao tentar deletar!',
          description: `${error.response?.data.message}`,
          variant: "destructive"
        });
      }
    }
  }

  async function updateCargo(updatedCargo: CargoProps) {
    try {
      await axios.put(`/cargo/${updatedCargo.id}`, updatedCargo);
      setCargoList(cargosList.map(cargo =>
        cargo.id === updatedCargo.id ? updatedCargo : cargo
      ));
    } catch (error) {
      console.error('Erro ao atualizar região:', error);
    }
  }

  useEffect(() => {
    if (!response) return
    setCargoList(response?.data)
  }, [response])

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cargas</h1>
      <Card className="w-full h-[90%] overflow-auto">
        <CardHeader className="flex items-end sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 shadow-sm mb-4">
          <Button className="w-fit" onClick={() => navigate('/cargo/add')}>Adicionar carga</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((thead) => (
                  <TableHead>{thead}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (<TableSkeleton columnsAmount={tableHeaders.length} />) : (
                cargosList?.map(cargo => (
                  <CargoTableItem key={cargo.id} id={cargo.id} name={cargo.name} type={cargo.type} description={cargo.description} deliveryId={cargo.delivery?.id} onDelete={deleteCargo} onUpdate={updateCargo} />
                )))}
            </TableBody>
          </Table>
          {(!loading && (!cargosList || cargosList.length === 0)) && <NoItemsFound />}
        </CardContent>
      </Card >
    </>
  )
}