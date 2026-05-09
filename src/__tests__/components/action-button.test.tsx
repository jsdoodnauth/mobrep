import { fireEvent, render, screen } from '@testing-library/react-native';

import { ActionButton } from '@/components/action-button';

describe('ActionButton', () => {
  it('renders the label and calls onPress', () => {
    const onPress = jest.fn();
    render(<ActionButton label="Lock portrait" onPress={onPress} category="hardware" />);
    fireEvent.press(screen.getByLabelText('Lock portrait'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('combines label and subtitle into a single accessibility label', () => {
    render(
      <ActionButton
        label="Vibrate"
        subtitle="Trigger a medium impact"
        onPress={() => {}}
        category="hardware"
      />,
    );
    expect(screen.getByLabelText('Vibrate. Trigger a medium impact')).toBeTruthy();
  });

  it('disables the press handler when disabled', () => {
    const onPress = jest.fn();
    render(
      <ActionButton label="Authenticate" onPress={onPress} category="hardware" disabled />,
    );
    fireEvent.press(screen.getByLabelText('Authenticate'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
