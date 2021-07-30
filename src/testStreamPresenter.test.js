const textStreamPresenter = require('./textStreamPresenter');

describe('test stream presenter unit tests', () => {
    const side = 4;
    const padding = 4;
    const sampleBlocks = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
    ];

    it('win handling', () => {
        const write = jest.fn();

        const presentState = textStreamPresenter({
            clearLines : () => {},
            write
        }, side, padding);

        presentState({blocks : null, win : true});
        expect(write).toBeCalledWith('You win!\n');
    });

    it('blocks rendering', () => {
        const clearLines = jest.fn();
        const write = jest.fn();
        let res = '';

        const presentState = textStreamPresenter({
            clearLines,
            write : (arg) => {
                res += arg;
                write();
            }
        }, side, padding);

        presentState({blocks : sampleBlocks, win : false});

        expect(clearLines).toBeCalledWith(side);
        expect(write).toBeCalledTimes(side * (side + 1));
        expect(res).toEqual('1  2  3  4  \n5  6  7  8  \n9  10 11 12 \n13 14 15    \n');
    });
});
