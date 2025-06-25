import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import Form from './Form';

describe('Form Component', () => {
  const defaultProps = {
    label: 'Test Form',
    loading: false,
    formEntries: [
      { name: 'username', placeholder: 'Enter username', extraProps: { value: '', onChange: jest.fn() } },
      { name: 'password', placeholder: 'Enter password', extraProps: { value: '', onChange: jest.fn() } },
    ],
    onFormSubmit: jest.fn(),
    submitText: 'Submit',
  };

  it('should render form elements', () => {
    render(<Form {...defaultProps} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('should call onFormSubmit handler when form is submitted', async () => {
    defaultProps.onFormSubmit.mockImplementation(event => {
      event.preventDefault();
    });
    render(<Form {...defaultProps} />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton); // Simulate button click
    expect(defaultProps.onFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button when loading is true', () => {
    render(<Form {...defaultProps} loading={true} />);
    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('should call onChange handlers for form entries', async () => {
    render(<Form {...defaultProps} />);
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    expect(defaultProps.formEntries[0].extraProps.onChange).toHaveBeenCalled();
    expect(defaultProps.formEntries[1].extraProps.onChange).toHaveBeenCalled();
  });
});
