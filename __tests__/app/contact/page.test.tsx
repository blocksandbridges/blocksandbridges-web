import { render, screen, fireEvent } from '@testing-library/react';
import Contact from '@/app/contact/page';

const mockSendForm = jest.fn();
const mockSwalFire = jest.fn();

jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    sendForm: (...args: unknown[]) => mockSendForm(...args),
  },
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: (...args: unknown[]) => mockSwalFire(...args),
  },
}));

jest.mock('@/app/lib/constants', () => {
  const actual = jest.requireActual('@/app/lib/constants');
  return {
    ...actual,
    envConfig: {
      ...actual.envConfig,
      emailjs: {
        serviceId: 'test-service',
        templateId: 'test-template',
        userId: 'test-user',
      },
    },
  };
});

describe('Contact page', () => {
  beforeEach(() => {
    mockSendForm.mockReset();
    mockSwalFire.mockReset();
  });

  it('renders the page title and intro', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { level: 1, name: /contact/i })).toBeInTheDocument();
    expect(screen.getByText(/our team is here for you/i)).toBeInTheDocument();
  });

  it('renders email link to Blocks and Bridges', () => {
    render(<Contact />);
    const emailLink = screen.getByRole('link', { name: /info@blocksandbridges\.ca/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:info@blocksandbridges.ca');
  });

  it('renders the contact form', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  describe('EmailJS form submission', () => {
    it('calls emailjs.sendForm with form element and publicKey, then shows success and resets form', async () => {
      mockSendForm.mockResolvedValueOnce({});

      render(<Contact />);

      const emailInput = screen.getByLabelText(/email address/i);
      const nameInput = screen.getByLabelText(/your name/i);
      const messageInput = screen.getByLabelText(/message/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(messageInput, { target: { value: 'Hello!' } });

      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      await Promise.resolve();
      await Promise.resolve();

      expect(mockSendForm).toHaveBeenCalledTimes(1);
      const [serviceId, templateId, formElement, options] = mockSendForm.mock.calls[0];
      expect(serviceId).toBe('test-service');
      expect(templateId).toBe('test-template');
      expect(formElement).toBe(form);
      expect(options).toEqual({ publicKey: 'test-user' });

      expect(mockSwalFire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Message Sent Successfully',
      });

      expect(emailInput).toHaveValue('');
      expect(nameInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });

    it('shows error alert when emailjs.sendForm fails', async () => {
      mockSendForm.mockRejectedValueOnce({ text: 'Network error' });

      render(<Contact />);

      const form = screen.getByLabelText(/email address/i).closest('form');
      fireEvent.submit(form!);

      await Promise.resolve();
      await Promise.resolve();

      expect(mockSwalFire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Oops, something went wrong',
        text: 'Network error',
      });
    });
  });
});
