import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatToReal } from '@/utils/helperFunctions';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { DeliveryProps } from '../Deliveries';
import DashboardSkeleton from './components/DashboardSkeleton';
import { DatePicker } from './components/DatePicker';
import DeliveryItem from './components/DeliveryItem';
import SummaryCard from './components/SummaryCard';

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [trucksAmount, setTrucksAmount] = useState(null);
  const [driversAmount, setDriversAmount] = useState(null);
  const [deliveries, setDeliveries] = useState<DeliveryProps[]>([]);

  const calculateInvoicing = (list: DeliveryProps[]) => {
    return list.reduce((acc, item) => acc + item.totalValue, 0);
  };

  const fetchData = async () => {
    setIsLoading(true)

    const fetchTrucksAmount = axios.get('/trucks/amount').then((response) => {
      setTrucksAmount(response.data.data.amount);
    });
    const fetchDriversAmount = axios.get('/drivers/amount').then((response) => {
      setDriversAmount(response.data.data.amount);
    });
    const fetchDeliveriesFromDay = axios
      .get(`/deliveries/day?date=${format(date, 'MM-dd-yyyy')}`)
      .then((response) => {
        setDeliveries(response.data.data);
      });

    Promise.all([fetchTrucksAmount, fetchDriversAmount, fetchDeliveriesFromDay])
      .then(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [date]);

  return (
    <>
      <div className="flex justify-between border-2 mb-4">
        <h1 className="text-2xl font-semibold pb-4">Dashboard</h1>
        <div className='flex items-center mb-6 gap-'>
          <DatePicker date={date} setDate={setDate} />
          <Button className='border-black border-2 rounded-l-0 bg-black text-white rounded-none rounded-r-md text' onClick={() => {
            setDate(new Date())
          }}>Hoje</Button>
        </div>
      </div>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          <SummaryCard title="Total de caminhões" value={trucksAmount} />
          <SummaryCard title="Total de motoristas" value={driversAmount} />
          <SummaryCard
            title="Faturamento do dia"
            value={formatToReal(calculateInvoicing(deliveries))}
          />

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Entregas do dia</CardTitle>
              <CardDescription>
                {deliveries.length} entregas serão feitas hoje
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              {deliveries.map((delivery) => (
                <DeliveryItem
                  key={delivery.id}
                  driver={delivery.driver}
                  cargo={delivery.cargo}
                  destiny={delivery.destiny}
                  truck={delivery.truck}
                  totalValue={formatToReal(delivery.totalValue)}
                  isDangerous={delivery.isDangerous}
                  isValuable={delivery.isValuable}
                  hasInsurance={delivery.hasInsurance}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
