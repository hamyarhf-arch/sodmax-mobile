// ==================== رابط کاربری ====================

// نمایش سکشن
function showSectionMobile(sectionId) {
    document.querySelectorAll('.content-section-mobile').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    
    document.querySelectorAll('.nav-item-mobile').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item-mobile[href="#${sectionId}"]`)?.classList.add('active');
    
    closeMenu();
    
    window.scrollTo(0, 0);
}

// مدیریت منو
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
}

// مدیریت مودال
function showModalMobile(modalId) {
    document.getElementById(modalId).classList.add('active');
    closeMenu();
}

function closeModalMobile(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// نمایش توست
function showToastMobile(title, message, type = 'info') {
    const container = document.getElementById('toastContainerMobile') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast-mobile';
    
    let icon = 'fa-bell';
    let borderColor = 'var(--primary)';
    
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            borderColor = 'var(--success)';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            borderColor = 'var(--error)';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            borderColor = 'var(--warning)';
            break;
    }
    
    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `
        <div class="toast-icon-mobile" style="background: ${borderColor};">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content-mobile">
            <div class="toast-title-mobile">${title}</div>
            <div class="toast-message-mobile">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ایجاد کانتینر توست
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container-mobile';
    container.id = 'toastContainerMobile';
    document.body.appendChild(container);
    return container;
}

// به‌روزرسانی UI
function updateMobileUI() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    document.getElementById('userAvatar').textContent = getAvatarFromName(user.name);
    document.getElementById('userNameDisplay').textContent = user.name;
    document.getElementById('userLevelDisplay').textContent = `آنلاین - سطح ${user.level}`;
    
    document.getElementById('quickSodBalance').textContent = formatNumber(user.sodBalance);
    document.getElementById('quickTomanBalance').textContent = formatNumber(user.tomanBalance);
    document.getElementById('quickReferralCount').textContent = user.referralCount;
    
    const earned = (user.miningPower || 5) * (user.miningMultiplier || 1);
    document.getElementById('clickRewardMobile').textContent = `+${earned} SOD`;
    document.getElementById('miningPowerMobile').textContent = `${earned}x`;
    document.getElementById('miningTodayMobile').textContent = formatNumber(user.todayEarned || 0);
    document.getElementById('miningTotalMobile').textContent = formatNumber(user.totalMined || 0);
    document.getElementById('miningTodayText').textContent = `+${(user.todayEarned || 0).toLocaleString('fa-IR')} SOD`;
    
    document.getElementById('minerLevel').textContent = user.level;
    const nextLevelCost = mobileClient.getNextLevelCost(user.level);
    document.getElementById('nextLevelCost').textContent = nextLevelCost.toLocaleString('fa-IR');
    document.getElementById('currentPower').textContent = `${user.miningPower || 5}x`;
    document.getElementById('nextPower').textContent = `${(user.miningPower || 5) + 5}x`;
    document.getElementById('upgradeCost').textContent = `${nextLevelCost.toLocaleString('fa-IR')} SOD`;
    document.getElementById('upgradeCostBtn').textContent = formatNumber(nextLevelCost);
    
    document.getElementById('walletSodBalance').textContent = (user.sodBalance || 0).toLocaleString('fa-IR');
    document.getElementById('walletTomanBalance').textContent = (user.tomanBalance || 0).toLocaleString('fa-IR');
    
    document.getElementById('menuSodBalance').textContent = formatNumber(user.sodBalance);
    document.getElementById('menuTomanBalance').textContent = formatNumber(user.tomanBalance);
    document.getElementById('menuTotalEarned').textContent = formatNumber(user.totalEarned);
    document.getElementById('inviteBadge').textContent = user.referralCount;
    
    document.getElementById('referralCountMobile').textContent = `${user.referralCount} دوست دعوت کرده‌اید`;
    document.getElementById('totalReferralEarningsMobile').textContent = formatNumber(user.referralEarnings);
    document.getElementById('referralLinkMobile').textContent = user.referralLink;
    document.getElementById('referralCodeMobile').textContent = user.referralCode;
    
    const referrals = userManager.getReferrals(user.id);
    if (referrals) {
        document.getElementById('totalInvitesMobile').textContent = referrals.totalInvites;
        document.getElementById('activeInvitesMobile').textContent = referrals.activeInvites;
        document.getElementById('pendingInvitesMobile').textContent = referrals.pendingInvites;
        document.getElementById('totalEarnedInvitesMobile').textContent = formatNumber(referrals.totalEarned);
    }
    
    const mission1 = mobileClient.gameData.missions.active[0];
    if (mission1) {
        const progressPercent = (mission1.progress / mission1.max) * 100;
        document.getElementById('mission1Progress').style.width = `${progressPercent}%`;
        document.getElementById('mission1Text').textContent = `${mission1.progress}/${mission1.max}`;
    }
    
    const mission2 = mobileClient.gameData.missions.active[1];
    if (mission2) {
        const progressPercent = (mission2.progress / mission2.max) * 100;
        document.getElementById('mission2Progress').style.width = `${progressPercent}%`;
        document.getElementById('mission2Text').textContent = `${mission2.progress}/${mission2.max}`;
    }
    
    document.getElementById('profileAvatar').textContent = getAvatarFromName(user.name);
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profilePhone').innerHTML = `<i class="fas fa-phone"></i> ${user.phone}`;
    document.getElementById('profileLevel').textContent = user.level;
    document.getElementById('profileJoinDate').textContent = user.joinDate;
    document.getElementById('profileLastLogin').textContent = user.lastLogin;
    document.getElementById('profileReferrals').textContent = user.referralCount;
    document.getElementById('profileTotalEarned').textContent = formatNumber(user.totalEarned);
    document.getElementById('completedMissions').textContent = user.completedMissions || 0;
    
    updateTransactionHistory();
    updateNotifications();
    
    const unreadCount = userManager.getUnreadNotificationsCount(user.id);
    document.getElementById('notificationBadge').textContent = unreadCount > 0 ? unreadCount : '';
}

