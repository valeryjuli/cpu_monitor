import { render, screen } from '@testing-library/react';
import CpuDashboard from './CpuDashboard';

test('renders learn react link', () => {
  render(<CpuDashboard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
