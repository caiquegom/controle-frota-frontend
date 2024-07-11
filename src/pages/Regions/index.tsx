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
import useAxios from '@/hooks/useAxios';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegionTableItem from './components/RegionTableItem';
import RegionTableSkeleton from './components/RegionTableSkeleton';

export type RegionProps = {
  id: number;
  name: string;
  tax: number;
  driverLimitPerMonth: number
};

export default function Region() {
  const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/regions', method: 'get' });
  const [regionsList, setRegionsList] = useState<RegionProps[]>([]);

  async function deleteRegion(id: number) {
    try {
      await axios.delete(`/region/${id}`);
      setRegionsList(regionsList.filter(region => region.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateRegion(updatedRegion: RegionProps) {
    try {
      await axios.put(`/region/${updatedRegion.id}`, updatedRegion);
      setRegionsList(regionsList.map(region =>
        region.id === updatedRegion.id ? updatedRegion : region
      ));
    } catch (error) {
      console.error('Erro ao atualizar região:', error);
    }
  }

  useEffect(() => {
    if (!response) return;
    setRegionsList(response?.data);
  }, [response]);

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Regiões</h1>
      <Card className="w-full h-[90%] overflow-auto">
        <CardHeader className="flex items-end sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-75 shadow-sm mb-4">
          <Button className="w-fit" onClick={() => navigate('/region/add')}>
            Adicionar região
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Limite de viagens do motorista</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <RegionTableSkeleton />
              ) : (
                regionsList.map((region: RegionProps) => (
                  <RegionTableItem
                    key={region.id}
                    id={region.id}
                    name={region.name}
                    tax={region.tax}
                    driverLimitPerMonth={region.driverLimitPerMonth}
                    onDelete={deleteRegion}
                    onUpdate={updateRegion}
                  />
                ))
              )}
            </TableBody>
          </Table>
          {(!loading && (!regionsList || regionsList.length === 0)) && (
            <NoItemsFound />
          )}
        </CardContent>
      </Card>
    </>
  );
}