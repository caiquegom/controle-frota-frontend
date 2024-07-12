import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CargoProps } from "..";

const cargoTypeOptions = {
  eletronic: {
    label: "Eletrônico",
    badge: <Badge className="bg-blue-900">Eletrônico</Badge>
  },
  fuel: {
    label: "Combustível",
    badge: <Badge className="bg-green-900">Combustível</Badge>
  },
  other: {
    label: "Outro",
    badge: <Badge className="bg-black">Outro</Badge>
  }
}

type CargoItemsProps = {
  deliveryId: number | undefined
  onDelete: (id: number) => void;
  onUpdate: (updatedCargo: CargoProps) => void;
} & CargoProps

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome da carga deve ter pelo menos 2 caracteres.' }),
  type: z.enum(["eletronic", "fuel", "other"]),
  description: z
    .string()
    .min(5, { message: 'A descrição da carga deve ter pelo menos 5 caracteres.' })
    .max(150, { message: 'A descrição da carga deve ter no máximo 150 caracteres.' })
});

export default function CargoTableItem({ id, name: initialName, type: initialType, description: initialDescription, deliveryId, onDelete, onUpdate }: CargoItemsProps) {
  const { toast } = useToast();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      type: initialType,
      description: initialDescription
    },
  });

  async function handleDelete() {
    onDelete(id);
    setDialogIsOpen(false);
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (data.name === initialName && data.type === initialType && data.description === initialDescription) {
        toast({
          title: 'Nenhuma alteração foi feita.',
        });
      } else {
        const updatedCargo = { id, ...data }
        onUpdate(updatedCargo);
        setEditDialogIsOpen(false);
        toast({
          title: 'Carga atualizada com sucesso!',
          description: `Carga ${data.name} foi atualizado`,
        });
      }
    } catch (error) {
      console.error('Error', error)
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className="w-fit">{initialName}</TableCell>
      <TableCell className="w-fit">
        {cargoTypeOptions[initialType].badge}
      </TableCell>
      <TableCell>{initialDescription ?? '-'}</TableCell>
      <TableCell>{deliveryId ?? '-'}</TableCell>
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
              <DialogTitle>Editar Carga</DialogTitle>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de carga</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo de carga" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eletronic">Eletrônico</SelectItem>
                            <SelectItem value="fuel">Combustível</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Digite a descrição da carga" className="resize-none" defaultValue={initialDescription} {...field} />
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
                <Label className="text-right">Carga</Label>
                <Input
                  readOnly
                  id="name"
                  defaultValue={initialName}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tipo de carga</Label>
                <Input
                  readOnly
                  id="type"
                  defaultValue={cargoTypeOptions[initialType].label}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Descrição</Label>
                <Textarea
                  readOnly
                  id="description"
                  defaultValue={initialDescription}
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
  )
}