// به‌روزرسانی تاریخچه تراکنش‌ها
function updateTransactionHistory() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const transactions = userManager.getTransactions(user.id);
    const container = document.getElementById('transactionHistory');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary);">
                <i class="fas fa-history" style="font-size: 32px; margin-bottom: var(--space-md); display: block; opacity: 0.5;"></i>
                <div style="font-size: 14px; margin-bottom: var(--space-xs);">هیچ تراکنشی ثبت نشده است</div>
                <div style="font-size: 12px; opacity: 0.7;">پس از انجام تراکنش، تاریخچه اینجا نمایش داده می‌شود</div>
            </div>
        `;
        return;
    }
    
    transactions.slice(0, 10).forEach(transaction => {
        const isNegative = transaction.amount < 0;
        const amountText = isNegative ? 
            `-${Math.abs(transaction.amount).toLocaleString('fa-IR')}` : 
            `+${transaction.amount.toLocaleString('fa-IR')}`;
        
        const amountColor = isNegative ? 'var(--accent)' : 
            (transaction.currency === 'SOD' ? 'var(--primary)' : 'var(--secondary)');
        
        const iconClass = transaction.icon || 'fa-exchange-alt';
        
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        transactionEl.onclick = () => {
            showToastMobile(transaction.type, 
                `مبلغ: ${amountText} ${transaction.currency}<br>تاریخ: ${transaction.date}<br>وضعیت: ${transaction.status}`, 
                'info'
            );
        };
        
        transactionEl.innerHTML = `
            <div class="transaction-icon" style="background: ${transaction.color}; color: white;">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.type}</div>
                <div class="transaction-date">${transaction.date}</div>
            </div>
            <div class="transaction-amount" style="color: ${amountColor}">
                ${amountText}<br>
                <small style="font-size: 10px; font-weight: normal; opacity: 0.8;">${transaction.currency}</small>
            </div>
        `;
        container.appendChild(transactionEl);
    });
}

// به‌روزرسانی نوتیفیکیشن‌ها
function updateNotifications() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const notifications = userManager.getNotifications(user.id);
    const container = document.getElementById('notificationsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--space-xl); color: var(--text-tertiary); font-size: 12px;">
                <i class="fas fa-bell-slash" style="font-size: 24px; margin-bottom: var(--space-sm); display: block;"></i>
                هیچ نوتیفیکیشنی وجود ندارد
            </div>
        `;
        return;
    }
    
    notifications.forEach(notification => {
        const notificationEl = document.createElement('div');
        notificationEl.style.cssText = `
            padding: var(--space-md); 
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: ${notification.read ? 'transparent' : 'rgba(0, 102, 255, 0.05)'};
            cursor: pointer;
        `;
        notificationEl.onclick = () => {
            userManager.markNotificationAsRead(notification.id);
            updateNotifications();
            updateMobileUI();
        };
        notificationEl.innerHTML = `
            <div style="font-size: 13px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                ${notification.title}
            </div>
            <div style="font-size: 12px; color: var(--text-secondary);">
                ${notification.message}
            </div>
            <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 6px;">
                ${notification.time}
            </div>
        `;
        container.appendChild(notificationEl);
    });
}

