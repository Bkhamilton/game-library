import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SelectGame from '../Modals/SelectGame';

jest.mock('@/constants/GameLogos', () => ({ GameLogos: {} }));
jest.mock('@/hooks/useTheme', () => ({
    __esModule: true,
    default: () => ({ primary: '#226622', grayBackground: '#dddddd' }),
}));
jest.mock('@/utils/DailyChallenge', () => ({ isDailyChallengeCompleted: jest.fn() }));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

it('explains Sudoku technique levels and starts the chosen level without changing the mode', async () => {
    const selectGame = jest.fn();
    await render(
        <SelectGame
            visible
            close={jest.fn()}
            game={{ title: 'Sudoku', description: 'Number puzzle' }}
            difficulties={['Easy', 'Medium', 'Hard', 'Extreme']}
            selectGame={selectGame}
        />
    );

    await fireEvent.press(screen.getByText('Difficulty:', { exact: false }));
    expect(screen.getByText(/Rated by solving techniques/)).toBeTruthy();
    expect(screen.getByText(/Requires naked\/hidden triples or X-Wing/)).toBeTruthy();
    await fireEvent.press(screen.getByText('Extreme'));
    await fireEvent.press(screen.getByText('New Game'));
    expect(selectGame).toHaveBeenCalledWith('Sudoku', 'Extreme', 'Classic');
});

it('does not show Sudoku technique claims for a different game', async () => {
    await render(
        <SelectGame
            visible
            close={jest.fn()}
            game={{ title: 'Minesweeper', description: 'Mine puzzle' }}
            difficulties={['Easy', 'Medium', 'Hard', 'Extreme']}
            selectGame={jest.fn()}
        />
    );
    await fireEvent.press(screen.getByText('Difficulty:', { exact: false }));
    expect(screen.queryByText(/Rated by solving techniques/)).toBeNull();
    expect(screen.queryByText(/Requires naked\/hidden triples or X-Wing/)).toBeNull();
});

it('continues a saved Classic run at its saved difficulty, not the current selection', async () => {
    const continueGame = jest.fn();
    await render(
        <SelectGame
            visible
            close={jest.fn()}
            game={{ title: 'Sudoku', description: 'Number puzzle' }}
            difficulties={['Easy', 'Medium', 'Hard', 'Extreme']}
            selectGame={jest.fn()}
            savedRuns={[
                { id: 'classic', identity: { difficulty: 'Hard', mode: 'Classic' } },
                { id: 'daily', identity: { difficulty: 'Easy', mode: 'Daily Challenge', dailyDate: '2026-11-18' } },
            ]}
            continueGame={continueGame}
        />
    );
    expect(screen.getByText('Hard')).toBeTruthy();
    expect(screen.queryByText(/2026-11-18/)).toBeNull();
    await fireEvent.press(screen.getByText('Continue'));
    expect(continueGame).toHaveBeenCalledWith('classic');
});

it('allows an older saved Daily to continue even when today is already complete', async () => {
    const continueGame = jest.fn();
    const checkDailyCompleted = jest.fn().mockResolvedValue(true);
    await render(
        <SelectGame
            visible
            close={jest.fn()}
            game={{ title: 'Sudoku', description: 'Number puzzle' }}
            difficulties={['Easy', 'Medium', 'Hard', 'Extreme']}
            selectGame={jest.fn()}
            savedRuns={[
                { id: 'yesterday', identity: { difficulty: 'Hard', mode: 'Daily Challenge', dailyDate: '2026-11-18' } },
            ]}
            continueGame={continueGame}
            checkDailyCompleted={checkDailyCompleted}
        />
    );
    await fireEvent.press(screen.getByText('Mode:', { exact: false }));
    await fireEvent.press(screen.getByText('Daily Challenge'));
    expect(await screen.findByText('Completed Today')).toBeTruthy();
    expect(screen.getByText('2026-11-18 · Hard')).toBeTruthy();
    await fireEvent.press(screen.getByText('Continue'));
    expect(continueGame).toHaveBeenCalledWith('yesterday');
});
