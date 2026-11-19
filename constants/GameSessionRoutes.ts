import Difficulties from './Difficulties';
import GameModes from './GameModes';
import games from '../data/games.json';

const sessionRoutes = {
    Sudoku: '/sudoku',
    Minesweeper: '/minesweeper',
    'Word Search': '/wordSearch',
    Crossword: '/crossword',
    '2048': '/2048',
    'Memory Match': '/memorymatch',
    'Simon Says': '/simonsays',
    'Connect Four': '/connectfour',
} as const;

export type SessionGameTitle = keyof typeof sessionRoutes;

export function getSessionGame(title: string) {
    if (!isSessionGame(title)) return undefined;
    const game = games.find(entry => entry.title === title);
    if (!game) throw new Error(`Missing session game catalog entry: ${title}`);
    return {
        ...game,
        title,
        pathname: sessionRoutes[title],
        modes: GameModes[title],
        difficulties: Difficulties[title],
    };
}

export function getSessionGameById(gameId: number) {
    const game = games.find(entry => entry.id === gameId);
    return game && getSessionGame(game.title);
}

export function isSessionGame(title: string): title is SessionGameTitle {
    return Object.prototype.hasOwnProperty.call(sessionRoutes, title);
}
