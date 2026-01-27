const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { placeBid, getItems } = require('./services/auctionService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// REST API for initial load
app.get('/items', (req, res) => {
    res.json(getItems());
});

// Socket Events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle Bid
    socket.on('BID_PLACED', ({ itemId, amount }) => {
        // Attempt the bid
        const result = placeBid(itemId, amount, socket.id);

        if (result.success) {
            // Broadcast to EVERYONE (including sender) to update UI
            io.emit('UPDATE_BID', result.item);
        } else {
            // Send error ONLY to the sender
            socket.emit('BID_ERROR', { itemId, message: result.error });
        }
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));