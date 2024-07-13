import { Badge } from '@/components/ui/badge';
import { CargoProps } from '@/pages/Cargo';
import { DriverProps } from '@/pages/Drivers';
import { RegionProps } from '@/pages/Regions';
import { TruckProps } from '@/pages/Truck';

type DeliveryItemProps = {
  driver: DriverProps;
  cargo: CargoProps;
  truck: TruckProps;
  destiny: RegionProps;
  totalValue: string;
  hasInsurance: boolean;
  isValuable: boolean;
  isDangerous: boolean;
};

const cargoTypes = {
  eletronic: 'Eletrônico',
  fuel: 'Combustível',
  other: 'Outro',
};

export default function DeliveryItem({
  driver,
  cargo,
  truck,
  destiny,
  totalValue,
  hasInsurance,
  isValuable,
  isDangerous,
}: DeliveryItemProps) {
  return (
    <div className="grid grid-cols-6 items-center hover:bg-gray-50 py-3 border rounded-md">
      <div className="ml-4 space-y-1">
        <p className="text-sm font-semibold leading-none">{destiny.name}</p>
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{driver?.name}</p>
        <p className="text-sm text-muted-foreground">{driver?.email}</p>
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{cargo?.name}</p>
        <p className="text-sm text-muted-foreground">
          {cargoTypes[cargo?.type]}
        </p>
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{truck?.plate}</p>
        <p className="text-sm text-muted-foreground">
          {truck?.brand} - {truck?.model}
        </p>
      </div>
      <div className="ml-4 space-y-1 flex gap-1 items-end">
        {!(hasInsurance || isDangerous || isValuable) && <span className='text-sm text-muted-foreground'>Sem indicadores</span>}
        {hasInsurance && (
          <Badge className="bg-blue-300 hover:bg-blue-400 text-black w-20 justify-center">
            Seguro
          </Badge>
        )}
        {isDangerous && (
          <Badge className="bg-red-400 hover:bg-red-500 text-black w-20 justify-center">
            Perigoso
          </Badge>
        )}
        {isValuable && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black w-20 justify-center">
            Valioso
          </Badge>
        )}
      </div>
      <div className="ml-auto font-medium mr-3 text-green-500">+ {totalValue}</div>
    </div>
  );
}
