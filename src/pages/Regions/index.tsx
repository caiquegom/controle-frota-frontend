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
};

export default function Region() {
  const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/regions', method: 'get' });
  const [regionsList, setRegionsList] = useState<RegionProps[]>([]);

  useEffect(() => {
    if (!response) return;
    setRegionsList(response?.data);
  }, [response]);

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

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Regiões</h1>
      <Card className="w-full h-screen overflow-y-auto">
        <CardHeader className="flex items-end">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <RegionTableSkeleton />
              ) : regionsList.length === 0 ? (
                <NoItemsFound />
              ) : (
                regionsList.map((cargo: RegionProps) => (
                  <RegionTableItem
                    key={cargo.id}
                    id={cargo.id}
                    name={cargo.name}
                    tax={cargo.tax}
                    onDelete={deleteRegion}
                    onUpdate={updateRegion}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}