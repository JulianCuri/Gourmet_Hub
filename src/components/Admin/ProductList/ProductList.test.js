
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './ProductList';

const mockProducts = [
  {
    id: 1,
    name: 'Menú Lunes',
    closingDate: '2025-10-20T10:00:00',
  },
  {
    id: 2,
    name: 'Menú Martes',
    closingDate: '2025-10-21T10:00:00',
  },
];

describe('ProductList', () => {
  test('renders a list of products', () => {
    render(
      <BrowserRouter>
        <ProductList products={mockProducts} />
      </BrowserRouter>
    );

    // Check for table headers
    expect(screen.getByText('Id')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Cierre')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();

    // Check for product data
    expect(screen.getByText('Menú Lunes')).toBeInTheDocument();
    expect(screen.getByText('Menú Martes')).toBeInTheDocument();

    // Check for formatted dates
    expect(screen.getByText('20/10/2025, 10:00')).toBeInTheDocument();
    expect(screen.getByText('21/10/2025, 10:00')).toBeInTheDocument();
  });

  test('renders a message when there are no products', () => {
    render(
      <BrowserRouter>
        <ProductList products={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument();
  });
});
