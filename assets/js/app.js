// ==================== اپلیکیشن اصلی ====================

// تعریف متغیرهای گلوبال
let userManager;
let mobileClient;

// راه‌اندازی اپلیکیشن
function initializeMobile() {
    // مقداردهی مدیر کاربران
    userManager = new UserManager();
    
    // مقداردهی کلاینت موبایل
    mobileClient = new MobileCityVerse();
    mobileClient.userManager = userManager;
    
    // بررسی وضعیت ورود کاربر
    const currentUser = userManager.getCurrentUser();
    
    if (currentUser) {
        mobileClient.currentUser = currentUser;
        showApp();
        updateMobileUI();
        
        if (currentUser.autoMining) {
            mobileClient.startAutoMining();
        }
        
        console.log('📱 SODmAX CityVerse Mobile راه‌اندازی شد!');
    } else {
        showAuth();
    }
    
    // تنظیم رویدادها
    setupAuthEvents();
    setupUIEvents();
    
    // تست ویبره
    vibrateTest();
}

// تنظیم رویدادهای UI
function setupUIEvents() {
    // کلیک خارج از منو
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('mobileMenu');
        const menuBtn = document.querySelector('.header-btn:nth-child(2)');
        
        if (menu && menu.classList.contains('active') && 
            !menu.contains(event.target) && 
            menuBtn && !menuBtn.contains(event.target)) {
            closeMenu();
        }
    });
    
    // کلیک خارج از مودال
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-mobile-overlay')) {
            event.target.classList.remove('active');
        }
    });
    
    // جلوگیری از اسکرول هنگام باز بودن منو یا مودال
    document.addEventListener('touchmove', function(event) {
        const menu = document.getElementById('mobileMenu');
        const modal = document.querySelector('.modal-mobile-overlay.active');
        
        if ((menu && menu.classList.contains('active')) || modal) {
            event.preventDefault();
        }
    }, { passive: false });
    
    // تنظیمات سوئیچ‌ها
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const soundToggle = document.getElementById('soundToggle');
    const vibrationToggle = document.getElementById('vibrationToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function(e) {
            showToastMobile('🌙 حالت شب', this.checked ? 'فعال شد' : 'غیرفعال شد', 'info');
        });
    }
    
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', function(e) {
            showToastMobile('🔔 اعلان‌ها', this.checked ? 'فعال شد' : 'غیرفعال شد', 'info');
        });
    }
    
    if (soundToggle) {
        soundToggle.addEventListener('change', function(e) {
            showToastMobile('🔊 صدا', this.checked ? 'فعال شد' : 'غیرفعال شد', 'info');
        });
    }
    
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', function(e) {
            showToastMobile('📳 ویبره', this.checked ? 'فعال شد' : 'غیرفعال شد', 'info');
        });
    }
    
    // توقف استخراج هنگام بستن صفحه
    window.addEventListener('beforeunload', function() {
        if (mobileClient) {
            mobileClient.stopAutoMining();
            mobileClient.clearBoostTimer();
        }
    });
}

// تست ویبره
function vibrateTest() {
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
}

// شروع اپلیکیشن
document.addEventListener('DOMContentLoaded', initializeMobile);
