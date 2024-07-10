import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import * as z from "zod";

// const onSubmit = async (data: any) => {
//   // const token = Cookies.get("token");

//   // if (!token) {
//   //   console.error("Token not found");
//   //   return;
//   // }
// };

export default function TruckForm() {
  const formSchema = z.object({
    name: z.string().min(3, "O nome da carga precisa ter pelo menos 3 caracteres."),
    type: z.enum(['eletronic', 'fuel', 'other']),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: undefined,
      description: ""
    },
  });
  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Cadastrar carga</h1>
      <Card className="w-full">
        <CardContent className="pt-3">
          <Form {...form}>
            <form className="flex flex-col gap-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da carga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de carga</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="eletronic">Eletrônico</SelectItem>
                      <SelectItem value="fuel">Combustível</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva a carga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}