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
