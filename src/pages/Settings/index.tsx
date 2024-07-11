import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useAxios from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SettingsSkeleton from "./components/SettingsSkeleton";

const FormSchema = z.object({
  driverLimitPerTruck: z.coerce.number({ message: 'O valor deve ser um número' }).nonnegative({ message: 'O valor não pode ser negativo' }).int({ message: 'O valor deve ser inteiro' }).max(30, 'O valor deve ser menor que 30'),
  truckLimitPerMonth: z.coerce.number({ message: 'O valor deve ser um número' }).nonnegative({ message: 'O valor não pode ser negativo' }).int({ message: 'O valor deve ser inteiro' }).max(30, 'O valor deve ser menor que 30'),
});

export default function Settings() {
  // const navigate = useNavigate();
  const { response, loading } = useAxios({ url: '/settings', method: 'get' })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      driverLimitPerTruck: 0,
      truckLimitPerMonth: 0,
    },
  });

  useEffect(() => {
    if (!response) return

    form.setValue('driverLimitPerTruck', response.data.driverLimitPerTruck)
    form.setValue('truckLimitPerMonth', response.data.truckLimitPerMonth)
  }, [response])

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await axios.put('/settings', values);
      toast({
        title: "Configurações alteradas com sucesso!",
      })
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast({
          title: "Configurações alteradas com sucesso!",
          description: error.response?.data.message
        })
      }
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Configurações</h1>
      <Card>
        <CardContent className="pt-4">
          <h2 className="text-lg font-semibold mb-2">Definir limite</h2>
          {loading ? (
            <SettingsSkeleton />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-2 gap-y-4 justify-center">
                <FormField control={form.control} name="driverLimitPerTruck" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entregas do motorista em um caminhão (por mês)</FormLabel>
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

                <FormField control={form.control} name="truckLimitPerMonth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entregas do caminhão (por mês)</FormLabel>
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
                <div className="col-span-2 flex justify-end">
                  <Button className="w-32">Salvar</Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  )
}