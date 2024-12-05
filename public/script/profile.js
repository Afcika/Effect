document.addEventListener('DOMContentLoaded', () => {
    const buttonPersonalInfo = document.getElementById('showPersonalInfoButton');
    const buttonChangePassword = document.getElementById('showChangePasswordButton');
    const buttonChangeEmail = document.getElementById('showChangeEmailButton');
    const divPersonalInfo = document.getElementById('profile_div_right');
    const divChangePassword = document.getElementById('profile_div_right_second');
    const divChangeEmail = document.getElementById('profile_div_right_third');

    if (buttonPersonalInfo && buttonChangePassword && buttonChangeEmail && divPersonalInfo && divChangePassword && divChangeEmail) {
        buttonPersonalInfo.addEventListener("click", function() {
            toggleVisibility(divPersonalInfo, [divChangePassword, divChangeEmail]);
        });

        buttonChangePassword.addEventListener("click", function() {
            toggleVisibility(divChangePassword, [divPersonalInfo, divChangeEmail]);
        });

        buttonChangeEmail.addEventListener("click", function() {
            toggleVisibility(divChangeEmail, [divPersonalInfo, divChangePassword]);
        });
    }

    function toggleVisibility(showDiv, hideDivs) {
        hideDivs.forEach(hideDiv => {
            hideDiv.style.display = "none";
        });
        showDiv.style.display = "flex";
    }

    const divBars = document.querySelectorAll('.div_bar button');
    divBars.forEach((bar) => {
        bar.addEventListener('click', function() {
            divBars.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    async function fetchUserProfile() {
        try {
            const response = await fetch('/api/users/profile', {
                method: 'GET',
            });
    
            if (!response.ok) {
                const errorText = await response.json();
                throw new Error(`Error fetching user data: ${response.status} - ${errorText}`);
            }
    
            const userData = await response.json();
            const userNameInput = document.querySelector('#userName');
            const userEmailInput = document.querySelector('#userEmail');
            const userRoleInput = document.querySelector('#userRole');
            const statusInput = document.querySelector('#status');
    
            if (userNameInput && userEmailInput && userRoleInput && statusInput) {
                userNameInput.value = userData.name || '';
                userEmailInput.value = userData.email || '';
                
                // Check role_id and set appropriate role text
                userRoleInput.value = userData.role_id === 1 ? 'Admin' : 'User'; // Assuming role_id 1 is for Admin
                
                statusInput.value = userData.status || '';
            }
            console.log('User Data:', JSON.stringify(userData, null, 2));
            
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    

    fetchUserProfile();

    const updatePasswordForm = document.getElementById('updatePasswordForm');
    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                document.getElementById('responseMessage').innerText = 'All fields are required.';
                return;
            }

            try {
                const response = await fetch('/user/api/update-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
                });

                const result = await response.text();

                if (response.ok) {
                    document.getElementById('responseMessage').innerText = 'პაროლი წარმატებით შეიცვალა';
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                } else {
                    document.getElementById('responseMessage').innerText = result;
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('responseMessage').innerText = 'წარუმატებელია';
            }
        });
    }
    document.getElementById('showLogoutButton').addEventListener('click', () => {
        // Confirm logout action
        Swal.fire({
            title: 'დარწმუნებული ხარ?',
            
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'დიახ'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/user/logout', {
                    method: 'POST',
                    credentials: 'include', // Include cookies for session management
                })
                .then(response => {
                    if (response.ok) {
                        Swal.fire('Logged out!', 'You have been logged out.', 'success');
                        // Redirect to login page or home page
                        window.location.href = '/login'; // Change this URL as needed
                    } else {
                        Swal.fire('Error!', 'Could not log out. Please try again.', 'error');
                    }
                })
                .catch(error => console.error('Error during logout:', error));
            }
        });
    });
    
});

