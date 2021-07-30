const readline = require('readline');

const GameController = require('./src/gameController');
const Game = require('./src/game');
const textStreamPresenter = require('./src/textStreamPresenter');
const config = require('./config.json');
const terminate = () => {
    process.exit();
};

const streamAdapter = {
    clearLines : (count) => {
        for (let i = 0; i < count; i++) {
            process.stdout.clearLine();
            process.stdout.moveCursor(0,-1);
        }
        process.stdout.cursorTo(0);
    },

    write : process.stdout.write.bind(process.stdout)
};
const presentState = textStreamPresenter(streamAdapter, config.outputPadding, config.sideSize);
const game = new Game(config.sideSize);
const gameController = new GameController({game, terminate, presentState});

const setup = () => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            // launch game handling in less prioritized event loop phase in order to make "exit" handling more prioritized
            setImmediate(() => {
                gameController.onKeyPress(key.name);
            });
        }
    });
};

setup();
gameController.start();

