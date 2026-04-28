# MasterMods PC - HTML Website

Professional PC Modding & Repair Services Website - Static HTML Version

## 📁 Files Structure

```
MasterMods/
├── index.html              # Homepage with services, gallery, and booking form
├── track-booking.html      # Customer portal to track bookings
├── admin.html              # Admin panel for managing bookings and services
├── styles.css              # All CSS styles
├── script.js               # Core JavaScript and data management
├── track-booking.js        # Customer portal logic
├── admin.js                # Admin panel logic
└── README.md               # This file
```

## 🚀 Features

### Homepage (index.html)
- **Hero section** with value proposition
- **Services catalog** with 6 services (3 repair + 3 modding)
- **Gallery** with before/after images
- **Booking form** with validation
- **FAQ section** with accordion
- **Responsive design** for mobile and desktop

### Customer Portal (track-booking.html)
- **Email-based login** to view bookings
- **Dashboard** showing booking statistics
- **Booking cards** with status indicators
- **Detailed view** modal for each booking
- **Real-time status updates**

### Admin Panel (admin.html)
- **Dashboard** with overview statistics
- **Bookings management** with filtering and status updates
- **Services management** to add/edit/delete services
- **Tab navigation** between sections
- **Full CRUD operations**

## 💾 Data Storage

All data is stored in **localStorage**:
- `mastermods_bookings` - All customer bookings
- `mastermods_services` - Available services
- `customer_email` - Last logged in customer email
- `admin_logged_in` - Admin session status

## 🔐 Login Credentials

### Admin Access
- Email: `admin@mastermods.com`
- Password: Any (frontend demo only)

### Customer Portal
- Use any email from your bookings
- Demo email: `john@example.com`

## 📱 How to Use

### For Customers

1. **Book a Service**
   - Open `index.html`
   - Scroll to "Book Your Service" section
   - Fill out the form and submit
   - Your email is automatically saved

2. **Track Your Booking**
   - Click "Track Booking" in the header
   - Or open `track-booking.html`
   - Enter your email to view all your bookings
   - Check status updates and booking details

### For Admins

1. **Login**
   - Click "Login" button on homepage
   - Enter `admin@mastermods.com`
   - You'll be redirected to admin panel

2. **Manage Bookings**
   - View all bookings in the Bookings tab
   - Filter by status
   - Update booking status
   - View full details
   - Delete bookings

3. **Manage Services**
   - Add new services
   - Toggle service active/inactive
   - Delete services

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #2563eb;
    --primary-purple: #9333ea;
    --dark-bg: #0f172a;
    --light-bg: #f8fafc;
}
```

### Services
Default services are defined in `script.js` in the `DataManager.init()` function.

### Images
Replace Unsplash URLs in `index.html` with your own images.

## 🌐 Deployment

### Static Hosting
Upload all files to any static hosting service:
- **GitHub Pages**: Push to a repo and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect to your repo
- **AWS S3**: Upload as static website

### Web Server
Simply copy all files to your web server's public directory:
```bash
# Example: Copy to Apache
cp -r MasterMods/* /var/www/html/

# Example: Copy to Nginx
cp -r MasterMods/* /usr/share/nginx/html/
```

## 🔄 Backend Integration

To connect to a real backend:

1. **Modify `script.js`** - Replace the `DataManager` functions with API calls:

```javascript
// Example: Replace addBooking
addBooking(bookingData) {
    // Old: localStorage
    // New: API call
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })
    .then(res => res.json())
    .then(data => {
        showToast('Booking created successfully!');
        // Update UI
    });
}
```

2. **Add Authentication**
   - Replace localStorage auth with JWT tokens
   - Add session management
   - Protect admin routes server-side

3. **API Endpoints**
   - `GET /api/bookings` - List bookings
   - `POST /api/bookings` - Create booking
   - `PATCH /api/bookings/:id` - Update booking
   - `DELETE /api/bookings/:id` - Delete booking
   - `GET /api/services` - List services
   - `POST /api/services` - Create service
   - etc.

## 🧪 Testing

1. Open `index.html` in a web browser
2. Submit a test booking
3. Go to `track-booking.html` and enter your email
4. Login to admin panel with `admin@mastermods.com`
5. Check that booking appears in admin panel
6. Update booking status
7. Refresh customer portal to see updated status

## 📋 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Custom Properties, Gradients
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome 6** - Icons
- **localStorage API** - Data persistence

## 📝 License

This is a demo project for MasterMods PC. Feel free to use and modify as needed.

## 🆘 Support

For questions or issues:
- Email: hello@mastermods.com
- Phone: +63 917 845 2210

---

**Last Updated:** March 15, 2026  
**Version:** 1.0.0
