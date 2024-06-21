import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
// import LoginView from './LoginView';
import { LoginView } from '.';
// jest.mock('axios');
jest.mock('axios', () => ({
  post: jest.fn(() =>
    Promise.resolve({ data: { isSuccess: true, result: { token: 'mocked-token' } } })
  ),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: () => <div>Mocked Box</div>,
}));
jest.mock('src/theme/css'); // Mock bgGradient
jest.mock('src/components/iconify'); // Mock Iconify
describe('LoginView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage.__proto__, 'setItem');
  });
  test('renders the login form', () => {
    render(<LoginView />);

    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles form submission successfully', async () => {
    render(<LoginView />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mocked-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles form submission failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          errorMessages: ['Invalid username or password'],
        },
      },
    });

    render(<LoginView />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  test('displays a general error message on server error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server error'));

    render(<LoginView />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Đã có lỗi xảy ra, vui lòng thử lại sau.')).toBeInTheDocument();
    });
  });
});
