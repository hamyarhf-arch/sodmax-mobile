// ==================== سیستم احراز هویت ====================

// متغیرهای گلوبال
let userManager;

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
    alert('🔐 بازیابی رمز عبور\nاین قابلیت به زودی فعال خواهد شد!');
}

// نمایش اپلیکیشن
function showApp() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
}

// نمایش فرم احراز هویت
function showAuth() {
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    showRegisterForm();
}

// تنظیم رویدادهای فرم‌ها
function setupAuthEvents() {
    console.log('🔧 تنظیم رویدادهای احراز هویت...');
    
    // تغییر بین فرم‌ها
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', showLoginForm);
        console.log('✅ دکمه "نمایش ورود" تنظیم شد');
    }
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', showRegisterForm);
        console.log('✅ دکمه "نمایش ثبت‌نام" تنظیم شد');
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', showForgotPasswordForm);
        console.log('✅ دکمه "فراموشی رمز" تنظیم شد');
    }
    
    // نمایش/پنهان کردن رمز عبور
    setupPasswordToggles();
    
    // ثبت‌نام
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('✅ فرم ثبت‌نام تنظیم شد');
    }
    
    // ورود
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ فرم ورود تنظیم شد');
    }
    
    console.log('✅ همه رویدادهای احراز هویت تنظیم شدند');
}

// تنظیم دکمه‌های نمایش رمز
function setupPasswordToggles() {
    // ثبت‌نام
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', function() {
            togglePasswordVisibility('registerPassword', this);
        });
    }
    
    const toggleRegisterConfirm = document.getElementById('toggleRegisterConfirmPassword');
    if (toggleRegisterConfirm) {
        toggleRegisterConfirm.addEventListener('click', function() {
            togglePasswordVisibility('registerConfirmPassword', this);
        });
    }
    
    // ورود
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            togglePasswordVisibility('loginPassword', this);
        });
    }
}

// تغییر وضعیت نمایش رمز
function togglePasswordVisibility(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// مدیریت ثبت‌نام
function handleRegister(e) {
    e.preventDefault();
    console.log('📝 ثبت‌نام در حال پردازش...');
    
    // اگر userManager وجود ندارد، ایجاد کن
    if (!userManager) {
        userManager = new UserManager();
        console.log('👤 UserManager ایجاد شد');
    }
    
    const name = document.getElementById('registerName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const referralCode = document.getElementById('registerReferralCode').value.trim() || null;
    
    let hasError = false;
    
    // اعتبارسنجی
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
    
    if (hasError) {
        console.log('❌ خطا در اعتبارسنجی فرم');
        return;
    }
    
    const registerBtn = document.getElementById('registerBtn');
    const originalText = registerBtn.innerHTML;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت‌نام...';
    
    // شبیه‌سازی تاخیر
    setTimeout(() => {
        try {
            console.log('📊 ارسال اطلاعات ثبت‌نام:', { name, phone });
            const result = userManager.register(name, phone, password, referralCode);
            
            if (result.success) {
                console.log('✅ ثبت‌نام موفق:', result.user.name);
                
                // نمایش پیام موفقیت
                alert(`✅ ثبت‌نام موفق\nسلام ${result.user.name}!\nحساب کاربری شما با موفقیت ایجاد شد.${result.referralBonus ? `\n${result.referralBonus} SOD پاداش دعوت دریافت کردید.` : ''}`);
                
                // ذخیره کاربر جاری
                localStorage.setItem('sodmax_current_user', JSON.stringify(result.user));
                
                // نمایش اپلیکیشن
                setTimeout(() => {
                    showApp();
                    console.log('📱 اپلیکیشن نمایش داده شد');
                }, 1000);
            } else {
                showError('phoneError', result.message);
                console.log('❌ خطا در ثبت‌نام:', result.message);
            }
        } catch (error) {
            console.error('🔥 خطا در ثبت‌نام:', error);
            alert('❌ خطا در سیستم ثبت‌نام. لطفاً دوباره تلاش کنید.');
        } finally {
            // بازنشانی دکمه
            registerBtn.disabled = false;
            registerBtn.innerHTML = originalText;
        }
    }, 1500);
}

// مدیریت ورود
function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 ورود در حال پردازش...');
    
    // اگر userManager وجود ندارد، ایجاد کن
    if (!userManager) {
        userManager = new UserManager();
        console.log('👤 UserManager ایجاد شد');
    }
    
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
    
    if (hasError) {
        console.log('❌ خطا در اعتبارسنجی فرم ورود');
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ورود...';
    
    setTimeout(() => {
        try {
            console.log('📊 ارسال اطلاعات ورود:', { phone });
            const result = userManager.login(phone, password);
            
            if (result.success) {
                console.log('✅ ورود موفق:', result.user.name);
                
                // نمایش پیام موفقیت
                alert(`✅ ورود موفق\nخوش آمدید ${result.user.name}!`);
                
                // نمایش اپلیکیشن
                setTimeout(() => {
                    showApp();
                    console.log('📱 اپلیکیشن نمایش داده شد');
                }, 1000);
            } else {
                showError('loginPhoneError', result.message);
                console.log('❌ خطا در ورود:', result.message);
            }
        } catch (error) {
            console.error('🔥 خطا در ورود:', error);
            alert('❌ خطا در سیستم ورود. لطفاً دوباره تلاش کنید.');
        } finally {
            // بازنشانی دکمه
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        }
    }, 1500);
}

// مقداردهی اولیه
function initializeAuth() {
    console.log('🚀 راه‌اندازی سیستم احراز هویت...');
    
    // بررسی وجود المان‌های ضروری
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    
    if (!authContainer || !appContainer) {
        console.error('❌ المان‌های اصلی صفحه یافت نشدند!');
        return;
    }
    
    console.log('✅ المان‌های صفحه یافت شدند');
    
    // ایجاد UserManager
    userManager = new UserManager();
    console.log('👤 UserManager ایجاد شد');
    
    // بررسی آیا کاربر وارد شده است
    const currentUser = userManager.getCurrentUser();
    
    if (currentUser) {
        console.log('👤 کاربر قبلاً وارد شده:', currentUser.name);
        // کاربر وارد شده - اپلیکیشن نمایش داده می‌شود
        showApp();
    } else {
        console.log('👤 کاربر وارد نشده - نمایش فرم‌ها');
        // نمایش فرم‌ها
        showAuth();
        setupAuthEvents();
    }
    
    console.log('✅ سیستم احراز هویت راه‌اندازی شد');
}

// اجرا وقتی DOM کاملاً آماده است
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM آماده شد');
    setTimeout(initializeAuth, 100);
});

// توابع کمکی برای نمایش خطاها
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        const span = errorElement.querySelector('span');
        if (span) span.textContent = message;
        errorElement.classList.add('show');
        
        const inputId = elementId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
        
        const inputId = elementId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
}
