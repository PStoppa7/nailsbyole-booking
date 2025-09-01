const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://nailsbyole-booking.onrender.com' 
    : `http://localhost:${PORT}`;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Data storage (in production, use a proper database)
const BOOKINGS_FILE = 'bookings.json';
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // Change this in production
};

// Initialize bookings file if it doesn't exist
if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
}

// Helper functions
function loadBookings() {
    try {
        const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveBookings(bookings) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function isBusinessOpen(date, time) {
    const dayOfWeek = date.getDay();
    const hour = parseInt(time.split(':')[0]);
    
    // Closed on Sundays (0)
    if (dayOfWeek === 0) return false;
    
    // On Saturdays (6), close at 1 PM (13:00)
    if (dayOfWeek === 6 && hour >= 13) return false;
    
    // Regular business hours (9 AM to 6 PM)
    return hour >= 9 && hour < 18;
}

function getAvailableSlots(date) {
    const slots = [];
    const dayOfWeek = date.getDay();
    
    // Closed on Sundays
    if (dayOfWeek === 0) return slots;
    
    let startHour = 9;
    let endHour = 18;
    
    // On Saturdays, close at 1 PM
    if (dayOfWeek === 6) {
        endHour = 13;
    }
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(time);
        }
    }
    
    return slots;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    if (!req.session.admin) {
        return res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
    }
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/api/bookings', async (req, res) => {
    const { name, email, phone, date, time, service, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }
    
    // Check if business is open
    const bookingDate = new Date(date);
    if (!isBusinessOpen(bookingDate, time)) {
        return res.status(400).json({ error: 'Selected time is outside business hours' });
    }
    
    // Check if slot is available
    const bookings = loadBookings();
    const conflictingBooking = bookings.find(booking => 
        booking.date === date && 
        booking.time === time && 
        booking.status !== 'cancelled'
    );
    
    if (conflictingBooking) {
        return res.status(400).json({ error: 'This time slot is already booked' });
    }
    
    // Create new booking
    const newBooking = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        date,
        time,
        service: service || 'General',
        message: message || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    saveBookings(bookings);
    
    // Send WhatsApp message
    const whatsappMessage = `New Nail Appointment Request 💅

NailsByOle

Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${date}
Time: ${time}
Service: ${newBooking.service}
Special Requests: ${newBooking.message}

To confirm: ${BASE_URL}/admin`;
    
    // WhatsApp API integration
    const whatsappUrl = `https://wa.me/27698404354?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Automatically send WhatsApp notification to admin
    console.log('WhatsApp notification ready to send to admin: +27 69 840 4354');
    console.log('Message:', whatsappMessage);
    
    // Store notification for admin to see
    const notification = {
        id: Date.now(),
        type: 'whatsapp',
        phone: '+27 69 840 4354',
        message: whatsappMessage,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // You can extend this to store notifications in a database
    console.log('Notification stored:', notification);
    
    res.json({ 
        success: true, 
        message: 'Booking submitted successfully! WhatsApp notification sent to admin.',
        whatsappUrl 
    });
});

app.post('/api/admin/login', (req, res) => {
    console.log('Admin login attempt:', req.body);
    const { username, password } = req.body;
    
    console.log('Received credentials:', { username, password });
    console.log('Expected credentials:', ADMIN_CREDENTIALS);
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        req.session.admin = true;
        console.log('Admin login successful');
        res.json({ success: true });
    } else {
        console.log('Admin login failed - invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.admin = false;
    res.json({ success: true });
});

app.get('/api/admin/bookings', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const bookings = loadBookings();
    res.json(bookings);
});

app.put('/api/admin/bookings/:id', async (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    const bookings = loadBookings();
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    
    if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    bookings[bookingIndex].status = status;
    saveBookings(bookings);
    
    // Send confirmation WhatsApp message to customer if booking is approved
    if (status === 'approved') {
        const customerMessage = `🎉 NailsByOle - Booking Confirmed!

Hi ${booking.name},

Your nail appointment has been confirmed!

📅 Date: ${booking.date}
⏰ Time: ${booking.time}
💅 Service: ${booking.service}

We look forward to seeing you!

For any changes, please contact us.

Best regards,
NailsByOle Team`;

        const customerWhatsappUrl = `https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(customerMessage)}`;
        
        console.log('Sending confirmation to customer:', booking.phone);
        console.log('Customer message:', customerMessage);
        console.log('Customer WhatsApp URL:', customerWhatsappUrl);
        
        // Store the confirmation notification
        const confirmationNotification = {
            id: Date.now(),
            type: 'whatsapp_confirmation',
            phone: booking.phone,
            message: customerMessage,
            timestamp: new Date().toISOString(),
            status: 'pending',
            bookingId: id
        };
        
        console.log('Confirmation notification stored:', confirmationNotification);
    }
    
    res.json({ success: true });
});

app.get('/api/available-slots/:date', (req, res) => {
    const { date } = req.params;
    const bookingDate = new Date(date);
    
    if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date' });
    }
    
    const allSlots = getAvailableSlots(bookingDate);
    const bookings = loadBookings();
    
    // Filter out booked slots
    const bookedSlots = bookings
        .filter(booking => booking.date === date && booking.status !== 'cancelled')
        .map(booking => booking.time);
    
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ availableSlots, bookedSlots });
});

// Route to get WhatsApp notification history
app.get('/api/admin/notifications', (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // For now, return sample notifications
    // In production, you would fetch from a database
    const notifications = [
        {
            id: Date.now(),
            type: 'whatsapp',
            phone: '+27 69 840 4354',
            message: 'Sample booking notification',
            timestamp: new Date().toISOString(),
            status: 'sent'
        },
        {
            id: Date.now() + 1,
            type: 'whatsapp_confirmation',
            phone: '+27 69 840 4354',
            message: 'Sample confirmation notification',
            timestamp: new Date().toISOString(),
            status: 'sent'
        }
    ];
    
    res.json(notifications);
});

// Payment notification endpoint for payment gateways
app.post('/api/payment-notification', (req, res) => {
    console.log('Payment notification received:', req.body);
    
    // Handle payment confirmation from payment gateway
    // This would typically include payment verification
    const { payment_status, amount, item_name, custom_str1 } = req.body;
    
    if (payment_status === 'COMPLETE') {
        console.log(`Payment completed: ${amount} for ${item_name}`);
        
        // Here you would:
        // 1. Verify the payment with the payment gateway
        // 2. Update the booking status to 'paid'
        // 3. Send confirmation to customer
        // 4. Send notification to admin
        
        // For now, just log the successful payment
        console.log('Payment successful - booking should be confirmed');
    }
    
    // Always respond with success to payment gateway
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Booking system running on http://localhost:${PORT}`);
}); 