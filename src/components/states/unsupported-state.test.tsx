import { render, screen } from '@testing-library/react-native';

import { UnsupportedState } from '@/components/states';

describe('UnsupportedState', () => {
  it('renders the default title and the supplied reason', () => {
    render(<UnsupportedState reason="LightSensor is Android-only" />);
    expect(screen.getByText('Not available')).toBeTruthy();
    expect(screen.getByText('LightSensor is Android-only')).toBeTruthy();
  });

  it('honors a custom title', () => {
    render(<UnsupportedState title="No data" reason="Permission denied" />);
    expect(screen.getByText('No data')).toBeTruthy();
    expect(screen.getByText('Permission denied')).toBeTruthy();
  });
});
