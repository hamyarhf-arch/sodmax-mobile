// ==================== UI Functions ====================

// نمایش/پنهان کردن منو
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
        console.log('📱 منو ' + (menu.classList.contains('active') ? 'باز' : 'بسته') + ' شد');
    }
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.remove('active');
        console.log('📱 منو بسته شد');
    }
}

// نمایش بخش‌های مختلف
function showSectionMobile(sectionId) {
    console.log('📄 نمایش بخش:', sectionId);
    
    // پنهان کردن همه بخش‌ها
    const sections = document.querySelectorAll('.content-section-mobile');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // نمایش بخش انتخاب شده
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // به‌روزرسانی منوی پایین
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
        }
    });
    
    // به‌روزرسانی منوی کناری
    const menuItems = document.querySelectorAll('.nav-item-mobile');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
        }
    });
    
    // بستن منو
    closeMenu();
}

// نمایش مودال
function showModalMobile(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        console.log('📦 مودال نمایش داده شد:', modalId);
    }
}

// بستن مودال
function closeModalMobile(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        console.log('📦 مودال بسته شد:', modalId);
    }
}

// نمایش نوتیفیکیشن‌ها
function showNotificationsMobile() {
    showModalMobile('notificationModal');
    console.log('🔔 نمایش نوتیفیکیشن‌ها');
}

// کپی لینک دعوت
function copyReferralLink() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    const link = currentUser.referralLink || `https://sodmax.city/invite/${currentUser.referralCode}`;
    
    copyToClipboard(link).then(success => {
        if (success) {
            alert('✅ لینک دعوت با موفقیت کپی شد!');
            console.log('📋 لینک دعوت کپی شد:', link);
        } else {
            alert('❌ خطا در کپی لینک دعوت');
        }
    });
}

// کپی کد دعوت
function copyReferralCode() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    copyToClipboard(currentUser.referralCode).then(success => {
        if (success) {
            alert('✅ کد دعوت با موفقیت کپی شد!');
            console.log('📋 کد دعوت کپی شد:', currentUser.referralCode);
        } else {
            alert('❌ خطا در کپی کد دعوت');
        }
    });
}

// اشتراک‌گذاری از طریق واتساپ
function shareViaWhatsApp() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    const message = `👋 به SODmAX CityVerse بپیوندید!\n\nلینک دعوت من: ${currentUser.referralLink}\nکد دعوت: ${currentUser.referralCode}\n\nبا ثبت‌نام از طریق لینک بالا، ۵۰۰ SOD هدیه دریافت کنید! 🎁`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    console.log('📱 اشتراک‌گذاری در واتساپ');
}

// اشتراک‌گذاری از طریق تلگرام
function shareViaTelegram() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    const message = `👋 به SODmAX CityVerse بپیوندید!\n\nلینک دعوت من: ${currentUser.referralLink}\nکد دعوت: ${currentUser.referralCode}\n\nبا ثبت‌نام از طریق لینک بالا، ۵۰۰ SOD هدیه دریافت کنید! 🎁`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUser.referralLink)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    console.log('📱 اشتراک‌گذاری در تلگرام');
}

// اشتراک‌گذاری از طریق اینستاگرام
function shareViaInstagram() {
    alert('📱 برای اشتراک‌گذاری در اینستاگرام، لطفاً لینک دعوت را کپی کرده و در استوری یا پست خود قرار دهید.');
    copyReferralLink();
    console.log('📱 اشتراک‌گذاری در اینستاگرام');
}

// برداشت تومان
function withdrawTomanMobile() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    if (currentUser.tomanBalance < 50000) {
        alert(`❌ موجودی تومان کافی نیست!\nحداقل برداشت: ۵۰,۰۰۰ تومان\nموجودی شما: ${formatNumber(currentUser.tomanBalance)} تومان`);
        return;
    }
    
    const amount = prompt('💰 مبلغ برداشت را وارد کنید (حداقل ۵۰,۰۰۰ تومان):', '50000');
    if (!amount || isNaN(amount) || parseInt(amount) < 50000) {
        alert('❌ مبلغ نامعتبر است! حداقل برداشت ۵۰,۰۰۰ تومان می‌باشد.');
        return;
    }
    
    const withdrawAmount = parseInt(amount);
    if (withdrawAmount > currentUser.tomanBalance) {
        alert(`❌ موجودی کافی نیست!\nموجودی شما: ${formatNumber(currentUser.tomanBalance)} تومان`);
        return;
    }
    
    if (confirm(`✅ آیا از برداشت ${formatNumber(withdrawAmount)} تومان اطمینان دارید؟`)) {
        currentUser.tomanBalance -= withdrawAmount;
        userManager.updateUser(currentUser);
        
        userManager.addTransaction(currentUser.id, {
            type: "برداشت تومان",
            amount: withdrawAmount,
            currency: "تومان",
            status: "در انتظار",
            icon: "fa-download",
            color: "var(--secondary)"
        });
        
        alert(`✅ درخواست برداشت ${formatNumber(withdrawAmount)} تومان ثبت شد!\nظرف ۲۴ ساعت کاری به حساب شما واریز می‌شود.`);
        console.log('💸 درخواست برداشت ثبت شد:', withdrawAmount);
        
        // به‌روزرسانی UI
        const quickTomanBalance = document.getElementById('quickTomanBalance');
        if (quickTomanBalance) {
            quickTomanBalance.textContent = formatNumber(currentUser.tomanBalance);
        }
    }
}

