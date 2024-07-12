import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatToReal } from "@/utils/helperFunctions";
import { DeliveriesDay } from "./components/DeliveriesDay";

export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-x-2 gap-y-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de caminhões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Número de entregas do dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de caminhões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor das entregas do dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatToReal(5000)}</div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Entregas de hoje</CardTitle>
            <CardDescription>
              5 entregas serão feitas hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveriesDay />
          </CardContent>
        </Card>
      </div>
    </>
  )
}