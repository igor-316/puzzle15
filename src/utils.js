exports.getRandomSolvablePermutation = (size) => {
    const res = Array.from(Array(size).keys());
    const side = Math.sqrt(size);
    let controlSum = 0;

    for (let i = size - 1; i >= 0; i--) {
        if (i > 0) {
            // do not consider swapping with itself to make
            // sure no elements are left on the valid positions
           const toSwap = Math.trunc(Math.random() * i);
           [res[i], res[toSwap]] = [res[toSwap], res[i]];
        }
        if (res[i] < size - 1) {
            for (let j = i + 1; j < size; j++) {
                if (res[j] < res[i]) {
                    controlSum++;
                }
            }
        } else { // indicates empty field
            controlSum += Math.trunc(i / side) + 1;
        }
    }

    // need to rotate, because the combination doesn't have solution
    // rotate right side
    if (controlSum % 2 === 1) {
        const old = [...res];
        old.forEach((num, i) => {
            const rowNum = side - (i % side) - 1;
            const colNum = Math.trunc(i / side);
            res[rowNum * side + colNum] = num;
        });
    }

    return res;
};