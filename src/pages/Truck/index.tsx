import NoItemsFound from '@/components/NoItemsFound';
import TableSkeleton from '@/components/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import useAxios from '@/hooks/useAxios';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckTableItem from './components/TruckTableItem';

export type TruckProps = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: string;
  capacity: number;
};

export default function Truck() {
  const navigate = useNavigate();
  const tableHeaders = ["Id", "Placa", "Marca", "Modelo", "Ano", "Capacidade(t)", "Ações"];
  const { response, loading } = useAxios({ url: '/trucks', method: 'get' });
  const [trucksList, setTrucksList] = useState<TruckProps[]>([]);

  async function deleteTruck(id: number) {
    try {
      await axios.delete(`/truck/${id}`);
      setTrucksList(trucksList.filter((truck) => truck.id !== id));
      toast({
        title: 'Caminhão excluído com sucesso!',
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

  async function updateTruck(updatedTruck: TruckProps) {
    try {
      const response = await axios.put(`/truck/${updatedTruck.id}`, updatedTruck);
      if (response.status !== 201) {
        console.error('Erro ao atualizar:', response.statusText);
        return;
      }
      setTrucksList(
        trucksList.map((truck) =>
          truck.id === updatedTruck.id ? updatedTruck : truck,
        ),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Erro ao tentar atualizar!',
          description: `${error.response?.data.message}`,
          variant: "destructive"
        });
      }
    }
  }

  useEffect(() => {
    if (!response) return
    setTrucksList(response.data)
  }, [response])

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Caminhões</h1>
      <Card className="w-full h-[90%] overflow-auto">
        <CardHeader className="flex items-end sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 shadow-sm mb-4">
          <Button className="w-fit" onClick={() => navigate('/truck/add')}>
            Adicionar caminhão
          </Button>
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
              {loading ? (
                <TableSkeleton columnsAmount={tableHeaders.length} />
              ) : (
                trucksList?.map((truck: TruckProps) => (
                  <TruckTableItem
                    key={truck.id}
                    id={truck.id}
                    plate={truck.plate}
                    brand={truck.brand}
                    capacity={truck.capacity}
                    model={truck.model}
                    year={truck.year}
                    onDelete={deleteTruck}
                    onUpdate={updateTruck}
                  />
                ))
              )}
            </TableBody>
          </Table>
          {(!loading && (!trucksList || trucksList.length === 0)) && <NoItemsFound />}
        </CardContent>
      </Card>
    </>
  );
}
