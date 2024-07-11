import NoItemsFound from "@/components/NoItemsFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverTableItem from "./components/DriverTableItem";
import DriverTableSkeleton from "./components/DriverTableSkeleton";

export type DriverProps = {
  id: number,
  name: string,
  email: string,
  phone: string
}

export default function Drivers() {
  const navigate = useNavigate()
  const { response, loading } = useAxios({ url: '/drivers', method: 'get' });
  const [driversList, setDriversList] = useState<DriverProps[]>([]);

  useEffect(() => {
    if (!response) return
    setDriversList(response?.data)
  }, [response])

  async function deleteDriver(id: number) {
    try {
      await axios.delete(`/driver/${id}`);
      setDriversList(driversList.filter((driver) => driver.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateDriver(updatedDriver: DriverProps) {
    try {
      const response = await axios.put(`/driver/${updatedDriver.id}`, updatedDriver);
      if (response.status !== 201) {
        console.error('Erro ao atualizar:', response.statusText);
        return;
      }
      setDriversList(
        driversList.map((driver) =>
          driver.id === updatedDriver.id ? updatedDriver : driver,
        ),
      );
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Motoristas</h1>
      <Card className="w-full h-[90%] overflow-auto">
        <CardHeader className="flex items-end sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 shadow-sm mb-4">
          <Button className="w-fit" onClick={() => navigate('/driver/add')}>
            Adicionar caminhão
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <DriverTableSkeleton />
              ) : (
                driversList?.map((driver: DriverProps) => (
                  <DriverTableItem
                    key={driver.id}
                    id={driver.id}
                    phone={driver.phone}
                    email={driver.email}
                    name={driver.name}
                    onDelete={deleteDriver}
                    onUpdate={updateDriver}
                  />
                ))
              )}
              {(!loading && (!driversList || driversList.length === 0)) && <NoItemsFound />}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </>
  )
}