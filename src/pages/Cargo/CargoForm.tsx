import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const FormSchema = z.object({
  type: z.string().nonempty({ message: "Selecione um tipo de carga." }),
  name: z.string().min(3, { message: "O nome da carga deve ter pelo menos 3 caracteres" }),
  description: z.string().min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
});

function CargoForm() {
  const navigate = useNavigate();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      name: "",
      description: "",
    }
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await axios.post('/cargo', values);
      form.reset();
      toast({
        title: "Carga cadastrada com sucesso!",
        description: `Nova carga ${values.name} cadastrada`,
        action: <ToastAction altText="Visualizar" onClick={() => navigate('/cargos')}>Visualizar</ToastAction>,
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold pb-4">Cadastrar carga</h1>
      <Card>
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-2 gap-y-4 justify-center">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da carga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />


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

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Digite o nome da carga" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="secondary" className="w-40" onClick={() => navigate('/cargos')}>Voltar</Button>
                <Button type="submit" className="w-40">Cadastrar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}

export default CargoForm;