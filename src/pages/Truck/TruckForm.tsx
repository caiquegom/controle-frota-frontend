import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

const formSchema = z.object({
  plate: z.string().refine((value) => /^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/.test(value ?? ""), 'Digite uma placa válida. Exemplo: XXX0000'),
  brand: z.string().min(1, 'A marca não pode estar vazia.'),
  model: z.string().min(1, 'O modelo não pode estar vazio.'),
  year: z.string().length(4, 'O ano deve ter 4 caracteres.').refine((year) => {
    const numYear = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    return !isNaN(numYear) && numYear >= 2000 && numYear <= currentYear;
  }, 'O ano deve ser um número válido entre 2000 e o ano atual.'),
  capacity: z.number().min(1, 'A capacidade deve ser maior que 0.'),
});

export default function TruckForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
      brand: '',
      model: '',
      year: '',
      capacity: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post('/truck', { ...values, plate: values.plate.toUpperCase() });
      form.reset();
      toast({
        title: 'Caminhão cadastrado com sucesso!',
        description: `${values.brand} ${values.model} - Placa: ${values.plate}`,
        action: (
          <ToastAction altText="Visualizar" onClick={() => navigate('/trucks')}>
            Visualizar
          </ToastAction>
        ),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Erro ao tentar cadastrar!',
          description: `${error.response?.data.message}`,
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cadastrar caminhão</h1>
      <Card className="w-full">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-4 gap-y-4 justify-center"
            >
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX0000" {...field} />
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
                    <FormDescription>Capacidade em toneladas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 mt-4 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-40"
                  onClick={() => navigate('/trucks')}
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
  );
}
