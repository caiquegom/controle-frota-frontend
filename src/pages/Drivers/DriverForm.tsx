import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { clearNumberFormat, formatPhoneNumber } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, 'O campo é obrigatório'),
  email: z.string().email({ message: 'O campo precisa ser um e-mail válido' }),
  phone: z.string().length(15, 'O telefone deve ter 11 caracteres'),
});

export default function DriverForm() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post('/driver', { ...values, phone: clearNumberFormat(values.phone) });
      form.reset();
      toast({
        title: 'Motorista cadastrado com sucesso!',
        description: `${values.name} cadastrado.`,
        action: (
          <ToastAction altText="Visualizar" onClick={() => navigate('/drivers')}>
            Visualizar
          </ToastAction>
        ),
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Erro ao tentar cadastrar!',
          description: `${error.response?.data.message}`,
        });
      }
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cadastrar motorista</h1>
      <Card className="w-full">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-4 gap-y-4 justify-center"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid col-span-2">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o e-mail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 mt-4 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-40"
                  onClick={() => navigate('/drivers')}
                >
                  Voltar
                </Button>
                <Button type="submit" className="w-40">
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}