import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { 
  AnimatedButton, 
  FadeInView, 
  PulseView, 
  ShakeView,
  LoadingSpinner,
  VictoryAnimation,
  GameVictoryConfetti
} from '../animations';

describe('Animation Components', () => {
  it('AnimatedButton renders correctly', async () => {
    const tree = (await render(
      <AnimatedButton onPress={() => {}}>
        <Text>Test Button</Text>
      </AnimatedButton>
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('FadeInView renders correctly', async () => {
    const tree = (await render(
      <FadeInView>
        <Text>Fading content</Text>
      </FadeInView>
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('PulseView renders correctly', async () => {
    const tree = (await render(
      <PulseView>
        <Text>Pulsing content</Text>
      </PulseView>
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('ShakeView renders correctly', async () => {
    const tree = (await render(
      <ShakeView trigger={0}>
        <Text>Shake content</Text>
      </ShakeView>
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('LoadingSpinner renders correctly', async () => {
    const tree = (await render(
      <LoadingSpinner size="large" />
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('VictoryAnimation renders correctly when visible', async () => {
    const tree = (await render(
      <VictoryAnimation visible={true}>
        <Text>Victory!</Text>
      </VictoryAnimation>
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('VictoryAnimation returns null when not visible', async () => {
    const tree = (await render(
      <VictoryAnimation visible={false}>
        <Text>Victory!</Text>
      </VictoryAnimation>
    )).toJSON();
    expect(tree).toBeNull();
  });

  it('GameVictoryConfetti renders correctly when visible', async () => {
    const tree = (await render(
      <GameVictoryConfetti visible={true} />
    )).toJSON();
    expect(tree).toBeTruthy();
  });

  it('GameVictoryConfetti returns null when not visible', async () => {
    const tree = (await render(
      <GameVictoryConfetti visible={false} />
    )).toJSON();
    expect(tree).toBeNull();
  });
});