// عملکردهای استخراج
function manualMineMobile() {
    if (!mobileClient.currentUser) {
        showToastMobile('⚠️ خطا', 'لطفاً ابتدا وارد شوید', 'error');
        return;
    }
    
    const earned = mobileClient.mine(mobileClient.currentUser);
    
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && soundToggle.checked) {
        mobileClient.playMiningSound();
    }
    
    const vibrationToggle = document.getElementById('vibrationToggle');
    if (vibrationToggle && vibrationToggle.checked && navigator.vibrate) {
        vibrate([50, 30, 50]);
    }
    
    mobileClient.createMiningEffect(earned);
    updateMobileUI();
    showToastMobile('⚡ استخراج موفق', `+${earned} SOD دریافت کردید!`, 'success');
}

function toggleAutoMiningMobile() {
    if (!mobileClient.currentUser) return;
    
    const isAutoMining = mobileClient.toggleAutoMining(mobileClient.currentUser);
    
    showToastMobile(
        isAutoMining ? '🤖 استخراج خودکار' : '⏹️ استخراج دستی',
        isAutoMining ? 'استخراج خودکار فعال شد!' : 'استخراج خودکار متوقف شد',
        'info'
    );
    
    updateMobileUI();
}

function boostMiningMobile() {
    if (!mobileClient.currentUser) return;
    
    if (mobileClient.boostMining(mobileClient.currentUser)) {
        updateMobileUI();
        showToastMobile('⚡ افزایش قدرت', 'قدرت استخراج شما ۳ برابر شد! (۳۰ ثانیه)', 'success');
    } else {
        showToastMobile('⚠️ خطا', 'موجودی SOD کافی نیست!', 'error');
    }
}

function upgradeMinerMobile() {
    if (!mobileClient.currentUser) return;
    
    if (mobileClient.upgradeMiner(mobileClient.currentUser)) {
        updateMobileUI();
        showToastMobile('🆙 ارتقاء موفق', 'قدرت ماینر +۵ افزایش یافت!', 'success');
    } else {
        showToastMobile('⚠️ خطا', 'موجودی SOD کافی نیست!', 'error');
    }
}

// عملکردهای پاداش و مأموریت
function completeMissionMobile(missionId) {
    if (!mobileClient.currentUser) return;
    
    const reward = mobileClient.completeMission(mobileClient.currentUser, missionId);
    if (reward) {
        updateMobileUI();
        showToastMobile('✅ مأموریت تکمیل شد', `+${reward.toLocaleString('fa-IR')} تومان دریافت کردید!`, 'success');
    }
}

