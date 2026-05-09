import { render, screen } from '@testing-library/react-native';

import { CategorySection } from './category-section';
import type { Feature } from '@/constants/features';

const features: Feature[] = [
  {
    id: 'device',
    title: 'Device',
    description: 'Model, brand, OS.',
    category: 'device-info',
    route: '/feature/device',
    status: 'ready',
  },
  {
    id: 'battery',
    title: 'Battery',
    description: 'Charge level.',
    category: 'device-info',
    route: '/feature/battery',
    status: 'planned',
  },
];

describe('CategorySection', () => {
  it('renders the category label', () => {
    render(<CategorySection category="device-info" features={features} />);
    expect(screen.getByText('Device Info')).toBeTruthy();
  });

  it('renders one tile per supplied feature', () => {
    render(<CategorySection category="device-info" features={features} />);
    expect(screen.getByText('Device')).toBeTruthy();
    expect(screen.getByText('Battery')).toBeTruthy();
  });
});
