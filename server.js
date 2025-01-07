const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;
const wss = new WebSocket.Server({ noServer: true });
const clients = [];

app.use(cors());
app.use(express.json());

wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('message', (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.splice(clients.indexOf(ws), 1);
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.post('/message', (req, res) => {
    const message = req.body.message;
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    res.status(200).send('Message sent');
});

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});
