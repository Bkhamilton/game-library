import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { expect, it, jest } from '@jest/globals';
import { SessionControls, SessionResult } from '@/components/Session';

jest.mock('@/hooks/useTheme', () => ({
    __esModule: true,
    default: () => ({ text: '#111', background: '#fff' }),
}));

it('requires explicit resume and blocks resume/leave while a save error is unresolved', async () => {
    const resume = jest.fn();
    const leave = jest.fn();
    const retry = jest.fn();
    await render(<SessionControls status="paused" error={{ operation: 'checkpoint', cause: 'offline' }}
        onStart={jest.fn()} onPause={jest.fn()} onResume={resume}
        onRetry={retry} onLeave={leave} />);
    expect(resume).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save and leave' }));
    expect(resume).not.toHaveBeenCalled();
    expect(leave).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(retry).toHaveBeenCalledTimes(1);
});

it('pauses synchronously before opening help', async () => {
    const calls: string[] = [];
    await render(<SessionControls status="playing"
        onStart={jest.fn()} onPause={() => { calls.push('pause'); }}
        onResume={jest.fn()} onRetry={jest.fn()} onHelp={() => { calls.push('help'); }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'How to play' }));
    expect(calls).toEqual(['pause', 'help']);
});

it('does not open restart confirmation when the pause checkpoint fails', async () => {
    const pause = jest.fn<() => Promise<boolean>>().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const restart = jest.fn();
    await render(<SessionControls status="playing"
        onStart={jest.fn()} onPause={pause} onResume={jest.fn()}
        onRetry={jest.fn()} onRestart={restart} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Restart' }));
    expect(restart).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Restart' }));
    expect(restart).toHaveBeenCalledTimes(1);
});

it('keeps replay and home disabled until the caller confirms result persistence', async () => {
    const replay = jest.fn();
    const home = jest.fn();
    const { rerender } = await render(<SessionResult title="Draw" onReplay={replay} onHome={home} disabled />);
    await fireEvent.press(screen.getByRole('button', { name: 'Play again' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(replay).not.toHaveBeenCalled();
    expect(home).not.toHaveBeenCalled();
    await rerender(<SessionResult title="Draw" onReplay={replay} onHome={home} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(home).toHaveBeenCalledTimes(1);
});
