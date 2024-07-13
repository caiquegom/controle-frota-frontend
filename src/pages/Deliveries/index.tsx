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
import { CargoProps } from '../Cargo';
import { DriverProps } from '../Drivers';
import { RegionProps } from '../Regions';
import { TruckProps } from '../Truck';
import DeliveryTableItem from './components/DeliveryTableItem';

export type DeliveryProps = {
  id: number;
  name: string;
  tax: number;
  totalValue: number;
  isValuable: boolean;
  isDangerous: boolean;
  hasInsurance: boolean;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  driver: DriverProps;
  cargo: CargoProps;
  truck: TruckProps;
  destiny: RegionProps;
};



export default function Deliveries() {
  const navigate = useNavigate();
  const tableHeaders = [
    'Id',
    'Destino',
    'Data da entrega',
    'Valor total',
    'Caminhão (id)',
    'Motorista',
    'Carga',
    'Indicadores',
    'Ações',
  ];
  const { response, loading } = useAxios({ url: '/deliveries', method: 'get' });
  const [deliveriesList, setDeliveriesList] = useState<DeliveryProps[]>([]);

  async function deleteDelivery(id: number) {
    try {
      await axios.delete(`/delivery/${id}`);
      setDeliveriesList(deliveriesList.filter(delivery => delivery.id !== id));
      toast({
        title: 'Entrega excluída com sucesso!',
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

  useEffect(() => {
    if (!response) return;
    setDeliveriesList(response?.data);
  }, [response]);

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
                {tableHeaders.map((thead) => (
                  <TableHead>{thead}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columnsAmount={tableHeaders.length} />
              ) : (
                deliveriesList?.map((delivery) => (
                  <DeliveryTableItem
                    key={delivery.id}
                    id={delivery.id}
                    cargoName={delivery.cargo?.name}
                    deliveryDate={new Date(delivery.deliveryDate)}
                    destinyName={delivery.destiny?.name}
                    driver={delivery.driver}
                    truckId={delivery.truck.id}
                    totalValue={delivery.totalValue}
                    isDangerous={delivery.isDangerous}
                    isValuable={delivery.isValuable}
                    hasInsurance={delivery.hasInsurance}
                    onDelete={deleteDelivery}
                  />
                ))
              )}
            </TableBody>
          </Table>
          {!loading && (!deliveriesList || deliveriesList.length === 0) && (
            <NoItemsFound />
          )}
        </CardContent>
      </Card>
    </>
  );
}
