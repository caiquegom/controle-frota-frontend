import NoItemsFound from '@/components/NoItemsFound';
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
import { DriverProps } from '../Drivers';
import TruckTableItem from './components/TruckTableItem';
import TruckTableSkeleton from './components/TruckTableSkeleton';

export type TruckProps = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: string;
  capacity: number;
  driver: DriverProps
};

export default function Truck() {
  const navigate = useNavigate();
  const { response: trucksResponse, loading: truckLoading } = useAxios({ url: '/trucks', method: 'get' });
  const { response: driversResponse } = useAxios({ url: '/drivers', method: 'get' });
  const [trucksList, setTrucksList] = useState<TruckProps[]>([]);
  const [driverOptions, setdriverOptions] = useState<DriverProps[]>([]);

  useEffect(() => {
    if (!trucksResponse || !driversResponse) return;
    setTrucksList(trucksResponse?.data);
    setdriverOptions(driversResponse?.data);
  }, [trucksResponse, driversResponse]);

  async function deleteTruck(id: number) {
    try {
      await axios.delete(`/truck/${id}`);
      setTrucksList(trucksList.filter((truck) => truck.id !== id));
    } catch (error) {
      console.error('Error:', error);
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
                <TableHead>Id</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Capacidade(t)</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {truckLoading ? (
                <TruckTableSkeleton />
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
                    driver={truck.driver}
                    driverOptions={driverOptions}
                    onDelete={deleteTruck}
                    onUpdate={updateTruck}
                  />
                ))
              )}
            </TableBody>
          </Table>
          {(!truckLoading && (!trucksList || trucksList.length === 0)) && <NoItemsFound />}
        </CardContent>
      </Card>
    </>
  );
}
