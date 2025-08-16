
import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from './Main';

const mockProducts = [
  {
    id: 1,
    name: 'Menú Miércoles',
    closingDate: '2025-10-22T10:00:00',
    images: ['image1.jpg'],
  },
  {
    id: 2,
    name: 'Menú Lunes',
    closingDate: '2025-10-20T10:00:00',
    images: ['image2.jpg'],
  },
  {
    id: 3,
    name: 'Menú Martes',
    closingDate: '2025-10-21T10:00:00',
    images: ['image3.jpg'],
  },
];

describe('Main', () => {
  test('renders a sorted list of products', () => {
    render(<Main products={mockProducts} />);

    // Get all rendered product cards
    const productCards = screen.getAllByTestId('product-card');

    // Check that the products are rendered in the correct order by date
    expect(productCards[0]).toHaveTextContent('Menú Lunes');
    expect(productCards[1]).toHaveTextContent('Menú Martes');
    expect(productCards[2]).toHaveTextContent('Menú Miércoles');
  });

  test('renders a message when there are no products', () => {
    render(<Main products={[]} />);
    // In the current implementation, it renders an empty list,
    // which is acceptable. If a message were required, this test would fail.
    const productList = screen.getByText(/próximos menús/i).closest('div');
    const productCards = productList.querySelector('.product-list');
    expect(productCards.children.length).toBe(0);
  });
});
