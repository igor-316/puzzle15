'use strict';

class GameController {
    constructor ({game, terminate, presentState}) {
        this.game = game;
        this.terminate = terminate;
        this.presentState = presentState;
        this.actionMapping = {
            a : () => this.game.moveLeft(),
            w : () => this.game.moveUp(),
            d : () => this.game.moveRight(),
            s : () => this.game.moveDown(),

            left : () => this.game.moveLeft(),
            right : () => this.game.moveRight(),
            up : () => this.game.moveUp(),
            down : () => this.game.moveDown(),
        }
    }

    start () {
        this.presentState({blocks : this.game.blocks, win : this.game.win});
    }

    onKeyPress (keyName) {
        if (this.actionMapping[keyName]) {
            this.actionMapping[keyName]();

            this.presentState({blocks : this.game.blocks, win : this.game.win});
    
            if (this.game.win) {
                this.terminate();
            }
        }
    }
}

module.exports = GameController;