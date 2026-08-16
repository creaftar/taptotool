// timerWorker.js
// Este worker roda continuamente em segundo plano sem sofrer throttling
setInterval(() => {
    postMessage('tick');
}, 1000);