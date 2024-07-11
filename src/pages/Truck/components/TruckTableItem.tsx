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
import { TruckProps } from '..';

type TruckItemProps = {
  onDelete: (id: number) => void;
  onUpdate: (updatedTruck: TruckProps) => void;
} & TruckProps

const formSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
  brand: z.string().min(1, 'A marca não pode estar vazia.'),
  model: z.string().min(1, 'O modelo não pode estar vazio.'),
  year: z
    .string()
    .length(4, 'O ano deve ter 4 caracteres.')
    .refine((year) => {
      const numYear = parseInt(year, 10);
      const currentYear = new Date().getFullYear();
      return !isNaN(numYear) && numYear >= 2000 && numYear <= currentYear;
    }, 'O ano deve ser um número válido entre 2000 e o ano atual.'),
  capacity: z.number().min(1, 'A capacidade deve ser maior que 0.'),
});

export default function TruckTableItem({
  id,
  name: initialName,
  brand: initialBrand,
  model: initialModel,
  year: initialYear,
  capacity: initialCapacity,
  onDelete,
  onUpdate,
}: TruckItemProps) {
  const { toast } = useToast();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      brand: initialBrand,
      model: initialModel,
      year: initialYear,
      capacity: initialCapacity,
    },
  });

  async function handleDelete() {
    onDelete(id);
    toast({
      title: 'Caminhão excluído com sucesso!',
      variant: 'destructive',
    });
    setDialogIsOpen(false);
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (
        data.name === initialName &&
        data.brand === initialBrand &&
        data.model === initialModel &&
        data.year === initialYear &&
        data.capacity === initialCapacity
      ) {
        toast({
          title: 'Nenhuma alteração foi feita.',
        });
      } else {
        const updatedTruck = { id, ...data };
        onUpdate(updatedTruck);
        setEditDialogIsOpen(false);
        toast({
          title: 'Caminhão atualizado com sucesso!',
          description: `${data.brand} ${data.model} - Ano: ${data.year}`,
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
      <TableCell className="w-fit">{initialBrand}</TableCell>
      <TableCell>{initialModel}</TableCell>
      <TableCell>{initialYear}</TableCell>
      <TableCell>{initialCapacity}</TableCell>
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
              <DialogTitle>Editar Caminhão</DialogTitle>
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
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialName}
                          placeholder="Digite o nome da carga"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialBrand}
                          placeholder="Digite a marca do caminhão"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialModel}
                          placeholder="Digite o modelo do caminhão"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialYear}
                          placeholder="Digite o ano do caminhão"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialCapacity}
                          type="number"
                          step="1"
                          min={0}
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            field.onChange(isNaN(value) ? '' : value);
                          }}
                          placeholder="Digite a capacidade do caminhão"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Label className="text-right">Nome</Label>
                <Input
                  readOnly
                  id="name"
                  defaultValue={initialName}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Marca</Label>
                <Input
                  readOnly
                  id="brand"
                  defaultValue={initialBrand}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Modelo</Label>
                <Input
                  readOnly
                  id="model"
                  defaultValue={initialModel}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ano</Label>
                <Input
                  readOnly
                  id="year"
                  defaultValue={initialYear}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Capacidade</Label>
                <Input
                  readOnly
                  id="capacity"
                  defaultValue={initialCapacity}
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
