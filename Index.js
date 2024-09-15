const express = require('express');
const app = express();
const port = 8080;

let startTime = null;
let elapsedTime = 0;
let running = false;

// Serve HTML and CSS directly from this file
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stopwatch App</title>
        <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
          }

          .container {
              text-align: center;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }

          h1 {
              margin-bottom: 20px;
          }

          #time {
              font-size: 48px;
              margin-bottom: 20px;
          }

          button {
              font-size: 18px;
              padding: 10px 20px;
              margin: 5px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
          }

          button:hover {
              background-color: #ddd;
          }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Stopwatch</h1>
            <div id="time">00:00:00</div>
            <button id="startBtn">Start</button>
            <button id="stopBtn">Stop</button>
            <button id="resetBtn">Reset</button>
        </div>

        <script>
            let timerInterval;
            const timeDisplay = document.getElementById('time');

            function formatTime(seconds) {
                const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
                const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                const s = String(seconds % 60).padStart(2, '0');
                return \`\${h}:\${m}:\${s}\`;
            }

            async function updateTime() {
                const res = await fetch('/time');
                const data = await res.text();
                const elapsedTime = parseFloat(data.replace('Elapsed time: ', '').replace(' seconds.', ''));
                timeDisplay.textContent = formatTime(Math.floor(elapsedTime));
            }

            document.getElementById('startBtn').addEventListener('click', async () => {
                await fetch('/start');
                clearInterval(timerInterval);
                timerInterval = setInterval(updateTime, 1000);
            });

            document.getElementById('stopBtn').addEventListener('click', async () => {
                await fetch('/stop');
                clearInterval(timerInterval);
            });

            document.getElementById('resetBtn').addEventListener('click', async () => {
                await fetch('/reset');
                clearInterval(timerInterval);
                timeDisplay.textContent = '00:00:00';
            });
        </script>
    </body>
    </html>
  `);
});

// Start the stopwatch
app.get('/start', (req, res) => {
  if (!running) {
    startTime = Date.now() - elapsedTime;
    running = true;
    res.send('Stopwatch started.');
  } else {
    res.send('Stopwatch is already running.');
  }
});

// Stop the stopwatch
app.get('/stop', (req, res) => {
  if (running) {
    elapsedTime = Date.now() - startTime;
    running = false;
    res.send('Stopwatch stopped.');
  } else {
    res.send('Stopwatch is not running.');
  }
});

// Reset the stopwatch
app.get('/reset', (req, res) => {
  startTime = null;
  elapsedTime = 0;
  running = false;
  res.send('Stopwatch reset.');
});

// Get the elapsed time
app.get('/time', (req, res) => {
  if (running) {
    elapsedTime = Date.now() - startTime;
  }
  res.send(`Elapsed time: ${elapsedTime / 1000} seconds.`);
});

app.listen(port, () => {
  console.log(`Stopwatch app listening at http://localhost:${port}`);
});
