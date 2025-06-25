import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render with given text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct CSS class for primary variant', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('primary');
  });

  it('should apply correct CSS class for secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('secondary');
  });

  it('should show loading spinner when loading prop is true', () => {
    render(<Button loading={true}>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    // Add specific assertion for loading spinner if it has a test id
  });

  it('should not call onClick when button is loading', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} loading={true}>Loading Button</Button>);
    
    fireEvent.click(screen.getByText('Loading Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
  
});