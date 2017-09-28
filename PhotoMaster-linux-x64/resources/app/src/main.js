// Dependencies
const electron = require('electron');

const images = require('./images');
const menuTemplate = require('./menu')

const {
    app,
    BrowserWindow,
    ipcMain: ipc,
    Menu
} = electron;

let mainWindow;

// When app is ready,
app.on('ready', _ => {

    // Create a new window
    mainWindow = new BrowserWindow({
        width: 893,
        height: 725,
        resizable: false
    });

    // Load the html file into the window
    mainWindow.loadURL(`file://${__dirname}/capture.html`)

    // Automatically open DevTools
    // mainWindow.webContents.openDevTools();

    // Make the pictures directory
    images.mkdir(images.getPicturesDir(app));

    // When the mainWindow closes, remove the window
    mainWindow.on('closed', _ => {
        mainWindow = null;
    });

    // Build the menu
    const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow));

    // Set the menu as the application menu
    Menu.setApplicationMenu(menuContents);
});

// When the 'image-captured' event is received,
ipc.on('image-captured', (evt, contents) => {
    // Run images.(save);
    images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
        images.cache(imgPath);
    });
});

ipc.on('image-remove', (evt, index) => {
    images.rm(index, _ => {
        event.sender.send('image-removed', index)
    });
})