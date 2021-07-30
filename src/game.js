'use strict';

const {getRandomSolvablePermutation} = require('./utils');

const _state = Symbol();

class Game {
    constructor (side, requiredValidPositions = side ** 2) {
        if (side < 4) throw new Error('side parameter cannot be less than 4');

        this.side = side;
        this[_state] = this.createState(getRandomSolvablePermutation(side ** 2));
        this.requiredValidPositions = requiredValidPositions; // needed for test purposes
    }

    get blocks () {
        return this[_state].area;
    }

    get win () {
        return this[_state].correct >= this.requiredValidPositions;
    }

    get correct () {
        return this[_state].correct;
    }

    get emptyFieldPosition () {
        return this[_state].empty;
    }

    moveLeft () {
        this.performMovement({i : 0, j : -1});
    }

    moveUp () {
        this.performMovement({i : -1, j : 0});
    }

    moveRight () {
        this.performMovement({i : 0, j : 1});
    }

    moveDown () {
        this.performMovement({i : 1, j : 0});
    }

    performMovement (direction) {
        const {
            i : newI, // vertical new position of empty field
            j : newJ  // horizontal new position of empty field
        } = this.getNeighbourMovementPosition(direction);
    
        // if the movement is possible
        if (this.movementIsValid({i : newI, j : newJ})) {
            // swap the block and empty field
            [this[_state].area[this[_state].empty.i][this[_state].empty.j], this[_state].area[newI][newJ]] =
                [this[_state].area[newI][newJ], this[_state].area[this[_state].empty.i][this[_state].empty.j]]
            
            this[_state].correct += this.getCorrectPositionsDiff(this[_state].empty, {i : newI, j : newJ});

            this[_state].empty.i = newI;
            this[_state].empty.j = newJ;
        }
    }

    createState (sequence) {
        const side = Math.sqrt(sequence.length);
        if (Math.round(side) !== side) throw new Error('The area is not of square shape.');
    
        const res = {
            area : [],
            empty : null,
            correct : 0,
            win : false
        };
    
        for (let i = 0; i < side; i++) {
            res.area.push([]);
            for (let j = 0; j < side; j++) {
                res.area[i][j] = sequence[i * side + j];
                if (sequence[i * side + j] === sequence.length - 1) {
                    res.empty = {i, j};
                }
                // potentially impossible case
                // added for ensuring the number of valid positions is correct
                if (sequence[i * side + j] === i * side + j) {
                    res.correct++;
                }
            }
        }
    
        return res;
    }

    getNeighbourMovementPosition (direction) {
        return {i : this[_state].empty.i - direction.i, j : this[_state].empty.j - direction.j};
    }

    movementIsValid (newEmptyFieldPosition) {
        const {i, j} = newEmptyFieldPosition;
        return i >= 0 && i < this.side && j >= 0 && j < this.side;
    }

    getCorrectPositionsDiff (prevEmptyFieldPostion, newEmptyFieldPosition) {
        const {i : prevI, j : prevJ} = prevEmptyFieldPostion;
        const {i : newI, j : newJ} = newEmptyFieldPosition;
        let diff = 0;

        // check whether the block was placed on the valid place
        if (this[_state].area[prevI][prevJ] === prevI * this.side + prevJ) {
            diff++;
        // if not - check whether the block WAS on the valid place
        } else if (this[_state].area[prevI][prevJ] === newI * this.side + newJ) {
            diff--;
        }
        // same for the empty field
        if (newI === this.side - 1 && newJ === this.side - 1) {
            diff++;
        } else if (prevI === this.side - 1 && prevJ === this.side - 1) {
            diff--;
        }

        return diff;
    }
}

module.exports = Game;