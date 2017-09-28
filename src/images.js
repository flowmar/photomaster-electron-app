/******************************************
 *  Author : Author
 *  Created On : Thu Sep 28 2017
 *  File : images.js
 *******************************************/

// Dependencies
const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;
const spawn = require('child_process').spawn;

// Function to log errors to the console
const logError = err => err && console.error(err);

// This is the cache, it will be an array of image paths
let images = [];

// Exports a save function with takes in the picturesPath and the contents of the video stream
exports.save = (picturesPath, contents, done) => {

    // Replace the extra
    const base64Data = contents.replace(/^data:image\/png;base64,/, '');
    const imgPath = path.join(picturesPath, `${new Date().getTime()}.png`);
    fs.writeFile(imgPath, base64Data, {
        encoding: 'base64'
    }, err => {
        if (err) return logError(err)

        done(null, imgPath)
    });
}

// Gets the 'Pictures' directory where the pictures will be saved
exports.getPicturesDir = app => {
    return path.join(app.getPath('pictures'), 'photomaster');
}

// Takes a pictures path and calls 'fs.stat' on it
exports.mkdir = picturesPath => {
    fs.stat(picturesPath, (err, stats) => {

        // If the path doesn't exist, a 'ENOENT' error will be returned
        if (err && err.code !== 'ENOENT')
            return logError(err)
        // Otherwise, if the error still exists and it's not a directory yet
        else if (err || !stats.isDirectory())
            fs.mkdir(picturesPath, logError)
    });
}

// Removes an image
exports.rm = (index, done) => {
    fs.unlink(images[index], err => {
        if (err) return logErr(err)

        images.splice(index, 1)
        done()
    })
}

// Adds the new image path to the pre-existing cache
exports.cache = imgPath => {
    images = images.concat([imgPath]);
    return images;
}

// Returns the cache
exports.getFromCache = index => {
    return images[index];
}

const openCmds = {
    darwin: 'open',
    win32: 'explorer',
    linux: 'nautilus'
}

exports.openDir = dirPath => {
    const cmd = openCmds[process.platform];
    if (cmd)
        spawn(cmd, [dirPath]);
    else
        shell.showItemInFolder(dirPath);
}