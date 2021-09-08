console.log('functions.js');

/**
 * return a number >= 0 and < nb (ex: dice(3) return 0, 1 or 2)
 * @param nb
 * @returns {number}
 */
function dice(nb) {
    return Math.floor(Math.random() * nb);
}

/**
 * return true if nb is even
 * @param nb
 * @returns {boolean}
 */
function isEven(nb) {
    return nb % 2 === 0;
}

/**
 * return a random tetromino Object
 * @returns {I|O|T|L|J}
 */
function randomTetromino(view){
    let tetrominos = [
        new I(view),
        new O(view),
        new T(view),
        new L(view),
        new J(view),
        new Z(view),
        new S(view)
    ];
    let r = dice(tetrominos.length);
    return tetrominos[r];
}