const DataManager = {
    init() {
        if (!localStorage.getItem('mastermods_bookings')) {
            localStorage.setItem('mastermods_bookings', '[]');
        }

        if (!localStorage.getItem('mastermods_services')) {
            const defaultServices = [
                { id: 'SVC-001', name: 'PC Repair & Troubleshooting', category: 'Repair', price: '₱800 - ₱2,500', status: 'active' },
                { id: 'SVC-002', name: 'Virus Removal', category: 'Repair', price: '₱900 - ₱1,800', status: 'active' },
                { id: 'SVC-003', name: 'OS Installation', category: 'Repair', price: '₱700 - ₱1,500', status: 'active' },
                { id: 'SVC-004', name: 'Hardware Upgrade', category: 'Upgrade', price: '₱600 - ₱2,500', status: 'active' },
                { id: 'SVC-005', name: 'Laptop Repair', category: 'Repair', price: '₱1,000 - ₱4,000', status: 'active' },
                { id: 'SVC-006', name: 'Network Setup', category: 'Network', price: '₱1,200 - ₱4,000', status: 'active' },
                { id: 'SVC-007', name: 'Preventive Maintenance', category: 'Maintenance', price: '₱700 - ₱1,500', status: 'active' }
            ];

            localStorage.setItem('mastermods_services', JSON.stringify(defaultServices));
        }
    },

    getBookings() {
        return JSON.parse(localStorage.getItem('mastermods_bookings') || '[]');
    },

    addBooking(bookingData) {
        const bookings = this.getBookings();

        const newBooking = {
            id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,

            customer: bookingData.customer || '',
            email: bookingData.email || '',
            phone: bookingData.phone || '',
            address: bookingData.address || '',

            service: bookingData.service || '',
            deviceType: bookingData.deviceType || 'Not specified',

            branch: bookingData.branch || '',
            componentOption: bookingData.componentOption || 'None',

            payment: bookingData.payment && bookingData.payment.trim() !== ''
                ? bookingData.payment
                : 'Not specified',

            date: bookingData.date || 'TBD',
            time: bookingData.time || 'TBD',
            budget: bookingData.budget || '',
            message: bookingData.message || '',

            status: 'pending',
            createdAt: new Date().toISOString()
        };

        bookings.unshift(newBooking);
        localStorage.setItem('mastermods_bookings', JSON.stringify(bookings));

        return newBooking;
    }
};

/* ================= UTILITIES ================= */

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => toast.classList.remove('show'), 3500);
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function getBudget(serviceName) {
    const budgets = {
        'PC Repair & Troubleshooting': '₱800 - ₱2,500',
        'Virus Removal': '₱900 - ₱1,800',
        'OS Installation': '₱700 - ₱1,500',
        'Hardware Upgrade': '₱600 - ₱2,500',
        'Laptop Repair': '₱1,000 - ₱4,000',
        'Network Setup': '₱1,200 - ₱4,000',
        'Preventive Maintenance': '₱700 - ₱1,500'
    };

    return budgets[serviceName] || 'To be discussed';
}

/* ================= COMPONENT OPTIONS ================= */

const componentOptionsByService = {
    'PC Repair & Troubleshooting': [
        'No replacement needed',
        'RAM Upgrade',
        'SSD/HDD Replacement',
        'Power Supply Replacement',
        'GPU Installation',
        'Motherboard Repair'
    ],
    'Hardware Upgrade': [
        'RAM Upgrade',
        'SSD/HDD Replacement',
        'Power Supply Replacement',
        'GPU Installation',
        'Motherboard Repair'
    ]
};

function syncComponentOptions(form) {
    const serviceInput = form.querySelector('#service');
    const componentInput = form.querySelector('#componentOption');

    if (!serviceInput || !componentInput) return;

    const selectedService = serviceInput.value;

    const allowedOptions = componentOptionsByService[selectedService];

    componentInput.innerHTML = '';

    if (!allowedOptions) {
        componentInput.disabled = true;

        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Not applicable for this type of service. This is only available for Repairs and Upgrades.';
        componentInput.appendChild(option);

        return;
    }

    componentInput.disabled = false;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select component option';
    componentInput.appendChild(placeholder);

    allowedOptions.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        componentInput.appendChild(option);
    });
}

/* ================= FORM HELPERS ================= */

function setFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.classList.add('input-invalid');

    let errorNode = formGroup.querySelector('.form-error');
    if (!errorNode) {
        errorNode = document.createElement('p');
        errorNode.className = 'form-error';
        formGroup.appendChild(errorNode);
    }

    errorNode.textContent = message;
}

function clearFieldErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
}

function validateBookingForm(form) {
    clearFieldErrors(form);

    let valid = true;

    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const address = form.querySelector('#address');
    const service = form.querySelector('#service');
    const branch = form.querySelector('#branch');
    const message = form.querySelector('#message');

    if (!name.value.trim()) {
        setFieldError(name, 'Name is required.');
        valid = false;
    }

    const normalizedPhone = phone.value.replace(/[^\d]/g, '');
    if (normalizedPhone.length < 7 || normalizedPhone.length > 15) {
        setFieldError(phone, 'Enter a valid contact number.');
        valid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        valid = false;
    }

    if (address.value.trim().length < 10) {
        setFieldError(address, 'Please provide a complete address.');
        valid = false;
    }

    if (!service.value) {
        setFieldError(service, 'Please select a service.');
        valid = false;
    }

    if (!branch.value) {
        setFieldError(branch, 'Please select your preferred branch.');
        valid = false;
    }

    if (message.value.trim().length < 15) {
        setFieldError(message, 'Please provide a specific issue description (at least 15 characters).');
        valid = false;
    }

    return valid;
}

/* ================= ANIMATIONS ================= */

function initRevealAnimations() {
    const targets = document.querySelectorAll(
        '.section-header, .service-card, .about-card, .branch-card, .payment-item'
    );

    if (!targets.length) return;

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i * 35, 220)}ms`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
}

/* ================= PORTFOLIO (REARRANGED ONLY) ================= */

function initPortfolios() {
    const container = document.querySelector('.portfolio-grid');
    if (!container) return;

    const portfolios = [
        { name: 'TRISTAN IVAN AGAPITO', url: 'https://agapito-portfolio.netlify.app/' },
        { name: 'AARON UMANDAP', url: 'https://umandap-portfolio.netlify.app/' },
        { name: 'KEN TOMITA', url: 'https://tomita.netlify.app/' },
        { name: 'JOHN LOUIE PUNO', url: 'https://puno-port.netlify.app/' },
        { name: 'ANGEL DANAO', url: 'https://yourusername.github.io/portfolio-5/' },
        { name: 'CHARLES DESUYO', url: 'https://chrlsd.github.io/cip1101/?fbclid=IwY2xjawRcChZleHRuA2FlbQIxMABicmlkETEzVGEyMUlEb2ExbFFxaldYc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHiK4LNIA7OMXzT9YPzA4kplpJjdy48Zg_ZTtDYjZrC1nCqQGRallTp7bhpCd_aem_ogULlYuxpcVoGu4K-Mevrw' }
    ];

    container.innerHTML = portfolios.map(p => `
        <a class="portfolio-item" href="${p.url}" target="_blank">
            ${p.name}
        </a>
    `).join('');
}

/* ================= MAIN ================= */

document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();

    initRevealAnimations();
    initPortfolios();

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMobile = document.getElementById('navMobile');

    mobileMenuBtn?.addEventListener('click', () => {
        navMobile?.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');

            if (!target || target === '#') return;

            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                smoothScroll(target);
                navMobile?.classList.remove('active');
            }
        });
    });

    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        syncComponentOptions(bookingForm);

        bookingForm.querySelector('#service')?.addEventListener('change', () => {
            syncComponentOptions(bookingForm);
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateBookingForm(bookingForm)) {
                showToast('Please correct the highlighted fields.', 'error');
                return;
            }

            const formData = new FormData(bookingForm);
            const service = formData.get('service');

            const data = {
                customer: formData.get('name').trim(),
                email: formData.get('email').trim(),
                phone: formData.get('phone').trim(),
                address: formData.get('address').trim(),
                service,
                branch: formData.get('branch'),
                deviceType: formData.get('deviceType') || 'Not specified',
                componentOption: formData.get('componentOption') || 'None',
                payment: formData.get('payment') || 'Not specified',
                date: formData.get('preferredDate') || 'TBD',
                time: formData.get('preferredTime') || 'TBD',
                budget: getBudget(service),
                message: formData.get('message').trim()
            };

            DataManager.addBooking(data);

            bookingForm.reset();
            showToast('Service request submitted. Our team will contact you soon.');

            setTimeout(() => {
                if (confirm('Track your request now?')) {
                    window.location.href = 'track-booking.html';
                }
            }, 1000);
        });
    }
});