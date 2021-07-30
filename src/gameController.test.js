const GameController = require('./gameController');

describe('game controller unit tests', () => {
    const checkKeyPressReaction = ({keyName, toCall, notToCall, gameState}) => {
        const controls = {
            moveLeft : jest.fn(),
            moveRight : jest.fn(),
            moveUp : jest.fn(),
            moveDown : jest.fn(),
            terminate : jest.fn(),
            presentState : jest.fn()
        };
        
        const controller = new GameController({
            game : {
                moveLeft : controls.moveLeft,
                moveRight : controls.moveRight,
                moveUp : controls.moveUp,
                moveDown : controls.moveDown,
                ...gameState
            },
            terminate : controls.terminate,
            presentState : controls.presentState
        });


        controller.onKeyPress(keyName);

        toCall.forEach(({fn, args}) => {
            if (args) {
                expect(controls[fn]).toBeCalledWith(args);
            } else {
                expect(controls[fn]).toBeCalled();
            }
        });
        notToCall.forEach(fn => {
            expect(controls[fn]).not.toBeCalled();
        });
    };


    it('controller start calls make first game presentation', () => {
        const presentState = jest.fn();

        const rand = Math.trunc(Math.random() * 100);
        const controller = new GameController({
            game : {
                win : false,
                blocks : rand
            },
            terminate : null,
            presentState
        });

        controller.start();

        expect(presentState).toBeCalledWith({
            win : false,
            blocks : rand
        });
    });

    it('controller reaction on "a" and "left" key press is correct', () => {
        const rand = Math.trunc(Math.random() * 100);
        const gameState = {
            win : false,
            blocks : rand
        };
        checkKeyPressReaction({
            keyName : 'a',
            toCall : [{fn : 'moveLeft'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveUp', 'moveDown', 'terminate'],
            gameState
        });
        checkKeyPressReaction({
            keyName : 'left',
            toCall : [{fn : 'moveLeft'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveUp', 'moveDown', 'terminate'],
            gameState
        });
    });

    it('controller reaction on "w" and "up" key press is correct', () => {
        const rand = Math.trunc(Math.random() * 100);
        const gameState = {
            win : false,
            blocks : rand
        };
        checkKeyPressReaction({
            keyName : 'w',
            toCall : [{fn : 'moveUp'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveLeft', 'moveDown', 'terminate'],
            gameState
        });
        checkKeyPressReaction({
            keyName : 'up',
            toCall : [{fn : 'moveUp'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveLeft', 'moveDown', 'terminate'],
            gameState
        });
    });

    it('controller reaction on "d" and "right" key press is correct', () => {
        const rand = Math.trunc(Math.random() * 100);
        const gameState = {
            win : false,
            blocks : rand
        };
        checkKeyPressReaction({
            keyName : 'd',
            toCall : [{fn : 'moveRight'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveLeft', 'moveUp', 'moveDown', 'terminate'],
            gameState
        });
        checkKeyPressReaction({
            keyName : 'right',
            toCall : [{fn : 'moveRight'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveLeft', 'moveUp', 'moveDown', 'terminate'],
            gameState
        });
    });

    it('controller reaction on "s" and "down" key press is correct', () => {
        const rand = Math.trunc(Math.random() * 100);
        const gameState = {
            win : false,
            blocks : rand
        };
        checkKeyPressReaction({
            keyName : 's',
            toCall : [{fn : 'moveDown'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveUp', 'moveLeft', 'terminate'],
            gameState
        });
        checkKeyPressReaction({
            keyName : 'down',
            toCall : [{fn : 'moveDown'}, {fn : 'presentState', args : gameState}],
            notToCall : ['moveRight', 'moveUp', 'moveLeft', 'terminate'],
            gameState
        });
    });

    it('controller reaction on "win" is correct', () => {
        const rand = Math.trunc(Math.random() * 100);
        const gameState = {
            win : true,
            blocks : rand
        };
        checkKeyPressReaction({
            keyName : ['a', 'w', 'd', 's', 'left', 'right', 'up', 'down'][Math.trunc(Math.random() * 8)],
            toCall : [{fn : 'terminate'}],
            notToCall : [],
            gameState
        });
    });
});
