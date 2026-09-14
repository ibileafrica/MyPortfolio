import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory campaign inquiries storage
const brandInquiries = [];

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    director: 'Oluwabiyi Ayodele Samson',
    service: 'Creative Direction & Commercial Video Production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API: Get campaigns catalog
app.get('/api/projects', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'projects.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const campaigns = JSON.parse(fileContent);
    res.json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error('Error reading campaign data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve commercial video campaigns'
    });
  }
});

// API: Brand Campaign Booking / Consultation Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { brandName, contactPerson, email, phone, storeUrl, budgetTier, campaignGoals, message } = req.body;

    // Validation
    const name = contactPerson || req.body.name;
    const clientEmail = email;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name or primary contact person.' });
    }
    if (!clientEmail || !clientEmail.trim() || !clientEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business email address.' });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please provide brief details regarding your campaign goals (at least 5 characters).' });
    }

    const newInquiry = {
      id: brandInquiries.length + 1,
      brandName: (brandName && brandName.trim()) || 'Private Brand',
      contactPerson: name.trim(),
      email: clientEmail.trim(),
      phone: (phone && phone.trim()) || 'Not provided',
      storeUrl: (storeUrl && storeUrl.trim()) || 'Not provided',
      budgetTier: budgetTier || 'Standard (₦1.5M - ₦3.5M)',
      campaignGoals: campaignGoals || 'Commercial / Video Ad Campaign',
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };

    brandInquiries.push(newInquiry);
    console.log(`[Brand Inquiry #${newInquiry.id}] New campaign request from ${newInquiry.brandName} (${newInquiry.contactPerson}, ${newInquiry.email}) - Budget: ${newInquiry.budgetTier}`);

    return res.status(201).json({
      success: true,
      message: `Thank you, ${newInquiry.contactPerson}! Your campaign brief for "${newInquiry.brandName}" has been received. Oluwabiyi Ayodele Samson and the production team will review your requirements and reach out within 24 hours.`,
      data: {
        id: newInquiry.id,
        brandName: newInquiry.brandName,
        receivedAt: newInquiry.receivedAt
      }
    });
  } catch (error) {
    console.error('Error handling campaign inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while processing your campaign brief. Please contact via WhatsApp or email directly.'
    });
  }
});

// Fallback for Single Page Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server with graceful port fallback
const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`=======================================================`);
    console.log(`🎬 Oluwabiyi Ayodele Samson - Creative Director Portfolio`);
    console.log(`📡 Local Server URL: http://localhost:${portToUse}`);
    console.log(`📂 Serving Light-Theme Frontend from: public/`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToUse) + 1;
      console.warn(`⚠️ Port ${portToUse} is currently in use. Trying fallback port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

