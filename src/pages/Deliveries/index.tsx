import NoItemsFound from "@/components/NoItemsFound";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryTableItem from "./components/DeliveryTableItem";

export type DeliveryProps = {
  id: number;
  name: string;
  tax: number;
  totalValue: number,
  isValuable: boolean,
  isDangerous: boolean,
  hasInsurance: boolean,
  deliveryDate: Date,
  createdAt: Date,
  updatedAt: Date,
};

export default function Deliveries() {
  const navigate = useNavigate()
  const tableHeaders = ['Id', 'Destino', 'Data da entrega', 'Valor total', 'Caminhão', 'Motorista', 'Carga', 'Ações']
  const { response, loading } = useAxios({ url: '/deliveries', method: 'get' })
  const [deliveriesList, setDeliveriesList] = useState<DeliveryProps[]>([])

  useEffect(() => {
    if (!response) return
    setDeliveriesList(response?.data)
  }, [response])

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
              {loading ? (<TableSkeleton columnsAmount={tableHeaders.length} />) : (
                deliveriesList?.map(delivery => (
                  <DeliveryTableItem key={delivery.id} />
                )))}
            </TableBody>
          </Table>
          {(!loading && (!deliveriesList || deliveriesList.length === 0)) && <NoItemsFound />}
        </CardContent>
      </Card>
    </>
  )
}