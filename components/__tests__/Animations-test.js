import * as React from 'react';
import renderer from 'react-test-renderer';
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
  it('AnimatedButton renders correctly', () => {
    const tree = renderer.create(
      <AnimatedButton onPress={() => {}}>
        <Text>Test Button</Text>
      </AnimatedButton>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('FadeInView renders correctly', () => {
    const tree = renderer.create(
      <FadeInView>
        <Text>Fading content</Text>
      </FadeInView>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('PulseView renders correctly', () => {
    const tree = renderer.create(
      <PulseView>
        <Text>Pulsing content</Text>
      </PulseView>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('ShakeView renders correctly', () => {
    const tree = renderer.create(
      <ShakeView trigger={0}>
        <Text>Shake content</Text>
      </ShakeView>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('LoadingSpinner renders correctly', () => {
    const tree = renderer.create(
      <LoadingSpinner size="large" />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('VictoryAnimation renders correctly when visible', () => {
    const tree = renderer.create(
      <VictoryAnimation visible={true}>
        <Text>Victory!</Text>
      </VictoryAnimation>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('VictoryAnimation returns null when not visible', () => {
    const tree = renderer.create(
      <VictoryAnimation visible={false}>
        <Text>Victory!</Text>
      </VictoryAnimation>
    ).toJSON();
    expect(tree).toBeNull();
  });

  it('GameVictoryConfetti renders correctly when visible', () => {
    const tree = renderer.create(
      <GameVictoryConfetti visible={true} />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('GameVictoryConfetti returns null when not visible', () => {
    const tree = renderer.create(
      <GameVictoryConfetti visible={false} />
    ).toJSON();
    expect(tree).toBeNull();
  });
});
