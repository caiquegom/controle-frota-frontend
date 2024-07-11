import Cargo from '@/pages/Cargo';
import Dashboard from '@/pages/Dashboard';
import Deliveries from '@/pages/Deliveries';
import Drivers from '@/pages/Drivers';
import Region from '@/pages/Regions';
import Settings from '@/pages/Settings';
import Truck from '@/pages/Truck';
import {
  ClipboardList,
  HomeIcon,
  LandPlot,
  LucideProps,
  Package,
  SettingsIcon,
  TruckIcon,
  User,
} from 'lucide-react';

type menuItemsType = {
  name: string;
  path: string;
  component: () => React.JSX.Element;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
};

const menuItems: menuItemsType[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: Dashboard,
    icon: HomeIcon,
  },
  {
    name: 'Entregas',
    path: '/deliveries',
    component: Deliveries,
    icon: ClipboardList,
  },
  {
    name: 'Cargas',
    path: '/cargos',
    component: Cargo,
    icon: Package,
  },
  {
    name: 'Caminhões',
    path: '/trucks',
    component: Truck,
    icon: TruckIcon,
  },
  {
    name: 'Motoristas',
    path: '/drivers',
    component: Drivers,
    icon: User,
  },
  {
    name: 'Regiões',
    path: '/regions',
    component: Region,
    icon: LandPlot,
  },
  {
    name: 'Configurações',
    path: '/settings',
    component: Settings,
    icon: SettingsIcon,
  },
];

export default menuItems;
