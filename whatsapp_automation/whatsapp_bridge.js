const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const fs = require('fs');

let client;
let isReady = false;
let currentQR = null;

// Initialize WhatsApp client
function initializeWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        }
    });

    // QR code generation
    client.on('qr', (qr) => {
        console.log('QR Code received');
        currentQR = qr;
        qrcode.generate(qr, { small: true });
    });

    // Ready event
    client.on('ready', () => {
        console.log('WhatsApp Agent is ready!');
        isReady = true;
        currentQR = null; // Clear QR code once ready
    });

    // Message received
    client.on('message', async (message) => {
        console.log('Received:', message.body);

        // Forward to Python backend
        try {
            const body = {
                from: message.from,
                body: message.body,
                timestamp: new Date().toISOString()
            };

            // detailed log
            console.log("Forwarding to backend:", body);

            // Use dynamic import for node-fetch or standard fetch if available (Node 18+)
            const response = await fetch('http://localhost:8000/api/whatsapp/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log("Backend response:", response.status);
        } catch (e) {
            console.log('Error forwarding message:', e.message);
        }
    });

    client.initialize();
}

// API Endpoints
app.use(express.json());

// Get QR code
app.get('/qr', (req, res) => {
    res.json({ qr: currentQR, ready: isReady });
});

// Send text message
app.post('/send', async (req, res) => {
    const { number, message } = req.body;
    try {
        if (!isReady) throw new Error('Client not ready');
        // number format: '919876543210', needs suffix
        // We assume the python side handles formatting or we verify here
        // whatsapp-web.js expects '1234567890@c.us'
        // Sanitize number
        let sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove spaces, dashes, parens
        sanitized_number = sanitized_number.replace("+", "");

        // Check if it already has @c.us
        if (!sanitized_number.includes('@c.us')) {
            sanitized_number = `${sanitized_number}@c.us`;
        }

        // Verify registration
        const isRegistered = await client.isRegisteredUser(sanitized_number);
        if (!isRegistered) {
            throw new Error('Number is not registered on WhatsApp');
        }

        await client.sendMessage(sanitized_number, message);
        res.json({ success: true });
    } catch (error) {
        console.error("Send Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Send media
app.post('/send-media', async (req, res) => {
    const { number, mediaPath, caption } = req.body;
    try {
        if (!isReady) throw new Error('Client not ready');

        const media = MessageMedia.fromFilePath(mediaPath);

        // Sanitize number
        let sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove spaces, dashes, parens
        sanitized_number = sanitized_number.replace("+", "");

        // Check if it already has @c.us
        if (!sanitized_number.includes('@c.us')) {
            sanitized_number = `${sanitized_number}@c.us`;
        }

        // Verify registration
        const isRegistered = await client.isRegisteredUser(sanitized_number);
        if (!isRegistered) {
            throw new Error('Number is not registered on WhatsApp');
        }

        await client.sendMessage(sanitized_number, media, { caption });
        res.json({ success: true });
    } catch (error) {
        console.error("Send Media Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`WhatsApp Bridge running on port ${PORT}`);
    initializeWhatsApp();
});

// Graceful shutdown
const shutdown = async () => {
    console.log('\nShutting down WhatsApp Bridge...');
    if (client) {
        await client.destroy();
    }
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
