# Nail Tech Booking System with WhatsApp Integration

A modern booking system specifically designed for nail technicians that allows clients to book nail services and sends appointment requests directly to WhatsApp. Includes an admin panel for managing and confirming appointments.

## Features

### Customer Booking Form
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **Nail Services**: Comprehensive list of nail services with pricing
  - Manicures, Pedicures, Gel services, Acrylics, Nail Art, etc.
- **Date/Time Restrictions**: 
  - Closed on Sundays
  - Saturdays close at 1 PM
  - Regular hours: 9 AM - 6 PM (Monday-Friday)
- **Real-time Availability**: Shows only available time slots
- **WhatsApp Integration**: Automatically opens WhatsApp with appointment details
- **Form Validation**: Ensures all required fields are completed

### Admin Dashboard
- **Secure Login**: Admin authentication system
- **Appointment Management**: View, confirm, decline, and cancel appointments
- **Statistics**: Real-time appointment statistics
- **Filtering**: Filter appointments by status and date
- **Responsive Design**: Works on desktop and mobile devices

### Business Logic
- **Conflict Prevention**: Prevents double bookings
- **Business Hours**: Enforces business hours automatically
- **Status Tracking**: Track appointment status (pending, confirmed, declined, cancelled)
- **Service Pricing**: Built-in pricing for all nail services

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd booking-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure WhatsApp Integration:**
   - Open `server.js`
   - Find the line: `const whatsappUrl = \`https://wa.me/YOUR_PHONE_NUMBER?text=\${encodeURIComponent(whatsappMessage)}\`;`
   - Replace `YOUR_PHONE_NUMBER` with your actual WhatsApp number (include country code)
   - Example: `+1234567890`

4. **Configure Admin Credentials:**
   - Open `server.js`
   - Find the `ADMIN_CREDENTIALS` object
   - Change the username and password to your preferred credentials
   - Default: username: `admin`, password: `admin123`

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Access the application:**
   - Booking Form: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Usage

### For Customers
1. Visit the booking form at http://localhost:3000
2. Fill in your details (name, email, phone)
3. Select a date (Sundays are automatically disabled)
4. Choose an available time slot
5. Select nail service and add any special requests
6. Submit the appointment request
7. WhatsApp will automatically open with the appointment details

### For Admins
1. Go to http://localhost:3000/admin
2. Login with your admin credentials
3. View all appointments in the dashboard
4. Use filters to find specific appointments
5. Confirm, decline, or cancel appointments as needed
6. Monitor appointment statistics

## File Structure

```
booking-system/
├── server.js              # Main server file with all routes
├── package.json           # Dependencies and scripts
├── bookings.json          # Data storage (created automatically)
├── public/
│   ├── index.html         # Customer booking form
│   ├── admin-login.html   # Admin login page
│   └── admin.html         # Admin dashboard
└── README.md              # This file
```

## Configuration Options

### Business Hours
Edit the `isBusinessOpen` and `getAvailableSlots` functions in `server.js` to modify:
- Opening hours
- Closing times
- Days of operation

### WhatsApp Integration
The system uses WhatsApp Web API. To customize:
1. Change the phone number in `server.js`
2. Modify the message format in the booking submission route
3. Consider using WhatsApp Business API for more advanced features

### Data Storage
Currently uses JSON file storage. For production:
- Replace with a proper database (MySQL, PostgreSQL, MongoDB)
- Implement proper data backup
- Add data encryption

## Security Considerations

### For Production Use
1. **Change Default Credentials**: Update admin username/password
2. **Use Environment Variables**: Store sensitive data in `.env` files
3. **HTTPS**: Use SSL certificates for secure connections
4. **Rate Limiting**: Implement request rate limiting
5. **Input Validation**: Add server-side validation
6. **Database**: Use a proper database instead of JSON files

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `server.js`: `const PORT = process.env.PORT || 3001;`

2. **WhatsApp Not Opening**
   - Ensure the phone number includes country code
   - Check if WhatsApp Web is accessible

3. **Bookings Not Saving**
   - Check file permissions for `bookings.json`
   - Ensure the directory is writable

4. **Admin Login Issues**
   - Verify credentials in `server.js`
   - Clear browser cache and cookies

## Customization

### Styling
- Modify CSS in the HTML files to match your brand
- Change colors, fonts, and layout as needed

### Business Rules
- Edit the business hours logic in `server.js`
- Add custom validation rules
- Implement additional booking restrictions

### Features
- Add email notifications
- Implement SMS notifications
- Add calendar integration
- Create customer accounts
- Add payment processing

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Ensure all dependencies are installed
4. Verify configuration settings

## License

This project is open source and available under the MIT License. 