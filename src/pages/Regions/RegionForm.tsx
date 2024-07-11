import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';


export default function RegionForm() {

  const navigate = useNavigate();
  const { toast } = useToast();

  const FormSchema = z.object({
    name: z.string().min(3, 'O nome da região precisa ter pelo menos 3 caracteres.'),
    tax: z.number({ message: 'A taxa deve ser um número.' }).min(0, 'Taxa não pode ser menor que 0').max(1, 'Taxa não pode ser maior que 1'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      tax: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await axios.post('/region', values);
      form.reset();
      toast({
        title: "Região cadastrada com sucesso!",
        description: `${values.name} com taxa de ${values.tax * 100}%`,
        action: <ToastAction altText="Visualizar" onClick={() => navigate('/regions')}>Visualizar</ToastAction>,
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cadastrar região</h1>
      <Card className="w-full">
        <CardContent className="pt-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 grid grid-cols-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da região" {...field} />
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
                        step="0.01"
                        placeholder="Digite o valor da taxa..."
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(
                            e.target.value.replace(',', '.'),
                          );
                          field.onChange(isNaN(value) ? '' : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className='mt-2 col-span-2'>Cadastrar região</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
