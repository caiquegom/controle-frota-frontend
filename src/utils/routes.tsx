import CargoForm from '@/pages/Cargo/CargoForm';
import menuItems from './menuItems';

const routes = menuItems.map((item) => ({
  path: item.path,
  element: <item.component />,
}));

routes.push(
  {
    path: '/cargo/add',
    element: <CargoForm />
  }
)

export default routes;
