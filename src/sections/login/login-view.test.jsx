import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
// import LoginView from './LoginView';
import { LoginView } from '.';
jest.mock('axios');

describe('LoginView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login form', () => {
    render(<LoginView />);

    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});