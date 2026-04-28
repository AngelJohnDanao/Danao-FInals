document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('loginView');
    const portalView = document.getElementById('portalView');
    const portalLoginForm = document.getElementById('portalLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const customerEmailInput = document.getElementById('customerEmail');
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = bookingModal.querySelector('.modal-close');

    let currentEmail = '';

    const storedEmail = localStorage.getItem('customer_email');
    if (storedEmail) {
        customerEmailInput.value = storedEmail;
        loginCustomer(storedEmail);
    }

    portalLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginCustomer(customerEmailInput.value.trim());
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('customer_email');
            currentEmail = '';
            loginView.style.display = 'flex';
            portalView.style.display = 'none';
            showToast('Logged out successfully');
        });
    }

    modalClose.addEventListener('click', () => {
        bookingModal.classList.remove('active');
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
        }
    });

    function loginCustomer(email) {
        const bookings = DataManager.getBookings();
        const customerBookings = bookings.filter(
            b => b.email.toLowerCase() === email.toLowerCase()
        );

        if (customerBookings.length === 0) {
            showToast('No bookings found for this email address', 'error');
            return;
        }

        currentEmail = email;
        localStorage.setItem('customer_email', email);

        loginView.style.display = 'none';
        portalView.style.display = 'block';

        document.getElementById('customerEmailDisplay').textContent = email;

        displayBookings(customerBookings);
        updateStats(customerBookings);

        showToast(`Welcome back! Found ${customerBookings.length} booking(s)`);
    }

    /* ================= FIXED DETAILS RENDER ================= */

    function displayBookings(bookings) {
        const bookingsList = document.getElementById('bookingsList');
        const noBookings = document.getElementById('noBookings');

        if (!bookings.length) {
            bookingsList.style.display = 'none';
            noBookings.style.display = 'block';
            return;
        }

        bookingsList.style.display = 'grid';
        noBookings.style.display = 'none';

        const sorted = [...bookings].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        bookingsList.innerHTML = sorted.map(booking => `
            <div class="booking-card">

                <div class="booking-header">
                    <h3 class="booking-title">${booking.service}</h3>
                    ${getStatusBadge(booking.status)}
                </div>

                <div class="booking-details">

                    <div class="booking-detail">
                        <i class="fas fa-desktop"></i>
                        <span>Device: ${booking.deviceType || 'Not specified'}</span>
                    </div>

                    <div class="booking-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${booking.date} at ${booking.time}</span>
                    </div>

                    <div class="booking-detail">
                        <i class="fas fa-peso-sign"></i>
                        <span>Budget: ${booking.budget || 'N/A'}</span>
                    </div>

                    <div class="booking-detail">
                        <i class="fas fa-credit-card"></i>
                        <span>Payment: ${booking.payment || 'Not specified'}</span>
                    </div>

                    ${booking.branch ? `
                        <div class="booking-detail">
                            <i class="fas fa-location-dot"></i>
                            <span>Branch: ${booking.branch}</span>
                        </div>
                    ` : ''}

                </div>

                ${getStatusMessage(booking.status)}

                ${booking.message ? `
                    <div class="booking-message">
                        <strong>Message:</strong>
                        <p>${booking.message}</p>
                    </div>
                ` : ''}

                <button class="btn btn-outline btn-block"
                    style="margin-top:1rem;"
                    onclick="viewBookingDetails('${booking.id}')">
                    View Full Details
                </button>

                ${booking.status === 'pending' ? `
                    <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
                        <button class="btn btn-danger btn-block"
                            onclick="cancelBooking('${booking.id}')">
                            Cancel
                        </button>

                        <button class="btn btn-primary btn-block"
                            onclick="payDownpayment('${booking.id}')">
                            Downpayment
                        </button>
                    </div>
                ` : ''}

                <div class="booking-id">ID: ${booking.id}</div>
            </div>
        `).join('');
    }

    function updateStats(bookings) {
        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('pendingBookings').textContent =
            bookings.filter(b => b.status === 'pending').length;
        document.getElementById('completedBookings').textContent =
            bookings.filter(b => b.status === 'completed').length;
    }

    function getStatusBadge(status) {
        const map = {
            pending: 'Pending Review',
            confirmed: 'Confirmed',
            completed: 'Completed',
            cancelled: 'Cancelled'
        };
        return `<span class="badge ${status}">
            <i class="fas fa-circle"></i> ${map[status] || status}
        </span>`;
    }

    function getStatusMessage(status) {
        const messages = {
            pending: 'Your request is being reviewed.',
            confirmed: 'Your booking is confirmed.',
            completed: 'Service completed successfully.',
            cancelled: 'This booking was cancelled.'
        };
        return messages[status]
            ? `<p class="status-msg">${messages[status]}</p>`
            : '';
    }

    /* ================= FIXED MODAL DETAILS ================= */

    window.viewBookingDetails = function (id) {
        const bookings = DataManager.getBookings();
        const booking = bookings.find(b => b.id === id);
        if (!booking) return;

        document.getElementById('modalTitle').textContent =
            `Booking Details - ${booking.id}`;

        document.getElementById('modalContent').innerHTML = `
            <div>
                <h3>${booking.service}</h3>
                <p><strong>Device:</strong> ${booking.deviceType}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Branch:</strong> ${booking.branch || 'N/A'}</p>
                <p><strong>Payment:</strong> ${booking.payment}</p>
                <p><strong>Budget:</strong> ${booking.budget}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Status:</strong> ${booking.status}</p>

                ${booking.message ? `
                    <div style="margin-top:10px;">
                        <strong>Message:</strong>
                        <p>${booking.message}</p>
                    </div>
                ` : ''}
            </div>
        `;

        bookingModal.classList.add('active');
    };

    /* ================= WORKING BUTTONS (UNCHANGED) ================= */

    window.cancelBooking = function (id) {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        const allBookings = DataManager.getBookings();
        const updatedBookings = allBookings.map(b =>
            b.id === id ? { ...b, status: 'cancelled' } : b
        );

        localStorage.setItem('mastermods_bookings', JSON.stringify(updatedBookings));

        const customerBookings = updatedBookings.filter(
            b => b.email.toLowerCase() === currentEmail.toLowerCase()
        );

        displayBookings(customerBookings);
        updateStats(customerBookings);

        showToast("Booking has been cancelled");
    };

    window.payDownpayment = function (id) {
    const allBookings = DataManager.getBookings();
    const booking = allBookings.find(b => b.id === id);

    if (!booking) return;

    // compute downpayment (20% fallback to 500 if no budget)
    let budget = parseFloat((booking.budget || "0").toString().replace(/[^\d.]/g, ""));
    let downpayment = 200;

    const proceed = confirm(
        `Downpayment required: ₱${downpayment.toFixed(2)}\n\nProceed to payment?`
    );

    if (!proceed) return;

    showToast("Processing payment...");

    // simulate processing delay (more realistic than instant update)
    setTimeout(() => {
        const reference = "REF-" + Date.now().toString().slice(-8);

        const updatedBookings = allBookings.map(b =>
            b.id === id
                ? {
                    ...b,
                    status: "confirmed",
                    downpayment: true,
                    downpaymentAmount: downpayment,
                    paymentStatus: "paid",
                    paymentReference: reference,
                    paidAt: new Date().toISOString()
                }
                : b
        );

        localStorage.setItem("mastermods_bookings", JSON.stringify(updatedBookings));

        const customerBookings = updatedBookings.filter(
            b => b.email.toLowerCase() === currentEmail.toLowerCase()
        );

        displayBookings(customerBookings);
        updateStats(customerBookings);

        showToast(`Payment successful! Ref: ${reference}`);
    }, 1500);
};
});