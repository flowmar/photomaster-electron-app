// Constraints to be passed to the getUserMedia function
const constraints = {
    audio: false,
    video: {
        mandatory: {
            minWidth: 853,
            minHeight: 480,
            maxWidth: 853,
            maxHeight: 480
        }
    }
}

// Captures 'stream'
// 'stream' is what comes back from getUserMedia
function handleSuccess(videoEl, stream) {
    videoEl.src = window.URL.createObjectURL(stream);
}

// Handles the capture error
function handleError(error) {
    console.log("Camera Error: ", error);
}

// Exports the init function
exports.init = (nav, videoEl) => {
    // Passing in the constraints, this function asks for permission to use a media stream and then returns the stream
    nav.mediaDevices.getUserMedia(constraints).then(stream => {
        handleSuccess(videoEl, stream)
    }).catch(err => {
        handleError
    });
}

// Exports the captureBytes function
exports.captureBytes = (videoEl, ctx, canvasEl) => {
    // Take the data found in the video element and draw the current frame on the canvas
    ctx.drawImage(videoEl, 0, 0);
    return canvasEl.toDataURL('image/png');
}

exports.captureBytesFromLiveCanvas = canvas => {
    return canvas.toDataURL('image/png')
}