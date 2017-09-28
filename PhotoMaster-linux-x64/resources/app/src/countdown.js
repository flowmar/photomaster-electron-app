/******************************************
 *  Author : Author
 *  Created On : Thu Sep 28 2017
 *  File : countdown.js
 *******************************************/

// Displays the current count in the UI
function setCount(counter, count) {
    // When it reaches 0, show nothing
    counter.innerHTML = count > 0 ? count : '';
}

// Start function that takes in the counter, the number we are counting down from, and a callback
exports.start = (counter, downFrom, done) => {
    for (let i = 0; i <= downFrom; ++i) {
        setTimeout(_ => {
            const count = downFrom - i;
            setCount(counter, count)
            if (i === downFrom)
                done()
        }, i * 1000);
    }
}