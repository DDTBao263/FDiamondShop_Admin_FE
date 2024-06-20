import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
// import LoginView from './LoginView';
import { LoginView } from '.';
// jest.mock('axios');
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { isSuccess: true, result: { token: 'mocked-token' } } })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: () => <div>Mocked Box</div>,
}));
jest.mock('src/theme/css'); // Mock bgGradient
jest.mock('src/components/iconify'); // Mock Iconify
describe('LoginView', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });
  test('renders the login form', () => {
    render(<LoginView />);

    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});