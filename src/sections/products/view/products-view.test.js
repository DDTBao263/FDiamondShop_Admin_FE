import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductsView from './products-view';

jest.mock('axios', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        result: [
          {
            productId: 1,
            productName: 'Product 1',
            basePrice: 100,
            quantity: 10,
            subCategoryName: 'Shape 1',
            isVisible: true,
          },
          {
            productId: 2,
            productName: 'Product 2',
            basePrice: 200,
            quantity: 20,
            subCategoryName: 'Shape 2',
            isVisible: false,
          },
        ],
      },
    })
  ),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Container: ({ children }) => <div>{children}</div>,
  Snackbar: ({ open, autoHideDuration, onClose, children }) =>
    open ? <div>{children}</div> : null,
  Alert: ({ onClose, severity, children }) => <div>{children}</div>,
}));

describe('ProductsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the ProductsView component', async () => {
    render(
      <Router>
        <ProductsView />
      </Router>
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('New Product')).toBeInTheDocument();

    // Wait for the data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('navigates to the new product page on button click', () => {
    render(
      <Router>
        <ProductsView />
      </Router>
    );

    const newProductButton = screen.getByText('New Product');
    fireEvent.click(newProductButton);

    expect(mockNavigate).toHaveBeenCalledWith('/products/new');
  });

  test('displays a success snackbar when state.showSnackbar is true', async () => {
    const location = { state: { showSnackbar: true } };

    render(
      <Router>
        <ProductsView location={location} />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Product created successfully!')).toBeInTheDocument();
    });
  });

  test('filters products by ID', async () => {
    render(
      <Router>
        <ProductsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search product by ID'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).toBeNull();
    });
  });

  test('displays "No data available" when no products match the filter', async () => {
    render(
      <Router>
        <ProductsView />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search product by ID'), {
      target: { value: '99' },
    });

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });
});