function claimRewardMobile(type) {
    if (!mobileClient.currentUser) return;
    
    const user = mobileClient.currentUser;
    const rewards = {
        sod: { amount: 10000, message: '۱۰,۰۰۰ SOD دریافت کردید!' },
        toman: { amount: 5000, message: '۵,۰۰۰ تومان دریافت کردید!' },
        boost: { amount: 3, message: 'افزایش قدرت ۳x فعال شد!' },
        premium: { amount: 7, message: '۷ روز اشتراک Pro دریافت کردید!' }
    };
    
    const reward = rewards[type];
    if (reward) {
        if (type === 'sod') {
            user.sodBalance += reward.amount;
            userManager.addTransaction(user.id, {
                type: "پاداش SOD",
                amount: reward.amount,
                currency: "SOD",
                status: "موفق",
                icon: "fa-gift",
                color: "var(--primary)"
            });
        }
        if (type === 'toman') {
            user.tomanBalance += reward.amount;
            userManager.addTransaction(user.id, {
                type: "پاداش تومان",
                amount: reward.amount,
                currency: "تومان",
                status: "موفق",
                icon: "fa-gift",
                color: "var(--secondary)"
            });
        }
        if (type === 'boost') {
            user.miningMultiplier = Math.max(user.miningMultiplier, 3);
            mobileClient.boostEndTime = Date.now() + 30000;
            mobileClient.startBoostTimer();
        }
        
        userManager.updateUser(user);
        updateMobileUI();
        showToastMobile('🎁 پاداش دریافت شد', reward.message, 'success');
    }
}

function claimAllRewardsMobile() {
    if (!mobileClient.currentUser) return;
    
    const user = mobileClient.currentUser;
    user.sodBalance += 10000;
    user.tomanBalance += 5000;
    user.miningMultiplier = Math.max(user.miningMultiplier, 3);
    
    userManager.addTransaction(user.id, {
        type: "دریافت همه پاداش‌ها",
        amount: 10000,
        currency: "SOD",
        status: "موفق",
        icon: "fa-gift",
        color: "var(--primary)"
    });
    
    userManager.addTransaction(user.id, {
        type: "دریافت همه پاداش‌ها",
        amount: 5000,
        currency: "تومان",
        status: "موفق",
        icon: "fa-gift",
        color: "var(--secondary)"
    });
    
    mobileClient.boostEndTime = Date.now() + 30000;
    mobileClient.startBoostTimer();
    
    userManager.updateUser(user);
    updateMobileUI();
    showToastMobile('🎁 همه پاداش‌ها', 'تمام پاداش‌ها دریافت شدند!', 'success');
}

function claimDailyReward() {
    if (!mobileClient.currentUser) return;
    
    const user = mobileClient.currentUser;
    const reward = 1000;
    user.tomanBalance += reward;
    user.totalEarned += reward;
    
    userManager.addTransaction(user.id, {
        type: "پاداش روزانه",
        amount: reward,
        currency: "تومان",
        status: "موفق",
        icon: "fa-calendar-alt",
        color: "var(--secondary)"
    });
    
    userManager.updateUser(user);
    updateMobileUI();
    showToastMobile('📅 پاداش روزانه', `+${reward.toLocaleString('fa-IR')} تومان دریافت کردید!`, 'success');
}

// عملکردهای کیف پول
function withdrawTomanMobile() {
    if (!mobileClient.currentUser) return;
    
    const amount = mobileClient.withdrawToman(mobileClient.currentUser);
    if (amount) {
        updateMobileUI();
        showToastMobile('✅ درخواست ثبت شد', 
            `${formatNumber(amount)} تومان برداشت شما ثبت شد.\nطی ۲۴ ساعت کاری واریز خواهد شد.`,
            'success'
        );
        closeModalMobile('walletModal');
    } else {
        showToastMobile('⚠️ خطا', 'حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است', 'error');
    }
}

function buySodMobile() {
    showToastMobile('🛒 خرید SOD', 'صفحه خرید به زودی فعال خواهد شد!', 'info');
}

function convertCurrencyMobile() {
    showToastMobile('💰 تبدیل ارز', 'سیستم تبدیل ارز به زودی فعال خواهد شد!', 'info');
}

// عملکردهای دعوت دوستان
function copyReferralLink() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const link = user.referralLink;
    
    copyToClipboard(link).then(success => {
        if (success) {
            showToastMobile('📋 کپی شد', 'لینک دعوت با موفقیت کپی شد!', 'success');
        } else {
            showToastMobile('⚠️ خطا', 'کپی کردن با مشکل مواجه شد', 'error');
        }
    });
}

