// ==================== سیستم احراز هویت ====================

// نمایش فرم ثبت‌نام
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// نمایش فرم ورود
function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// نمایش فرم فراموشی رمز
function showForgotPasswordForm() {
    showToastMobile('🔐 بازیابی رمز عبور', 'این قابلیت به زودی فعال خواهد شد!', 'info');
}

// نمایش اپلیکیشن
function showApp() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.add('active');
}

// نمایش فرم احراز هویت
function showAuth() {
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('appContainer').classList.remove('active');
    showRegisterForm();
}

// تنظیم رویدادهای فرم‌ها
function setupAuthEvents() {
    // تغییر بین فرم‌ها
    document.getElementById('showLoginBtn').addEventListener('click', showLoginForm);
    document.getElementById('showRegisterBtn').addEventListener('click', showRegisterForm);
    document.getElementById('forgotPasswordBtn').addEventListener('click', showForgotPasswordForm);
    
    // نمایش/پنهان کردن رمز عبور
    document.getElementById('toggleRegisterPassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('registerPassword');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    document.getElementById('toggleRegisterConfirmPassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('registerConfirmPassword');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    document.getElementById('toggleLoginPassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('loginPassword');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // ثبت‌نام
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // ورود
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
}

// مدیریت ثبت‌نام
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const referralCode = document.getElementById('registerReferralCode').value.trim() || null;
    
    let hasError = false;
    
    if (name.length < 2) {
        showError('nameError', 'نام باید حداقل ۲ کاراکتر باشد');
        hasError = true;
    } else {
        hideError('nameError');
    }
    
    if (!validatePhone(phone)) {
        showError('phoneError', 'شماره موبایل معتبر وارد کنید (مثال: 09123456789)');
        hasError = true;
    } else {
        hideError('phoneError');
    }
    
    if (password.length < 6) {
        showError('passwordError', 'رمز عبور باید حداقل ۶ کاراکتر باشد');
        hasError = true;
    } else {
        hideError('passwordError');
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'رمز عبور با تکرار آن مطابقت ندارد');
        hasError = true;
    } else {
        hideError('confirmPasswordError');
    }
    
    if (hasError) return;
    
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت‌نام...';
    
    setTimeout(() => {
        const result = userManager.register(name, phone, password, referralCode);
        
        if (result.success) {
            const message = referralCode ? 
                `حساب کاربری شما با موفقیت ایجاد شد! ${result.referralBonus} SOD پاداش دعوت دریافت کردید.` :
                'حساب کاربری شما با موفقیت ایجاد شد!';
            
            showToastMobile('✅ ثبت‌نام موفق', message, 'success');
            
            mobileClient.currentUser = result.user;
            localStorage.setItem('sodmax_current_user', JSON.stringify(result.user));
            
            setTimeout(() => {
                showApp();
                updateMobileUI();
                showSectionMobile('dashboard');
            }, 1500);
        } else {
            showError('phoneError', result.message);
            registerBtn.disabled = false;
            registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> ایجاد حساب کاربری';
        }
    }, 1500);
}

// مدیریت ورود
function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    let hasError = false;
    
    if (phone.length === 0) {
        showError('loginPhoneError', 'شماره موبایل خود را وارد کنید');
        hasError = true;
    } else {
        hideError('loginPhoneError');
    }
    
    if (password.length === 0) {
        showError('loginPasswordError', 'رمز عبور خود را وارد کنید');
        hasError = true;
    } else {
        hideError('loginPasswordError');
    }
    
    if (hasError) return;
    
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ورود...';
    
    setTimeout(() => {
        const result = userManager.login(phone, password);
        
        if (result.success) {
            showToastMobile('✅ ورود موفق', `خوش آمدید ${result.user.name}!`, 'success');
            
            mobileClient.currentUser = result.user;
            
            setTimeout(() => {
                showApp();
                updateMobileUI();
                showSectionMobile('dashboard');
            }, 1500);
        } else {
            showError('loginPhoneError', result.message);
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ورود به حساب';
        }
    }, 1500);
}
