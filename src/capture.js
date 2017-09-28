// Dependencies
const electron = require('electron');

const countdown = require('./countdown');
const effects = require('./effects');
const flash = require('./flash');
const video = require('./video');

const {
    ipcRenderer: ipc,
    shell,
    remote
} = electron;

// In capture.js, we are currently inside of a render process, but we need to use the pictures in the cache, which was initially set up in the main process
// In order to communicate between the main and render processes, we use 'remote', which lets electron handle the IPC for us
// When you use 'remote.require()', it returns the module to us as if we called 'require' within the main process
const images = remote.require('./images');

let canvasTarget;
let seriously;
let videoSrc;

// Creates an image tag formatted in the following way
function formatImgTag(doc, bytes) {

    // Create a div and add the .photo class
    const div = doc.createElement('div');
    div.classList.add('photo');

    // Create a div for the close button
    const close = doc.createElement('div');
    close.classList.add('photoClose');

    // Create a new image and add the .photoImg class
    const img = new Image();
    img.classList.add('photoImg');

    // Set the source to the bytes that are received from the video
    img.src = bytes;

    // Append the img and close divs to the .photo div
    div.appendChild(img);
    div.appendChild(close);

    return div;
}

// This is equivalent to $(document).ready
window.addEventListener('DOMContentLoaded', _ => {
    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const recordEl = document.getElementById('record');
    const photosEl = document.querySelector('.photosContainer');
    const counterEl = document.getElementById('counter');
    const flashEl = document.getElementById('flash');

    // Set a 2-D context for the canvas element
    // This must be taken out, because seriously will do it on its own
    // const ctx = canvasEl.getContext('2d');

    // Instantiate seriously.js
    // Seriously.js is a library that allows video effects to be applied to live video, it does this via webGL shaders
    seriously = new Seriously();

    // Connects seriously to the video source and canvas target
    videoSrc = seriously.source('#video');
    canvasTarget = seriously.target('#canvas');

    // effects.choose(seriously, source, target, effectName)
    effects.choose(seriously, videoSrc, canvasTarget);

    // Initializes video.js
    video.init(navigator, videoEl);

    // Captures and saves the video stream
    recordEl.addEventListener('click', _ => {

        // Starts the countdown.start() method
        countdown.start(counterEl, 3, _ => {

            flash(flashEl);

            const bytes = video.captureBytesFromLiveCanvas(canvasEl);

            // Send the 'image-captured' event
            ipc.send('image-captured', bytes);

            // Creates an image tag for the bytes
            photosEl.appendChild(formatImgTag(document, bytes));
        });
    });

    // Click listener on the photos element
    photosEl.addEventListener('click', evt => {

        // Test the target of the event that bubbles to this listener top see if it contains the class of 'photoClose', which is the close button
        // If it does, we know that it's a close button
        const isRm = evt.target.classList.contains('photoClose');

        // If isRm is true, the selector is the .photoClose class, otherwise it's the .photoImg class
        const selector = isRm ? '.photoClose' : '.photoImg';

        // Query for all of the images inside the container
        const photos = Array.from(document.querySelectorAll(selector));

        // Find the index of the one that matches the event target
        const index = photos.findIndex(el => el == evt.target);

        // If the image exists...
        if (index > -1) {

            // If the button is a remove button, send the 'image-remove' event
            if (isRm)
                ipc.send('image-remove', index);
            else
                // Shows the item represented in the path in the Finder
                shell.showItemInFolder(images.getFromCache(index));
        }

    });
});

// When the 'image removed' event is received, remove the corresponding child element
ipc.on('image-removed', (evt, index) => {
    document.getElementById('photos').removeChild(Array.from(document.querySelectorAll('.photo'))[index]);
});

// When the 'effect-choose' event is received, change the effect
ipc.on('effect-choose', (evt, effectName) => {
    effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on('effect-cycle', evt => {
    effects.cycle(seriously, videoSrc, canvasTarget)
});