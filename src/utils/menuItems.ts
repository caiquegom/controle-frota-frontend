import Cargo from '@/pages/Cargo';
import Dashboard from '@/pages/Dashboard';
import Deliveries from '@/pages/Deliveries';
import { ClipboardList, HomeIcon, LucideProps, Package } from 'lucide-react';

type menuItemsType = {
  name: string;
  path: string;
  component: () => React.JSX.Element;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  roles: string[];
};

const menuItems: menuItemsType[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: Dashboard,
    icon: HomeIcon,
    roles: ['admin'],
  },
  {
    name: 'Entregas',
    path: '/deliveries',
    component: Deliveries,
    icon: ClipboardList,
    roles: ['admin', 'driver'],
  },
  {
    name: 'Cargas',
    path: '/cargos',
    component: Cargo,
    icon: Package,
    roles: ['admin'],
  },
];

export default menuItems;
