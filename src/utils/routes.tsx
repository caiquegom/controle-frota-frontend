import CargoForm from '@/pages/Cargo/CargoForm';
import DriverForm from '@/pages/Drivers/DriverForm';
import RegionForm from '@/pages/Regions/RegionForm';
import TruckForm from '@/pages/Truck/TruckForm';
import menuItems from './menuItems';

const routes = menuItems.map((item) => ({
  path: item.path,
  element: <item.component />,
}));

routes.push(
  {
    path: '/cargo/add',
    element: <CargoForm />
  },
  {
    path: '/region/add',
    element: <RegionForm />
  },
  {
    path: '/truck/add',
    element: <TruckForm />
  },
  {
    path: '/driver/add',
    element: <DriverForm />
  }

)

export default routes;
