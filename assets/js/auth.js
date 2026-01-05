// ==================== سیستم احراز هویت ====================

// متغیر گلوبال
let userManager;

// نمایش فرم ثبت‌نام
function showRegisterForm() {
    console.log('📋 نمایش فرم ثبت‌نام');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// نمایش فرم ورود
function showLoginForm() {
    console.log('🔐 نمایش فرم ورود');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// نمایش فرم فراموشی رمز
function showForgotPasswordForm() {
    console.log('🔑 نمایش فرم فراموشی رمز');
    alert('🔐 بازیابی رمز عبور\nاین قابلیت به زودی فعال خواهد شد!');
}

// نمایش اپلیکیشن
function showApp() {
    console.log('📱 نمایش پنل کاربری');
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    
    if (authContainer) {
        authContainer.classList.add('hidden');
        console.log('✅ فرم احراز هویت مخفی شد');
    }
    
    if (appContainer) {
        appContainer.classList.remove('hidden');
        console.log('✅ پنل کاربری نمایش داده شد');
        
        // نمایش نام کاربر در صفحه خوش آمدگویی
        const currentUser = userManager.getCurrentUser();
        if (currentUser) {
            const welcomeMessage = document.getElementById('welcomeMessage');
            if (welcomeMessage) {
                welcomeMessage.textContent = `خوش آمدید ${currentUser.name} عزیز!`;
            }
        }
    }
}

// نمایش فرم احراز هویت
function showAuth() {
    console.log('👋 نمایش فرم‌های احراز هویت');
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    showRegisterForm();
}

// تنظیم رویدادهای فرم‌ها
function setupAuthEvents() {
    console.log('🔧 در حال تنظیم رویدادهای فرم‌ها...');
    
    // تغییر بین فرم‌ها
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', showLoginForm);
        console.log('✅ دکمه "ورود به حساب" تنظیم شد');
    }
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', showRegisterForm);
        console.log('✅ دکمه "ثبت‌نام کنید" تنظیم شد');
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
    
    console.log('✅ تمام رویدادهای احراز هویت تنظیم شدند');
}

// تنظیم دکمه‌های نمایش رمز
function setupPasswordToggles() {
    console.log('👁️‍🗨️ تنظیم دکمه‌های نمایش رمز');
    
    // ثبت‌نام
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    if (toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener('click', function() {
            togglePasswordVisibility('registerPassword', this);
        });
        console.log('✅ دکمه نمایش رمز ثبت‌نام تنظیم شد');
    }
    
    const toggleRegisterConfirm = document.getElementById('toggleRegisterConfirmPassword');
    if (toggleRegisterConfirm) {
        toggleRegisterConfirm.addEventListener('click', function() {
            togglePasswordVisibility('registerConfirmPassword', this);
        });
        console.log('✅ دکمه نمایش تکرار رمز تنظیم شد');
    }
    
    // ورود
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            togglePasswordVisibility('loginPassword', this);
        });
        console.log('✅ دکمه نمایش رمز ورود تنظیم شد');
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
        console.log(`👁️ رمز ${inputId} نمایش داده شد`);
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        console.log(`🙈 رمز ${inputId} پنهان شد`);
    }
}

