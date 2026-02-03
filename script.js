// Firebase Configuration (Replace with your own from Firebase console)
const firebaseConfig = {
    apiKey: "your_api_key",  // Replace with your Firebase API key
    authDomain: "your_project.firebaseapp.com",  // Replace with your project domain
    projectId: "your_project_id",  // Replace with your project ID
    storageBucket: "your_project.appspot.com",  // Replace with your storage bucket
    messagingSenderId: "123456789",  // Replace with your sender ID
    appId: "your_app_id"  // Replace with your app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Modal Functions (unchanged)
    window.openBookingModal = function(destination = '') {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'block';
            if (destination) {
                const destField = document.getElementById('destination');
                if (destField) destField.value = destination;
            }
        }
    };

    window.closeBookingModal = function() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Form Submission Handler (now saves to Firestore)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            const travelers = document.getElementById('travelers').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !email || !destination || !date || !travelers) {
                alert('Please fill in all required fields.');
                return;
            }

            // Disable submit button
            const submitBtn = document.querySelector('.confirm-btn');
            if (submitBtn) submitBtn.disabled = true;

            // Save to Firestore
            db.collection('bookings').add({
                name: name,
                phone: phone,
                email: email,
                destination: destination,
                date: date,
                travelers: parseInt(travelers),
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'  // For admin to mark as processed
            })
            .then(function(docRef) {
                console.log('Booking saved with ID: ', docRef.id);
                alert('Booking confirmed! We will contact you soon.');
                bookingForm.reset();
                closeBookingModal();
            })
            .catch(function(error) {
                console.error('Error saving booking: ', error);
                alert('Failed to save booking. Please try again.');
            })
            .finally(function() {
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }
});