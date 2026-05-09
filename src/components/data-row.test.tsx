import { render, screen } from '@testing-library/react-native';

import { DataRow } from './data-row';

describe('DataRow', () => {
  it('renders the label and a string value', () => {
    render(<DataRow label="OS Version" value="17.4" />);
    expect(screen.getByText('OS Version')).toBeTruthy();
    expect(screen.getByText('17.4')).toBeTruthy();
  });

  it('renders an em-dash when the value is null', () => {
    render(<DataRow label="Carrier" value={null} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('renders an em-dash when the value is undefined', () => {
    render(<DataRow label="Carrier" value={undefined} />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('renders Yes/No for booleans', () => {
    render(<DataRow label="Is device" value={true} />);
    expect(screen.getByText('Yes')).toBeTruthy();
  });

  it('coerces numbers to strings', () => {
    render(<DataRow label="Year class" value={2022} />);
    expect(screen.getByText('2022')).toBeTruthy();
  });

  it('exposes a single accessibility label combining label and value', () => {
    render(<DataRow label="Brand" value="Apple" />);
    expect(screen.getByLabelText('Brand: Apple')).toBeTruthy();
  });
});