// مدیریت ثبت‌نام
function handleRegister(e) {
    e.preventDefault();
    console.log('📝 شروع پردازش ثبت‌نام...');
    
    // دریافت مقادیر فرم
    const name = document.getElementById('registerName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const referralCode = document.getElementById('registerReferralCode').value.trim() || null;
    
    console.log('📊 اطلاعات فرم:', { name, phone, referralCode });
    
    let hasError = false;
    
    // اعتبارسنجی نام
    if (name.length < 2) {
        showError('nameError', 'نام باید حداقل ۲ کاراکتر باشد');
        hasError = true;
    } else {
        hideError('nameError');
    }
    
    // اعتبارسنجی شماره موبایل
    if (!validatePhone(phone)) {
        showError('phoneError', 'شماره موبایل معتبر وارد کنید (مثال: 09123456789)');
        hasError = true;
    } else {
        hideError('phoneError');
    }
    
    // اعتبارسنجی رمز عبور
    if (password.length < 6) {
        showError('passwordError', 'رمز عبور باید حداقل ۶ کاراکتر باشد');
        hasError = true;
    } else {
        hideError('passwordError');
    }
    
    // اعتبارسنجی تکرار رمز عبور
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'رمز عبور با تکرار آن مطابقت ندارد');
        hasError = true;
    } else {
        hideError('confirmPasswordError');
    }
    
    // اگر خطایی وجود داشت، پردازش متوقف شود
    if (hasError) {
        console.log('❌ خطا در اعتبارسنجی فرم ثبت‌نام');
        return;
    }
    
    // غیرفعال کردن دکمه ثبت‌نام
    const registerBtn = document.getElementById('registerBtn');
    const originalText = registerBtn.innerHTML;
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت‌نام...';
    
    // شبیه‌سازی تاخیر برای پردازش
    setTimeout(() => {
        try {
            console.log('🔄 در حال ثبت‌نام کاربر...');
            const result = userManager.register(name, phone, password, referralCode);
            
            if (result.success) {
                console.log('✅ ثبت‌نام موفقیت‌آمیز:', result.user.name);
                
                // نمایش پیام موفقیت
                const message = referralCode ? 
                    `✅ ثبت‌نام موفق\nحساب کاربری ${result.user.name} با موفقیت ایجاد شد!\n${result.referralBonus} SOD پاداش دعوت دریافت کردید.` :
                    `✅ ثبت‌نام موفق\nحساب کاربری ${result.user.name} با موفقیت ایجاد شد!`;
                
                alert(message);
                
                // نمایش پنل کاربری
                setTimeout(() => {
                    showApp();
                    console.log('🎉 کاربر به پنل کاربری منتقل شد');
                }, 1000);
            } else {
                // نمایش خطا
                showError('phoneError', result.message);
                console.log('❌ خطا در ثبت‌نام:', result.message);
            }
        } catch (error) {
            console.error('🔥 خطای سیستمی در ثبت‌نام:', error);
            alert('❌ خطای سیستمی در ثبت‌نام. لطفاً دوباره تلاش کنید.');
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
    console.log('🔐 شروع پردازش ورود...');
    
    // دریافت مقادیر فرم
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('📊 اطلاعات ورود:', { phone });
    
    let hasError = false;
    
    // اعتبارسنجی شماره موبایل
    if (phone.length === 0) {
        showError('loginPhoneError', 'شماره موبایل خود را وارد کنید');
        hasError = true;
    } else {
        hideError('loginPhoneError');
    }
    
    // اعتبارسنجی رمز عبور
    if (password.length === 0) {
        showError('loginPasswordError', 'رمز عبور خود را وارد کنید');
        hasError = true;
    } else {
        hideError('loginPasswordError');
    }
    
    // اگر خطایی وجود داشت، پردازش متوقف شود
    if (hasError) {
        console.log('❌ خطا در اعتبارسنجی فرم ورود');
        return;
    }
    
    // غیرفعال کردن دکمه ورود
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ورود...';
    
    // شبیه‌سازی تاخیر برای پردازش
    setTimeout(() => {
        try {
            console.log('🔄 در حال بررسی اطلاعات ورود...');
            const result = userManager.login(phone, password);
            
            if (result.success) {
                console.log('✅ ورود موفقیت‌آمیز:', result.user.name);
                
                // نمایش پیام موفقیت
                alert(`✅ ورود موفق\nخوش آمدید ${result.user.name} عزیز!`);
                
                // نمایش پنل کاربری
                setTimeout(() => {
                    showApp();
                    console.log('🎉 کاربر به پنل کاربری منتقل شد');
                }, 1000);
            } else {
                // نمایش خطا
                showError('loginPhoneError', result.message);
                console.log('❌ خطا در ورود:', result.message);
            }
        } catch (error) {
            console.error('🔥 خطای سیستمی در ورود:', error);
            alert('❌ خطای سیستمی در ورود. لطفاً دوباره تلاش کنید.');
        } finally {
            // بازنشانی دکمه
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        }
    }, 1500);
}

// مقداردهی اولیه سیستم احراز هویت
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
    
    // بررسی وضعیت ورود کاربر
    const currentUser = userManager.getCurrentUser();
    
    if (currentUser) {
        console.log('👤 کاربر قبلاً وارد شده:', currentUser.name);
        // کاربر وارد شده - نمایش پنل کاربری
        showApp();
    } else {
        console.log('👤 کاربر وارد نشده - نمایش فرم‌ها');
        // نمایش فرم‌های احراز هویت
        showAuth();
        setupAuthEvents();
    }
    
    console.log('✅ سیستم احراز هویت با موفقیت راه‌اندازی شد');
}

// اجرا وقتی DOM کاملاً آماده است
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM آماده شد - شروع راه‌اندازی...');
    setTimeout(initializeAuth, 100);
});
