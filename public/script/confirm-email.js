window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');  // Get the email from the URL parameters
    if (email) {
        document.getElementById('email').value = email;
        document.getElementById('oldEmail').value = email;  // Set it in hidden field if needed
    }
};


async function resendCode() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter the email.');
        return;
    }

    const response = await fetch('/resend-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (response.ok) {
        alert('Verification code resent. Check your email.');
    } else {
        const error = await response.json();
        alert(`Failed to resend code: ${error.message}`);
    }
}