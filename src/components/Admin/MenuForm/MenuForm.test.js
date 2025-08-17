
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductForm from './ProductForm';

// Mock the useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('ProductForm', () => {
  test('renders the form and submits data correctly', () => {
    const addProduct = jest.fn();
    
    render(
      <BrowserRouter>
        <ProductForm addProduct={addProduct} />
      </BrowserRouter>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/nombre del producto\/servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha y hora de cierre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar producto/i })).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/nombre del producto\/servicio/i), {
      target: { value: 'Menú de Prueba' },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Descripción de prueba' },
    });
    fireEvent.change(screen.getByLabelText(/fecha y hora de cierre/i), {
      target: { value: '2025-12-31T12:00' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /guardar producto/i }));

    // Check if addProduct was called with the correct data
    expect(addProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Menú de Prueba',
        description: 'Descripción de prueba',
        closingDate: '2025-12-31T12:00',
      })
    );

    // Check if the user is redirected
    expect(mockedNavigate).toHaveBeenCalledWith('/administracion');
  });
});
