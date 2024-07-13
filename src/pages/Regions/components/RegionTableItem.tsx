import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RegionProps } from '..';

type RegionItemProps = {
  onDelete: (id: number) => void;
  onUpdate: (updatedRegion: RegionProps) => void;
} & RegionProps

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome da região deve ter pelo menos 2 caracteres.' }),
  tax: z.coerce
    .number(),
  driverLimitPerMonth: z.coerce.number({ message: 'O valor deve ser um número' }).nonnegative({ message: 'O valor não pode ser negativo' }).int({ message: 'O valor deve ser inteiro' }).max(30, 'O valor deve ser menor que 30')
});

export default function RegionTableItem({
  id,
  name: initialName,
  tax: initialTax,
  driverLimitPerMonth: initialDriverLimitPerMonth,
  onDelete,
  onUpdate,
}: RegionItemProps) {
  const { toast } = useToast();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      tax: initialTax,
      driverLimitPerMonth: initialDriverLimitPerMonth
    },
  });

  async function handleDelete() {
    onDelete(id);
    setDialogIsOpen(false);
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const decimalTax = data.tax / 100

    try {
      if (data.name === initialName && data.tax === initialTax && data.driverLimitPerMonth === initialDriverLimitPerMonth) {
        toast({
          title: 'Nenhuma alteração foi feita.',
        });
      } else {
        const updatedRegion = { ...data, id, tax: decimalTax };
        onUpdate(updatedRegion);
        setEditDialogIsOpen(false);
        toast({
          title: 'Região atualizada com sucesso!',
          description: `Nome: ${data.name}, Taxa: ${data.tax}%, Limite: ${data.driverLimitPerMonth}`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className="w-fit">{initialName}</TableCell>
      <TableCell>{initialTax}%</TableCell>
      <TableCell>{initialDriverLimitPerMonth === 0 ? '-' : initialDriverLimitPerMonth}</TableCell>
      <TableCell className="flex">
        <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="bg-transparent hover:bg-transparent p-0 "
            >
              <SquarePen size={20} color="blue" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Região</DialogTitle>
              <DialogDescription>Edite os campos abaixo.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialName}
                          placeholder="Digite o nome da região"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da taxa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          max={100}
                          step="1"
                          placeholder="Digite o valor da taxa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="driverLimitPerMonth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entregas do motorista (por mês)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Digite o valor"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Informe 0 caso não queira limite</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  type="submit"
                >
                  Editar
                </Button>
              </form>
            </Form>
            <DialogClose>Fechar</DialogClose>
          </DialogContent>
        </Dialog>

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Região</Label>
                <Input
                  readOnly
                  id="name"
                  defaultValue={initialName}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Taxa</Label>
                <Input
                  readOnly
                  id="tax"
                  defaultValue={initialTax}
                  className="col-span-3"
                />
              </div>
            </div>
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
