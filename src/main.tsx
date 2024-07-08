import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import menuItems from './utils/menuItems';

const elementChildren = menuItems.map(item => ({
  path: item.path,
  element: <item.component />
}))
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: elementChildren,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
