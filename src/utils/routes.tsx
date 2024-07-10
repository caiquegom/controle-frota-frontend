import CargoForm from '@/pages/Cargo/CargoForm';
import RegionForm from '@/pages/Regions/RegionForm';
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
  }
)

export default routes;
