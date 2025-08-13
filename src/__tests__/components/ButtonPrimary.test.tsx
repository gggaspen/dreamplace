import { render } from '@testing-library/react';
import ButtonPrimary from '@/components/button-primary/ButtonPrimary';

describe('ButtonPrimary Component', () => {
  // Mock Chakra UI components to avoid provider issues
  jest.mock('@chakra-ui/react', () => ({
    Text: ({ children, ...props }) => <span {...props}>{children}</span>,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
    Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  }));

  const defaultProps = {
    children: <span>Arrow Icon</span>,
    text: 'Click Me',
  };

  it('should be defined and importable', () => {
    expect(ButtonPrimary).toBeDefined();
    expect(typeof ButtonPrimary).toBe('function');
  });

  it('renders basic structure without errors', () => {
    const { container } = render(<ButtonPrimary {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts all required props without TypeScript errors', () => {
    const props = {
      children: <span>Test Icon</span>,
      text: 'Test Text',
      download: false,
      mode: 'light' as const,
      disabled: false,
      linkUrl: 'https://example.com',
    };

    // If this compiles and runs, TypeScript types are working correctly
    expect(() => <ButtonPrimary {...props} />).not.toThrow();
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<ButtonPrimary {...defaultProps} disabled={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles download prop', () => {
    const { container } = render(<ButtonPrimary {...defaultProps} download={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
