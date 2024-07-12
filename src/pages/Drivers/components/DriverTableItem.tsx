import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { clearNumberFormat, formatPhoneNumber } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DriverProps } from "..";

type DriverItemsProps = {
  onDelete: (id: number) => void;
  onUpdate: (updatedDriver: DriverProps) => void;
} & DriverProps

const formSchema = z.object({
  name: z.string().min(1, 'O campo é obrigatório'),
  email: z.string().email({ message: 'O campo precisa ser um e-mail válido' }),
  phone: z.string().length(15, 'O telefone deve ter 11 caracteres'),
});

export default function DriverTableItem({ id, name: initialName, email: initialEmail, phone: initialPhone, onDelete, onUpdate }: DriverItemsProps) {
  const { toast } = useToast();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
      email: initialEmail,
      phone: initialPhone,
    },
  });

  async function handleDelete() {
    onDelete(id);
    setDialogIsOpen(false);
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.name === initialName && data.email === initialEmail && data.phone === formatPhoneNumber(initialPhone)) {
      toast({
        title: 'Nenhuma alteração foi feita.',
      });
    } else {
      try {
        const updatedDriver = { ...data, id, phone: clearNumberFormat(data.phone) };
        onUpdate(updatedDriver);
        setEditDialogIsOpen(false);
        toast({
          title: 'Motorista atualizado com sucesso!',
          description: `${data.name} atualizado`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao tentar cadastrar!',
          description: `${error.message}`,
        });
      }
    }
  };

  useEffect(() => {
    form.setValue('phone', formatPhoneNumber(form.getValues('phone')));
  }, [form]);

  return (
    <TableRow>
      <TableCell className="font-medium">{id}</TableCell>
      <TableCell className="w-fit">{initialName}</TableCell>
      <TableCell className="w-fit">
        <a href={`mailto:${initialEmail}`} target="_blank" className="cursor-pointer text-blue-800 underline">
          {initialEmail}
        </a>
      </TableCell>
      <TableCell>
        <a href={`https://wa.me/+55${initialPhone}`} target="_blank" className="cursor-pointer text-blue-800 underline">
          {formatPhoneNumber(initialPhone)}
        </a>
      </TableCell>
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
              <DialogTitle>Editar Motorista</DialogTitle>
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
                          placeholder="Digite o nome do motorista"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={initialEmail}
                          type="email"
                          placeholder="Digite o e-mail"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={formatPhoneNumber(initialPhone)}
                          placeholder="Digite o telefone"
                          {...field}
                          onChange={(e) => {
                            form.setValue("phone", formatPhoneNumber(e.target.value));
                          }}
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
                <Label className="text-right">E-mail</Label>
                <Input
                  readOnly
                  id="email"
                  defaultValue={initialEmail}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Telefone</Label>
                <Input
                  readOnly
                  id="phone"
                  defaultValue={formatPhoneNumber(initialPhone)}
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