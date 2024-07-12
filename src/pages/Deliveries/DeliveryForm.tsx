import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import useAxios from '@/hooks/useAxios';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverClose } from '@radix-ui/react-popover';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { CargoProps } from '../Cargo';
import { RegionProps } from '../Regions';
import { TruckProps } from '../Truck';

const FormSchema = z.object({
  destinyId: z.coerce.number({ message: "O campo é obrigatório" }),
  truckId: z.coerce.number({ message: "O campo é obrigatório" }),
  driverId: z.coerce.number({ message: "O campo é obrigatório" }),
  driverName: z.string(),
  cargoId: z.coerce.number({ message: "O campo é obrigatório" }),
  value: z.coerce.number().min(0, 'O valor é obrigatório'),
  totalValue: z.number(),
  tax: z.number(),
  taxValue: z.number(),
  deliveryDate: z.date({ message: 'O campo é obrigatório' }).refine((data) => data > new Date(), { message: 'A data de entrega deve ser no futuro' }),
  hasInsurance: z.boolean().default(false).optional(),
  isDangerous: z.boolean().default(false).optional(),
  isValuable: z.boolean().default(false).optional(),
});

export default function DeliveryForm() {
  const navigate = useNavigate();
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true)
  const [taxValue, setTaxValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const [regionOptions, setRegionOptions] = useState<RegionProps[] | null>(
    null,
  );
  const [cargoOptions, setCargoOptions] = useState<CargoProps[] | null>(null);
  const [truckOptions, setTruckOptions] = useState<TruckProps[] | null>(null);

  const { response: regionsReponse } = useAxios({
    url: '/regions',
    method: 'get',
  });
  const { response: cargoResponse } = useAxios({
    url: '/cargos',
    method: 'get',
  });
  const { response: truckResponse } = useAxios({
    url: '/trucks/availables',
    method: 'get',
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      destinyId: undefined,
      truckId: undefined,
      driverId: undefined,
      driverName: 'Nenhum motorista definido',
      cargoId: undefined,
      value: 0,
      totalValue: 0,
      tax: 0,
      taxValue: 0,
      deliveryDate: undefined,
      hasInsurance: false,
    },
  });

  const handleChangeDestiny = (value: string) => {
    form.setValue('destinyId', Number(value));

    const destiny = regionOptions?.find(
      (region) => region.id === Number(value),
    );
    form.setValue('tax', Number(destiny!.tax * 100));
  };

  const handleChangeCargo = (value: string) => {
    form.setValue("cargoId", Number(value))

    const cargo = cargoOptions?.find(cargo => cargo.id === Number(value))

    if (cargo?.type !== 'eletronic') {
      form.setValue("hasInsurance", false)
      setIsCheckboxDisabled(true)
    } else {
      setIsCheckboxDisabled(false)
    }

    if (cargo?.type === 'fuel') {
      form.setValue("isDangerous", true)
    } else {
      form.setValue("isDangerous", false)
    }
  }

  const handleChangeTruck = (value: string) => {
    form.setValue("truckId", Number(value))

    const truck = truckOptions?.find(
      (truck) => truck.id === Number(value),
    );

    form.setValue("driverId", Number(truck?.driver.id))
    form.setValue("driverName", truck?.driver.name || form.getValues().driverName)
  }

  const updateValues = () => {
    const tax = Number(form.getValues().tax) || 0;
    const value = Number(form.getValues().value) || 0;

    const calculatedTaxValue = Number(((tax / 100) * value).toFixed(2));
    const calculatedTotalValue = Number((value + calculatedTaxValue).toFixed(2));

    setTaxValue(calculatedTaxValue);
    setTotalValue(calculatedTotalValue);

    form.setValue('isValuable', false)
    form.setValue('taxValue', calculatedTaxValue);
    form.setValue('totalValue', calculatedTotalValue);

    if (calculatedTotalValue >= 30000) {
      form.setValue('isValuable', true)
    }

    form.watch()
  };

  useEffect(() => {
    updateValues();
  }, [form.getValues().tax, form.getValues().value]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await axios.post('/delivery', { ...values, deliveryDate: new Date(values.deliveryDate) });
      form.reset();
      form.setValue('destinyId', 0)
      form.setValue('cargoId', 0)
      form.setValue('truckId', 0)

      toast({
        title: 'Entrega cadastrada com sucesso!',
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
          variant: "destructive"
        });
      }
    }
  }

  useEffect(() => {
    if (!regionsReponse || !cargoResponse || !truckResponse) return;

    setRegionOptions(regionsReponse.data);
    setCargoOptions(cargoResponse.data);
    setTruckOptions(truckResponse.data);
  }, [regionsReponse, cargoResponse, truckResponse]);

  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Criar nova entrega</h1>
      <Card className="w-full">
        <CardContent className="pt-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-3 gap-x-2 gap-y-4"
            >
              <h2 className="text-lg font-semibold mb-2 col-span-3 mt-2">
                Dados da entrega
              </h2>
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de entrega</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/y")
                            ) : (
                              <span>Selecionar data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <PopoverClose>
                          <Calendar
                            mode="single"
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus

                          />
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinyId"
                render={() => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <Select onValueChange={handleChangeDestiny}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a região" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regionOptions?.map((option) => (
                          <SelectItem key={option.id} value={String(option.id)}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cargoId"
                render={() => (
                  <FormItem>
                    <FormLabel>Carga</FormLabel>
                    <FormControl>
                      <Select onValueChange={handleChangeCargo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a carga" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargoOptions?.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                            >
                              {option.name}
                            </SelectItem>
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
                render={() => (
                  <FormItem>
                    <FormLabel>Caminhão</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => {
                        handleChangeTruck(value)
                      }
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o caminhão" />
                        </SelectTrigger>
                        <SelectContent>
                          {truckOptions?.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>{`${option.plate} - ${option.brand} ${option.model}`}</SelectItem>
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
                name="driverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Digite o valor"
                        {...field}
                        onChange={(e) => {
                          form.setValue("value", Number(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da taxa (R$)</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        type="number"
                        {...field}
                        value={taxValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor total (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled
                        {...field}
                        value={totalValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h2 className="text-lg font-semibold mb-2 col-span-3 mt-2">
                Indicadores
              </h2>
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
                    <span className="space-y-1 leading-none">
                      <FormLabel className="cursor-not-allowed">
                        Carga perigosa
                      </FormLabel>
                    </span>
                    <FormMessage />
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
                    <span className="space-y-1 leading-none">
                      <FormLabel className="cursor-not-allowed">
                        Carga valiosa
                      </FormLabel>
                    </span>
                    <FormMessage />

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasInsurance"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${isCheckboxDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <FormControl>
                      <Checkbox
                        disabled={isCheckboxDisabled}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="space-y-1 leading-none">
                      <FormLabel>Garantir seguro de carga</FormLabel>
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-3 flex gap-2 justify-end mt-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-40"
                  onClick={() => navigate('/deliveries')}
                >
                  Voltar
                </Button>
                <Button type="submit" className="w-40">
                  Criar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card >
    </>
  );
}
