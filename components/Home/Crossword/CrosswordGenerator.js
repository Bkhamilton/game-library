export class CrosswordGenerator {
    constructor(crosswordBank, boardSize = 15) {
        this.boardSize = boardSize;
        this.board = Array.from({ length: boardSize }, () => 
            Array.from({ length: boardSize }, () => '')
        );
        this.crosswordBank = crosswordBank;
        this.placedWords = [];
    }
  
    getAllIndices(word, char) {
        return [...word].reduce((a, e, i) => (e === char ? a.concat(i) : a), []);
    }

    generate() {
        this.placeStartingWord();
        let attempts = 0;
        while (this.placedWords.length < 6 && attempts < 100) {
          if (this.tryPlaceNextWord()) {
            attempts = 0;
          } else {
            attempts++;
          }
        }
        return {
          board: this.board,
          placedWords: this.placedWords
        };
    }


      
    placeStartingWord() {
        const startingWord = this.getRandomWord();
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const mid = Math.floor(this.boardSize / 2);
        
        let startX = mid;
        let startY = mid;
        
        if (direction === 'horizontal') {
          startX = mid - Math.floor(startingWord.length / 2);
        } else {
          startY = mid - Math.floor(startingWord.length / 2);
        }
        
        this.placeWord(startingWord, direction, startX, startY);
    }

    tryPlaceNextWord() {
        const viableOptions = [];
        
        // Search through all placed words and their characters
        this.placedWords.forEach(placedWord => {
          const word = placedWord.word;
          const dir = placedWord.direction;
          
          [...word].forEach((char, i) => {
            const x = dir === 'horizontal' ? placedWord.startX + i : placedWord.startX;
            const y = dir === 'vertical' ? placedWord.startY + i : placedWord.startY;
            
            // Find words that can cross at this character
            this.findCrossingWords(char).forEach(candidate => {
              const crossIndices = this.getAllIndices(candidate.word, char);
              
              crossIndices.forEach(j => {
                const newDir = dir === 'horizontal' ? 'vertical' : 'horizontal';
                const [startX, startY] = this.calcStartPos(x, y, j, newDir, candidate.word.length);
                
                if (this.isValidPlacement(candidate.word, newDir, startX, startY, x, y)) {
                  viableOptions.push({
                    word: candidate,
                    direction: newDir,
                    startX,
                    startY
                  });
                }
              });
            });
          });
        });
      
        if (viableOptions.length === 0) return false;
        
        // Randomly select and place
        const selected = viableOptions[Math.floor(Math.random() * viableOptions.length)];
        this.placeWord(selected.word.word, selected.direction, selected.startX, selected.startY);
        return true;
    }

    isValidPlacement(word, direction, startX, startY, crossX, crossY) {
        // Check boundaries
        if (startX < 0 || startY < 0) return false;
        if (direction === 'horizontal' && startX + word.length > this.boardSize) return false;
        if (direction === 'vertical' && startY + word.length > this.boardSize) return false;
      
        // Check overlaps and adjacency
        for (let i = 0; i < word.length; i++) {
          const x = direction === 'horizontal' ? startX + i : startX;
          const y = direction === 'vertical' ? startY + i : startY;
          
          // Check if crossing point matches
          if (x === crossX && y === crossY) {
            if (word[i] !== this.board[y][x]) return false;
            continue;
          }
          
          // Check cell is empty
          if (this.board[y][x] !== '') return false;
          
          // Check adjacency rules
          if (direction === 'horizontal') {
            if (y > 0 && this.board[y - 1][x] !== '') return false;
            if (y < this.boardSize - 1 && this.board[y + 1][x] !== '') return false;
          } else {
            if (x > 0 && this.board[y][x - 1] !== '') return false;
            if (x < this.boardSize - 1 && this.board[y][x + 1] !== '') return false;
          }
        }
        return true;
    }

    getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.crosswordBank.length);
        return this.crosswordBank[randomIndex];
    }

    findCrossingWords(char) {
        return this.crosswordBank.filter(word => word.word.includes(char));
    }

    calcStartPos(x, y, charIndex, direction, wordLength) {
        if (direction === 'horizontal') {
            return [x - charIndex, y];
        } else {
            return [x, y - charIndex];
        }
    }

    placeWord(word, direction, startX, startY) {
        for (let i = 0; i < word.length; i++) {
            if (direction === 'horizontal') {
                this.board[startY][startX + i] = word[i];
            } else {
                this.board[startY + i][startX] = word[i];
            }
        }
        this.placedWords.push({ word, direction, startX, startY });
    }
}