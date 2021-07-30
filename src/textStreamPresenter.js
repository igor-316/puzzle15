'use strict';

// should to its job in a separate worker in case of to complex operations, here's not the case
module.exports = (stream, pad, side) => ({blocks, win}) => {
    stream.clearLines(side);

    if (win) {
        stream.clearLines(1);
        stream.write('You win!\n');
    } else {
        for (let row of blocks) {
            for (let num of row) {
                const raw = num === side ** 2 - 1 ? '' : num + 1 + '';
                const space = new Array((pad - raw.length)).join(' ');
                stream.write(raw + space);
            }
            stream.write('\n');
        }
    }
};