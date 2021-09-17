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