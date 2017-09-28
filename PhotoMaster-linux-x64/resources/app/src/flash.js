/******************************************
 *  Author : Author
 *  Created On : Thu Sep 28 2017
 *  File : flash.js
 *******************************************/

let timer;

module.exports = el => {

    // If there is a pre-existing .is-flashing class, remove it
    if (el.classList.contains('is-flashing')) {
        el.classList.remove('is-flashing');
    }
    // Clears any pre-existing timeout
    clearTimeout(timer);

    // Adds the .is-flashing class
    el.classList.add('is-flashing');

    // The CSS transition takes 2 seconds, so set a timeout for 2 seconds and then remove the .is-flashing class
    timer = setTimeout(_ => el.classList.remove('is-flashing'), 2000);
}