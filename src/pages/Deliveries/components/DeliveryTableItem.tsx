import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { CargoProps } from '@/pages/Cargo';
import { DriverProps } from '@/pages/Drivers';
import { formatToReal } from '@/utils/helperFunctions';
import { format } from 'date-fns';

type DeliveryItemProps = {
  id: number;
  destinyName: string;
  deliveryDate: Date;
  totalValue: number;
  truckId: number;
  driver: DriverProps;
  cargoName: string;
  isValuable: boolean;
  isDangerous: boolean;
  hasInsurance: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (updatedDelivery: CargoProps) => void;
};

export default function DeliveryTableItem({
  id,
  destinyName,
  deliveryDate,
  totalValue,
  truckId,
  driver,
  cargoName,
  isValuable,
  isDangerous,
  hasInsurance,
}: DeliveryItemProps) {
  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell>{destinyName}</TableCell>
      <TableCell>{format(deliveryDate, 'dd/MM/y')}</TableCell>
      <TableCell>{formatToReal(totalValue)}</TableCell>
      <TableCell>{truckId}</TableCell>
      <TableCell>{`${driver.name} (id: ${driver.id})`}</TableCell>
      <TableCell>{cargoName}</TableCell>
      <TableCell>
        <span className="flex flex-col gap-1 items-center">
          {!(hasInsurance || isDangerous || isValuable) && '-'}
          {hasInsurance && <Badge className="bg-blue-300 text-black w-20 justify-center">Seguro</Badge>}
          {isDangerous && <Badge className="bg-red-400 text-black w-20 justify-center">Perigoso</Badge>}
          {isValuable && <Badge className="bg-yellow-500 text-black w-20 justify-center">Valioso</Badge>}
        </span>
      </TableCell>
      <TableCell>Ações</TableCell>
    </TableRow>
  );
}