function copyReferralCode() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const code = user.referralCode;
    
    copyToClipboard(code).then(success => {
        if (success) {
            showToastMobile('📋 کپی شد', 'کد دعوت با موفقیت کپی شد!', 'success');
        } else {
            showToastMobile('⚠️ خطا', 'کپی کردن با مشکل مواجه شد', 'error');
        }
    });
}

function shareViaWhatsApp() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const message = `به SODmAX CityVerse بپیوندید! 🌟\n\nبا استفاده از لینک زیر ثبت‌نام کنید و ۱۰۰۰ SOD هدیه دریافت کنید:\n${user.referralLink}\n\nکد دعوت: ${user.referralCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showToastMobile('📱 اشتراک‌گذاری', 'در حال بازکردن واتساپ...', 'info');
}

function shareViaTelegram() {
    const user = mobileClient.currentUser;
    if (!user) return;
    
    const message = `به SODmAX CityVerse بپیوندید! 🌟\n\nبا استفاده از لینک زیر ثبت‌نام کنید و ۱۰۰۰ SOD هدیه دریافت کنید:\n${user.referralLink}\n\nکد دعوت: ${user.referralCode}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(user.referralLink)}&text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showToastMobile('📱 اشتراک‌گذاری', 'در حال بازکردن تلگرام...', 'info');
}

function shareViaInstagram() {
    showToastMobile('📱 اینستاگرام', 'اشتراک‌گذاری در اینستاگرام به زودی فعال خواهد شد!', 'info');
}

function inviteFriendMobile() {
    if (!mobileClient.currentUser) return;
    
    if (mobileClient.inviteFriend(mobileClient.currentUser)) {
        updateMobileUI();
        showToastMobile('🤝 دعوت ارسال شد', 'دعوت شما ثبت شد. بعد از تأیید دوستتان، ۱,۰۰۰ تومان پاداش دریافت خواهید کرد!', 'info');
        
        setTimeout(() => {
            mobileClient.confirmReferral(mobileClient.currentUser.id);
            updateMobileUI();
            showToastMobile('🤝 دعوت تأیید شد', 'دوست شما ثبت‌نام و تأیید شد! +۱,۰۰۰ تومان پاداش دریافت کردید.', 'success');
        }, 3000);
    }
}

// عملکردهای پروفایل و تنظیمات
function editProfileMobile() {
    showToastMobile('👤 ویرایش پروفایل', 'صفحه ویرایش پروفایل به زودی فعال خواهد شد!', 'info');
}

function changePasswordMobile() {
    showToastMobile('🔐 تغییر رمز عبور', 'صفحه تغییر رمز عبور به زودی فعال خواهد شد!', 'info');
}

function languageSettingsMobile() {
    showToastMobile('🌐 زبان و منطقه', 'تنظیمات زبان به زودی فعال خواهد شد!', 'info');
}

function logoutMobile() {
    if (confirm('آیا از خروج از حساب کاربری خود مطمئن هستید؟')) {
        showToastMobile('👋 خروج از حساب', 'در حال خروج...', 'info');
        
        setTimeout(() => {
            mobileClient.stopAutoMining();
            mobileClient.clearBoostTimer();
            
            userManager.logout();
            mobileClient.currentUser = null;
            
            showAuth();
            showToastMobile('✅ خارج شدید', 'با موفقیت از حساب کاربری خارج شدید', 'success');
        }, 1500);
    }
}

function showAllMissionsMobile() {
    showSectionMobile('missions');
    showToastMobile('📋 همه مأموریت‌ها', 'لیست کامل مأموریت‌ها نمایش داده شد', 'info');
}

function showMiningStatsMobile() {
    showSectionMobile('mining');
}

function showNotificationsMobile() {
    showModalMobile('notificationModal');
}

function startChatSupport() {
    showToastMobile('💬 پشتیبانی', 'اتصال به اپراتور...', 'info');
}
