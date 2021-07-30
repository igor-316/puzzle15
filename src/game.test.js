const Game = require('./game');

describe('game unit tests', () => {
    let game = null;

    const checkMoveState = (method, direction) => {
        const emptyFieldPosition = {...game.emptyFieldPosition};
        const neighbourMovementPosition = game.getNeighbourMovementPosition(direction);
        const movementIsValid = game.movementIsValid(neighbourMovementPosition);
        const newEmptyPositionBlock = movementIsValid ? game.blocks[neighbourMovementPosition.i][neighbourMovementPosition.j] : null;

        game[method]();
        expect(game.emptyFieldPosition).toEqual({
            i : emptyFieldPosition.i + (movementIsValid ? -direction.i : 0),
            j : emptyFieldPosition.j + (movementIsValid ? -direction.j : 0)
        });
        
        if (movementIsValid) {
            expect(game.blocks[emptyFieldPosition.i][emptyFieldPosition.j]).toEqual(newEmptyPositionBlock);
        }
    };

    const moveEmptyToBottomRight = game => {
        for (let i = 0; i < game.side; i++) {
            game.moveUp();
            game.moveLeft();
        }
    };

    beforeEach(() => {
        // game = new Game(4);
        game = new Game(Math.trunc(Math.random() * 5) + 4);
    });

    afterEach(() => {
        game = null;
    });

    it('initial state is good', () => {
        // const blocks = game.blocks;

        // blocks.forEach((row, rowIndex) => {
        //     row.forEach((num, colIndex) => {
        //         expect(num).not.toEqual(rowIndex * game.side + colIndex);
        //     });
        // });

        expect(game.win).toEqual(false);
        // expect(game.correct).toEqual(0);
        expect(game.emptyFieldPosition).not.toBeNull();
    });

    it('movement calculation', () => {
        expect(game.getNeighbourMovementPosition({i : 0, j : -1})).toEqual({
            i : game.emptyFieldPosition.i,
            j : game.emptyFieldPosition.j + 1
        });
        expect(game.getNeighbourMovementPosition({i : 0, j : 1})).toEqual({
            i : game.emptyFieldPosition.i,
            j : game.emptyFieldPosition.j - 1
        });
        expect(game.getNeighbourMovementPosition({i : -1, j : 0})).toEqual({
            i : game.emptyFieldPosition.i + 1,
            j : game.emptyFieldPosition.j
        });
        expect(game.getNeighbourMovementPosition({i : 1, j : 0})).toEqual({
            i : game.emptyFieldPosition.i - 1,
            j : game.emptyFieldPosition.j
        });
    });

    it('movement validness', () => {
        let leftMove = game.getNeighbourMovementPosition({i : 0, j : -1});
        let rightMove = game.getNeighbourMovementPosition({i : 0, j : 1});
        let upMove = game.getNeighbourMovementPosition({i : -1, j : 0});
        let downMove = game.getNeighbourMovementPosition({i : 1, j : 0});

        expect(game.movementIsValid(leftMove)).toEqual(game.emptyFieldPosition.j < game.side - 1);
        expect(game.movementIsValid(rightMove)).toEqual(game.emptyFieldPosition.j > 0);
        expect(game.movementIsValid(upMove)).toEqual(game.emptyFieldPosition.i < game.side - 1);
        expect(game.movementIsValid(downMove)).toEqual(game.emptyFieldPosition.i > 0);
    });

    it('movement directions left', () => {
        checkMoveState('moveLeft', {i : 0, j : -1});
    });

    it('movement direction right', () => {
        checkMoveState('moveRight', {i : 0, j : 1});
    });

    it('movement direction up', () => {
        checkMoveState('moveUp', {i : -1, j : 0});
    });

    it('movement direction down', () => {
        checkMoveState('moveDown', {i : 1, j : 0});
    });

    it('empty field stands at the bottom right no matter where the start position is', () => {
        moveEmptyToBottomRight(game);

        expect(game.emptyFieldPosition).toEqual({
            i : game.side - 1,
            j : game.side - 1
        });
    });

    it('valid blocks matches "correct" state', () => {
        moveEmptyToBottomRight(game);

        let correct = 0;
        game.blocks.forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                if (num === rowIndex * game.side + colIndex) {
                    correct++;
                }
            });
        });

        expect(game.correct).toEqual(correct);
    });

    it('win if empty is at the bottom right and required match count is 1', () => {
        game.requiredValidPositions = 1;
        moveEmptyToBottomRight(game);
        expect(game.win).toEqual(true);
    });
});