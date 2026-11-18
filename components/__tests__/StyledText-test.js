import * as React from 'react';
import { render } from '@testing-library/react-native';
import { MonoText } from '../StyledText';

jest.mock('@/hooks/useTheme', () => () => ({ text: '#000000' }));

it('renders its children in SpaceMono', async () => {
  const screen = await render(<MonoText>Snapshot test!</MonoText>);
  expect(screen.getByText('Snapshot test!')).toHaveStyle({ fontFamily: 'SpaceMono' });
});
