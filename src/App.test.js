import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Gourmet Hub logo text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Gourmet Hub/i, { selector: '.logo-text' });
  expect(linkElement).toBeInTheDocument();
});