// خرید SOD
function buySodMobile() {
    alert('🛒 بخش خرید SOD به زودی فعال خواهد شد!\n\nدر حال حاضر می‌توانید از طریق استخراج و دعوت دوستان SOD کسب کنید.');
    console.log('🛒 درخواست خرید SOD');
}

// تبدیل ارز
function convertCurrencyMobile() {
    alert('🔄 بخش تبدیل ارز به زودی فعال خواهد شد!');
    console.log('🔄 درخواست تبدیل ارز');
}

// دریافت پاداش روزانه
function claimDailyReward() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    const dailyReward = 1000; // 1000 SOD پاداش روزانه
    
    currentUser.sodBalance += dailyReward;
    currentUser.todayEarned += dailyReward;
    currentUser.totalMined += dailyReward;
    
    userManager.updateUser(currentUser);
    
    // نمایش افکت
    createMiningEffect(dailyReward);
    
    alert(`🎁 پاداش روزانه دریافت شد!\n+${dailyReward} SOD به حساب شما اضافه شد.`);
    console.log('🎁 پاداش روزانه دریافت شد:', dailyReward);
    
    // به‌روزرسانی UI
    const quickSodBalance = document.getElementById('quickSodBalance');
    if (quickSodBalance) {
        quickSodBalance.textContent = formatNumber(currentUser.sodBalance);
    }
}

// تکمیل مأموریت
function completeMissionMobile(missionId) {
    const rewards = {
        1: { amount: 500, currency: "تومان", type: "تومان" },
        2: { amount: 1000, currency: "تومان", type: "تومان" }
    };
    
    const reward = rewards[missionId];
    if (!reward) return;
    
    alert(`🎯 مأموریت تکمیل شد!\nپاداش: +${reward.amount} ${reward.currency}`);
    console.log('🎯 مأموریت تکمیل شد:', missionId);
}

// ویرایش پروفایل
function editProfileMobile() {
    alert('👤 بخش ویرایش پروفایل به زودی فعال خواهد شد!');
    console.log('👤 درخواست ویرایش پروفایل');
}

// تغییر رمز عبور
function changePasswordMobile() {
    alert('🔐 بخش تغییر رمز عبور به زودی فعال خواهد شد!');
    console.log('🔐 درخواست تغییر رمز عبور');
}

// شروع چت پشتیبانی
function startChatSupport() {
    alert('💬 چت پشتیبانی به زودی فعال خواهد شد!\n\nدر صورت نیاز می‌توانید از طریق ایمیل با ما در ارتباط باشید.');
    console.log('💬 درخواست چت پشتیبانی');
}

// نمایش همه مأموریت‌ها
function showAllMissionsMobile() {
    showSectionMobile('missions');
    console.log('📋 نمایش همه مأموریت‌ها');
}

// دریافت همه پاداش‌ها
function claimAllRewardsMobile() {
    alert('🎁 دریافت همه پاداش‌ها\nاین قابلیت به زودی فعال خواهد شد!');
    console.log('🎁 درخواست دریافت همه پاداش‌ها');
}

// نمایش آمار استخراج
function showMiningStatsMobile() {
    showSectionMobile('mining');
    console.log('📊 نمایش آمار استخراج');
}

// افزایش قدرت استخراج
function boostMiningMobile() {
    alert('⚡ افزایش قدرت استخراج\nاین قابلیت به زودی فعال خواهد شد!');
    console.log('⚡ درخواست افزایش قدرت استخراج');
}

// استخراج خودکار
function toggleAutoMiningMobile() {
    alert('🤖 استخراج خودکار\nاین قابلیت به زودی فعال خواهد شد!');
    console.log('🤖 درخواست استخراج خودکار');
}

// تنظیمات زبان
function languageSettingsMobile() {
    alert('🌐 تنظیمات زبان و منطقه\nاین قابلیت به زودی فعال خواهد شد!');
    console.log('🌐 درخواست تنظیمات زبان');
}
