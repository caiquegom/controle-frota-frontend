import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { DriverProps } from '@/pages/Drivers';
import { formatToReal } from '@/utils/helperFunctions';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import { useState } from 'react';

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
  onDelete: (id: number) => void;
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
  onDelete
}: DeliveryItemProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  async function handleDelete() {
    onDelete(id);
    setDialogIsOpen(false);
  }

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
        <span className="flex flex-col gap-1">
          {!(hasInsurance || isDangerous || isValuable) && '-'}
          {hasInsurance && <Badge className="bg-blue-300 hover:bg-blue-400 text-black w-20 justify-center">Seguro</Badge>}
          {isDangerous && <Badge className="bg-red-400 hover:bg-red-500 text-black w-20 justify-center">Perigoso</Badge>}
          {isValuable && <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black w-20 justify-center">Valioso</Badge>}
        </span>
      </TableCell>
      <TableCell>
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="bg-transparent hover:bg-transparent p-0 "
            >
              <Trash size={20} color="red" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Você tem certeza que deseja excluir?</DialogTitle>
              <DialogDescription>
                Essa ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancelar</DialogClose>
              <Button
                onClick={handleDelete}
                variant={'destructive'}
                type="submit"
                size="sm"
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
