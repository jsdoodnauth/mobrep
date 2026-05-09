import { fireEvent, render, screen } from '@testing-library/react-native';

import { FeatureTile } from './feature-tile';
import type { Feature } from '@/constants/features';

const readyFeature: Feature = {
  id: 'device',
  title: 'Device',
  description: 'Model, brand, OS, memory, and year class.',
  category: 'device-info',
  route: '/feature/device',
  status: 'ready',
};

const plannedFeature: Feature = {
  ...readyFeature,
  id: 'battery',
  title: 'Battery',
  description: 'Charge level and charging state.',
  route: '/feature/battery',
  status: 'planned',
};

describe('FeatureTile', () => {
  it('renders the feature title and description', () => {
    render(<FeatureTile feature={readyFeature} />);
    expect(screen.getByText('Device')).toBeTruthy();
    expect(screen.getByText(readyFeature.description)).toBeTruthy();
  });

  it('shows a Soon pill for planned features', () => {
    render(<FeatureTile feature={plannedFeature} />);
    expect(screen.getByText('Soon')).toBeTruthy();
  });

  it('does not show a pill for ready features', () => {
    render(<FeatureTile feature={readyFeature} />);
    expect(screen.queryByText('Soon')).toBeNull();
  });

  it('invokes the press handler for ready features', () => {
    const onPress = jest.fn();
    render(<FeatureTile feature={readyFeature} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText(/^Device\./));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the press handler for planned features', () => {
    const onPress = jest.fn();
    render(<FeatureTile feature={plannedFeature} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText(/^Battery\./));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('marks planned features as disabled for assistive tech', () => {
    render(<FeatureTile feature={plannedFeature} />);
    const tile = screen.getByLabelText(/^Battery\./);
    expect(tile.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
  });
});
