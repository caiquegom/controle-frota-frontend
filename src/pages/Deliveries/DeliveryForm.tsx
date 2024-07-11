import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxios from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { CargoProps } from "../Cargo";
import { RegionProps } from "../Regions";

const FormSchema = z.object({
  destinyId: z.coerce.number(),
  truckId: z.coerce.number(),
  driverId: z.coerce.number(),
  cargoId: z.coerce.number(),
  value: z.number().min(0, 'O valor é obrigatório'),
  tax: z.number(),
  taxValue: z.number(),
  deliveryDate: z.coerce.date().refine((data) => data > new Date(), { message: 'A data de entrega deve ser no futuro' }),
  hasInsurance: z.boolean().default(false).optional(),
  isDangerous: z.boolean().default(false).optional(),
  isValuable: z.boolean().default(false).optional()
});

export default function DeliveryForm() {
  const navigate = useNavigate()
  const [regionOptions, setRegionOptions] = useState<RegionProps[] | null>(null)
  const [cargoOptions, setCargoOptions] = useState<CargoProps[] | null>(null)
  const [truckOptions, setTruckOptions] = useState<CargoProps[] | null>(null)

  const { response: regionsReponse, loading: loadingRegions } = useAxios({ url: '/regions', method: 'get' })
  const { response: cargoResponse, loading: loadingCargos } = useAxios({ url: '/cargos', method: 'get' })
  const { response: truckResponse, loading: loadingTrucks } = useAxios({ url: '/trucks', method: 'get' })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      destinyId: undefined,
      truckId: undefined,
      driverId: undefined,
      cargoId: undefined,
      value: 0,
      tax: 0,
      taxValue: 0,
      deliveryDate: new Date(),
      hasInsurance: false,
    },
  });

  useEffect(() => {
    if (!regionsReponse || !cargoResponse || !truckResponse) return

    setRegionOptions(regionsReponse.data)
    setCargoOptions(cargoResponse.data)
    setTruckOptions(truckResponse.data)
  }, [regionsReponse, cargoResponse, truckResponse])

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Criar nova entrega</h1>
      <Card className="w-full">
        <CardContent className="pt-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 grid grid-cols-3 gap-y-4"
            >
              <h2 className="text-lg font-semibold mb-2 col-span-3 mt-2">Dados da entrega</h2>
              <FormField
                control={form.control}
                name="destinyId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Destino</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a região" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionOptions?.map((option) => (
                            <SelectItem value={String(option.id)}>{option.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="tax" render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="cargoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a carga" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargoOptions?.map((option) => (
                            <SelectItem value={String(option.id)}>{option.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caminhão</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o caminhão" />
                        </SelectTrigger>
                        <SelectContent>
                          {truckOptions?.map((option) => (
                            <SelectItem value={String(option.id)}>{option.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a carga" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Eletrônico</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="value" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="Digite o valor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="value" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da taxa</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="number"
                      step="1"
                      placeholder="Digite o valor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tax" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />


              <h2 className="text-lg font-semibold mb-2 col-span-3 mt-2">Indicadores</h2>
              <FormField
                control={form.control}
                name="isDangerous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 opacity-60 cursor-not-allowed">
                    <FormControl>
                      <Checkbox
                        disabled
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-not-allowed">
                        Carga perigosa
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isValuable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 opacity-60 cursor-not-allowed">
                    <FormControl>
                      <Checkbox
                        disabled
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-not-allowed">
                        Carga valiosa
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasInsurance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Garantir seguro de carga
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="col-span-3 flex gap-2 justify-end mt-3">
                <Button type="button" variant="secondary" className="w-40" onClick={() => navigate('/deliveries')}>Voltar</Button>
                <Button type="submit" className="w-40">Criar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}