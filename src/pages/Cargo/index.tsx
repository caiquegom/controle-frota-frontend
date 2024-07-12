import NoItemsFound from "@/components/NoItemsFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CargoTableItem from "./components/CargoTableItem";
import CargoTableSkeleton from "./components/CargoTableSkeleton";

export type CargoProps = {
  id: number,
  name: string,
  type: 'eletronic' | 'fuel' | 'other'
  description?: string,
}

export default function Cargo() {
  const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/cargos', method: 'get' })
  const [cargosList, setCargoList] = useState<CargoProps[]>([])

  async function deleteCargo(id: number) {
    try {
      await axios.delete(`/cargo/${id}`);
      setCargoList(cargosList.filter(cargo => cargo.id !== id));
    } catch (error) {
      console.error('Error:', error);
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
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo de carga</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (<CargoTableSkeleton />) : (
                cargosList?.map(cargo => (
                  <CargoTableItem key={cargo.id} id={cargo.id} name={cargo.name} type={cargo.type} description={cargo.description} onDelete={deleteCargo} onUpdate={updateCargo} />
                )))}
            </TableBody>
          </Table>
          {(!loading && (!cargosList || cargosList.length === 0)) && <NoItemsFound />}
        </CardContent>
      </Card >
    </>
  )
}