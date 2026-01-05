// ==================== رابط کاربری ====================

import { formatNumber, getAvatarFromName, vibrate, createMiningEffect, createManualMiningEffect, showToastMobile } from './utils.js';

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

// به‌روزرسانی UI
async function updateMobileUI() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const user = window.mobileClient.currentUser;
        const userData = window.mobileClient.userData;
        
        if (!userData) {
            await window.mobileClient.loadUserData();
            return;
        }
        
        // به‌روزرسانی اطلاعات کاربر
        document.getElementById('userAvatar').textContent = getAvatarFromName(user.profile.name);
        document.getElementById('userNameDisplay').textContent = user.profile.name;
        document.getElementById('userLevelDisplay').textContent = `آنلاین - سطح ${user.profile.level}`;
        
        // آمار سریع
        if (userData.wallet) {
            document.getElementById('quickSodBalance').textContent = formatNumber(userData.wallet.sod_balance);
            document.getElementById('quickTomanBalance').textContent = formatNumber(userData.wallet.toman_balance);
            document.getElementById('walletSodBalance').textContent = userData.wallet.sod_balance.toLocaleString('fa-IR');
            document.getElementById('walletTomanBalance').textContent = userData.wallet.toman_balance.toLocaleString('fa-IR');
        }
        
        // دعوت‌ها
        if (userData.referrals) {
            document.getElementById('quickReferralCount').textContent = userData.referrals.total_invites;
            document.getElementById('inviteBadge').textContent = userData.referrals.total_invites;
            document.getElementById('referralCountMobile').textContent = `${userData.referrals.total_invites} دوست دعوت کرده‌اید`;
            document.getElementById('totalReferralEarningsMobile').textContent = formatNumber(userData.referrals.total_earned);
            document.getElementById('referralLinkMobile').textContent = user.profile.referral_link;
            document.getElementById('referralCodeMobile').textContent = user.profile.referral_code;
        }
        
        // استخراج
        if (window.mobileClient.gameData.miningStats) {
            const stats = window.mobileClient.gameData.miningStats;
            const earned = (stats.mining_power || 5) * (stats.mining_multiplier || 1);
            
            document.getElementById('clickRewardMobile').textContent = `+${earned} SOD`;
            document.getElementById('miningPowerMobile').textContent = `${earned}x`;
            document.getElementById('miningTodayMobile').textContent = formatNumber(stats.today_earned || 0);
            document.getElementById('miningTotalMobile').textContent = formatNumber(stats.total_mined || 0);
            document.getElementById('miningTodayText').textContent = `+${(stats.today_earned || 0).toLocaleString('fa-IR')} SOD`;
            
            document.getElementById('minerLevel').textContent = user.profile.level;
            const nextLevelCost = user.profile.level * 10000;
            document.getElementById('nextLevelCost').textContent = nextLevelCost.toLocaleString('fa-IR');
            document.getElementById('currentPower').textContent = `${stats.mining_power || 5}x`;
            document.getElementById('nextPower').textContent = `${(stats.mining_power || 5) + 5}x`;
            document.getElementById('upgradeCost').textContent = `${nextLevelCost.toLocaleString('fa-IR')} SOD`;
            document.getElementById('upgradeCostBtn').textContent = formatNumber(nextLevelCost);
        }
        
        // منو
        document.getElementById('menuSodBalance').textContent = formatNumber(userData.wallet?.sod_balance || 0);
        document.getElementById('menuTomanBalance').textContent = formatNumber(userData.wallet?.toman_balance || 0);
        document.getElementById('menuTotalEarned').textContent = formatNumber(user.profile.total_earned);
        
        // آمار دعوت
        if (userData.referrals) {
            document.getElementById('totalInvitesMobile').textContent = userData.referrals.total_invites;
            document.getElementById('activeInvitesMobile').textContent = userData.referrals.active_invites;
            document.getElementById('pendingInvitesMobile').textContent = userData.referrals.pending_invites;
            document.getElementById('totalEarnedInvitesMobile').textContent = formatNumber(userData.referrals.total_earned);
        }
        
        // پروفایل
        document.getElementById('profileAvatar').textContent = getAvatarFromName(user.profile.name);
        document.getElementById('profileName').textContent = user.profile.name;
        document.getElementById('profilePhone').innerHTML = `<i class="fas fa-phone"></i> ${user.profile.phone}`;
        document.getElementById('profileLevel').textContent = user.profile.level;
        document.getElementById('profileJoinDate').textContent = new Date(user.profile.join_date).toLocaleDateString('fa-IR');
        document.getElementById('profileLastLogin').textContent = new Date(user.profile.last_login).toLocaleDateString('fa-IR');
        document.getElementById('profileReferrals').textContent = user.profile.referral_count;
        document.getElementById('profileTotalEarned').textContent = formatNumber(user.profile.total_earned);
        
        // به‌روزرسانی تاریخچه تراکنش‌ها و نوتیفیکیشن‌ها
        updateTransactionHistory();
        updateNotifications();
        
    } catch (error) {
        console.error('خطا در به‌روزرسانی UI:', error);
    }
}

// به‌روزرسانی تاریخچه تراکنش‌ها
async function updateTransactionHistory() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const transactions = await window.mobileClient.userManager.getUserTransactions(window.mobileClient.currentUser.id, 10);
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
        
        transactions.forEach(transaction => {
            const isNegative = transaction.amount < 0;
            const amountText = isNegative ? 
                `-${Math.abs(transaction.amount).toLocaleString('fa-IR')}` : 
                `+${transaction.amount.toLocaleString('fa-IR')}`;
            
            const amountColor = isNegative ? 'var(--accent)' : 
                (transaction.currency === 'SOD' ? 'var(--primary)' : 'var(--secondary)');
            
            const iconClass = transaction.icon || 'fa-exchange-alt';
            const date = new Date(transaction.created_at).toLocaleDateString('fa-IR');
            
            const transactionEl = document.createElement('div');
            transactionEl.className = 'transaction-item';
            transactionEl.onclick = () => {
                showToastMobile(
                    transaction.type, 
                    `مبلغ: ${amountText} ${transaction.currency}<br>تاریخ: ${date}<br>وضعیت: ${transaction.status}`, 
                    'info'
                );
            };
            
            transactionEl.innerHTML = `
                <div class="transaction-icon" style="background: ${transaction.color}; color: white;">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${transaction.type}</div>
                    <div class="transaction-date">${date}</div>
                </div>
                <div class="transaction-amount" style="color: ${amountColor}">
                    ${amountText}<br>
                    <small style="font-size: 10px; font-weight: normal; opacity: 0.8;">${transaction.currency}</small>
                </div>
            `;
            container.appendChild(transactionEl);
        });
        
    } catch (error) {
        console.error('خطا در به‌روزرسانی تاریخچه تراکنش‌ها:', error);
    }
}

// به‌روزرسانی نوتیفیکیشن‌ها
async function updateNotifications() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const notifications = await window.mobileClient.userManager.getUserNotifications(window.mobileClient.currentUser.id, 20);
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
            notificationEl.onclick = async () => {
                await window.mobileClient.userManager.markNotificationAsRead(notification.id);
                notificationEl.style.background = 'transparent';
            };
            
            const time = new Date(notification.created_at).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            notificationEl.innerHTML = `
                <div style="font-size: 13px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                    ${notification.title}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary);">
                    ${notification.message}
                </div>
                <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 6px;">
                    ${time}
                </div>
            `;
            container.appendChild(notificationEl);
        });
        
        // به‌روزرسانی بج نوتیفیکیشن
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = unreadCount > 0 ? unreadCount : '';
        }
        
    } catch (error) {
        console.error('خطا در به‌روزرسانی نوتیفیکیشن‌ها:', error);
    }
}

// ==================== عملکردهای استخراج ====================

// استخراج دستی
async function manualMineMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) {
        showToastMobile('⚠️ خطا', 'لطفاً ابتدا وارد شوید', 'error');
        return;
    }
    
    try {
        // انیمیشن کلیک روی ماینر
        const minerElement = document.querySelector('.miner-3d-mobile');
        if (minerElement) {
            minerElement.style.animation = 'none';
            setTimeout(() => {
                minerElement.style.animation = 'minerClick 0.3s ease';
            }, 10);
        }
        
        // استخراج
        const earned = await window.mobileClient.mine();
        
        if (earned > 0) {
            // پخش صدا
            const soundToggle = document.getElementById('soundToggle');
            if (soundToggle && soundToggle.checked) {
                window.mobileClient.playMiningSound();
            }
            
            // ویبره
            const vibrationToggle = document.getElementById('vibrationToggle');
            if (vibrationToggle && vibrationToggle.checked && navigator.vibrate) {
                vibrate([50, 30, 50]);
            }
            
            // نمایش افکت ویژه برای استخراج دستی
            createManualMiningEffect(earned);
            
            // به‌روزرسانی UI
            await updateMobileUI();
            
            // نمایش توست
            showToastMobile('⚡ استخراج موفق', `+${earned} SOD دریافت کردید!`, 'success');
            
            // به‌روزرسانی آمار استخراج
            if (window.mobileClient.gameData.miningStats) {
                const stats = window.mobileClient.gameData.miningStats;
                document.getElementById('miningTodayText').textContent = `+${stats.today_earned.toLocaleString('fa-IR')} SOD`;
                
                // به‌روزرسانی power display
                const miningPower = (stats.mining_power || 5) * (stats.mining_multiplier || 1);
                document.getElementById('miningPowerMobile').textContent = `${miningPower}x`;
                document.getElementById('clickRewardMobile').textContent = `+${miningPower} SOD`;
            }
        } else {
            showToastMobile('⚠️ خطا', 'خطا در استخراج', 'error');
        }
        
    } catch (error) {
        console.error('خطا در استخراج دستی:', error);
        showToastMobile('⚠️ خطا', 'خطا در استخراج', 'error');
    }
}

// فعال/غیرفعال کردن استخراج اتوماتیک
async function toggleAutoMiningMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const isAutoMining = await window.mobileClient.toggleAutoMining();
        
        showToastMobile(
            isAutoMining ? '🤖 استخراج خودکار' : '⏹️ استخراج دستی',
            isAutoMining ? 'استخراج خودکار فعال شد!' : 'استخراج خودکار متوقف شد',
            'info'
        );
        
        // به‌روزرسانی UI
        await updateMobileUI();
        
    } catch (error) {
        console.error('خطا در تغییر وضعیت استخراج اتوماتیک:', error);
        showToastMobile('⚠️ خطا', 'خطا در تغییر وضعیت استخراج', 'error');
    }
}

// افزایش قدرت استخراج (بوست)
async function boostMiningMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const success = await window.mobileClient.boostMining();
        
        if (success) {
            await updateMobileUI();
            showToastMobile('⚡ افزایش قدرت', 'قدرت استخراج شما ۳ برابر شد! (۳۰ ثانیه)', 'success');
        } else {
            showToastMobile('⚠️ خطا', 'موجودی SOD کافی نیست!', 'error');
        }
    } catch (error) {
        console.error('خطا در افزایش قدرت استخراج:', error);
        showToastMobile('⚠️ خطا', 'خطا در افزایش قدرت استخراج', 'error');
    }
}

// ارتقاء ماینر
async function upgradeMinerMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const success = await window.mobileClient.upgradeMiner();
        
        if (success) {
            await updateMobileUI();
            showToastMobile('🆙 ارتقاء موفق', 'قدرت ماینر +۵ افزایش یافت!', 'success');
        } else {
            showToastMobile('⚠️ خطا', 'موجودی SOD کافی نیست!', 'error');
        }
    } catch (error) {
        console.error('خطا در ارتقاء ماینر:', error);
        showToastMobile('⚠️ خطا', 'خطا در ارتقاء ماینر', 'error');
    }
}

// ==================== عملکردهای پاداش و مأموریت ====================

// تکمیل مأموریت
async function completeMissionMobile(missionId) {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const reward = await window.mobileClient.completeMission(missionId);
        if (reward) {
            await updateMobileUI();
            showToastMobile('✅ مأموریت تکمیل شد', `+${reward.toLocaleString('fa-IR')} تومان دریافت کردید!`, 'success');
        }
    } catch (error) {
        console.error('خطا در تکمیل مأموریت:', error);
        showToastMobile('⚠️ خطا', 'خطا در تکمیل مأموریت', 'error');
    }
}

// دریافت پاداش
async function claimRewardMobile(type) {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const user = window.mobileClient.currentUser;
        const rewards = {
            sod: { amount: 10000, message: '۱۰,۰۰۰ SOD دریافت کردید!' },
            toman: { amount: 5000, message: '۵,۰۰۰ تومان دریافت کردید!' },
            boost: { amount: 3, message: 'افزایش قدرت ۳x فعال شد!' },
            premium: { amount: 7, message: '۷ روز اشتراک Pro دریافت کردید!' }
        };
        
        const reward = rewards[type];
        if (reward) {
            if (type === 'sod') {
                window.mobileClient.userData.wallet.sod_balance += reward.amount;
                await window.mobileClient.userManager.updateWallet(user.id, {
                    sod_balance: window.mobileClient.userData.wallet.sod_balance
                });
            }
            if (type === 'toman') {
                window.mobileClient.userData.wallet.toman_balance += reward.amount;
                await window.mobileClient.userManager.updateWallet(user.id, {
                    toman_balance: window.mobileClient.userData.wallet.toman_balance
                });
            }
            if (type === 'boost') {
                await window.mobileClient.boostMining();
            }
            
            await updateMobileUI();
            showToastMobile('🎁 پاداش دریافت شد', reward.message, 'success');
        }
    } catch (error) {
        console.error('خطا در دریافت پاداش:', error);
        showToastMobile('⚠️ خطا', 'خطا در دریافت پاداش', 'error');
    }
}

// دریافت همه پاداش‌ها
async function claimAllRewardsMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const user = window.mobileClient.currentUser;
        
        window.mobileClient.userData.wallet.sod_balance += 10000;
        window.mobileClient.userData.wallet.toman_balance += 5000;
        
        await window.mobileClient.userManager.updateWallet(user.id, {
            sod_balance: window.mobileClient.userData.wallet.sod_balance,
            toman_balance: window.mobileClient.userData.wallet.toman_balance
        });
        
        await window.mobileClient.boostMining();
        
        await updateMobileUI();
        showToastMobile('🎁 همه پاداش‌ها', 'تمام پاداش‌ها دریافت شدند!', 'success');
        
    } catch (error) {
        console.error('خطا در دریافت همه پاداش‌ها:', error);
        showToastMobile('⚠️ خطا', 'خطا در دریافت پاداش‌ها', 'error');
    }
}

// دریافت پاداش روزانه
async function claimDailyReward() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        await window.mobileClient.claimDailyReward();
        await updateMobileUI();
    } catch (error) {
        console.error('خطا در دریافت پاداش روزانه:', error);
        showToastMobile('⚠️ خطا', 'خطا در دریافت پاداش روزانه', 'error');
    }
}

// ==================== عملکردهای کیف پول ====================

// برداشت تومان
async function withdrawTomanMobile() {
    if (!window.mobileClient || !window.mobileClient.currentUser) return;
    
    try {
        const amount = window.mobileClient.userData.wallet.toman_balance;
        const success = await window.mobileClient.withdrawToman(amount);
        
        if (success) {
            await updateMobileUI();
            showToastMobile('✅ درخواست ثبت شد', 
                `${formatNumber(amount)} تومان برداشت شما ثبت شد.\nطی ۲۴ ساعت کاری واریز خواهد شد.`,
                'success'
            );
            closeModalMobile('walletModal');
        } else {
            showToastMobile('⚠️ خطا', 'حداقل مبلغ برداشت ۱۰,۰۰۰ تومان است', 'error');
        }
    } catch (error) {
        console.error('خطا در برداشت:', error);
        showToastMobile('⚠️ خطا', 'خطا در ثبت درخواست برداشت', 'error');
    }
}

// خرید SOD
function buySodMobile() {
    showToastMobile('🛒 خرید SOD', 'صفحه خرید به زودی فعال خواهد شد!', 'info');
}

// تبدیل ارز
function convertCurrencyMobile() {
    showToastMobile('💰 تبدیل ارز', 'سیستم تبدیل ارز به زودی فعال خواهد شد!', 'info');
}

// ==================== عملکردهای دعوت دوستان ====================

// کپی لینک دعوت
async function copyReferralLink() {
    const user = window.mobileClient?.currentUser;
    if (!user) return;
    
    const link = user.profile.referral_link;
    
    const success = await copyToClipboard(link);
    if (success) {
        showToastMobile('📋 کپی شد', 'لینک دعوت با موفقیت کپی شد!', 'success');
    } else {
        showToastMobile('⚠️ خطا', 'کپی کردن با مشکل مواجه شد', 'error');
    }
}

// کپی کد دعوت
async function copyReferralCode() {
    const user = window.mobileClient?.currentUser;
    if (!user) return;
    
    const code = user.profile.referral_code;
    
    const success = await copyToClipboard(code);
    if (success) {
        showToastMobile('📋 کپی شد', 'کد دعوت با موفقیت کپی شد!', 'success');
    } else {
        showToastMobile('⚠️ خطا', 'کپی کردن با مشکل مواجه شد', 'error');
    }
}

// اشتراک‌گذاری در واتساپ
function shareViaWhatsApp() {
    const user = window.mobileClient?.currentUser;
    if (!user) return;
    
    const message = `به SODmAX CityVerse بپیوندید! 🌟\n\nبا استفاده از لینک زیر ثبت‌نام کنید و ۱۰۰۰ SOD هدیه دریافت کنید:\n${user.profile.referral_link}\n\nکد دعوت: ${user.profile.referral_code}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showToastMobile('📱 اشتراک‌گذاری', 'در حال بازکردن واتساپ...', 'info');
}

// اشتراک‌گذاری در تلگرام
function shareViaTelegram() {
    const user = window.mobileClient?.currentUser;
    if (!user) return;
    
    const message = `به SODmAX CityVerse بپیوندید! 🌟\n\nبا استفاده از لینک زیر ثبت‌نام کنید و ۱۰۰۰ SOD هدیه دریافت کنید:\n${user.profile.referral_link}\n\nکد دعوت: ${user.profile.referral_code}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(user.profile.referral_link)}&text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showToastMobile('📱 اشتراک‌گذاری', 'در حال بازکردن تلگرام...', 'info');
}

// ==================== توابع کمکی ====================

// کپی به کلیپ‌بورد
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('خطا در کپی:', error);
        return false;
    }
}

// ==================== تنظیمات اولیه ====================

// متصل کردن رویدادها
document.addEventListener('DOMContentLoaded', () => {
    // مدیریت منو
    document.getElementById('menuToggle')?.addEventListener('click', toggleMenu);
    document.getElementById('closeMenu')?.addEventListener('click', closeMenu);
    
    // مدیریت سکشن‌ها
    document.querySelectorAll('.nav-item-mobile, .bottom-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                showSectionMobile(href.substring(1));
            }
        });
    });
    
    // مدیریت مودال‌ها
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-mobile');
            if (modal) {
                closeModalMobile(modal.id);
            }
        });
    });
    
    // کلیک خارج از مودال
    document.querySelectorAll('.modal-mobile').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-mobile')) {
                closeModalMobile(modal.id);
            }
        });
    });
    
    // رویدادهای کلیک
    document.getElementById('manualMineBtn')?.addEventListener('click', manualMineMobile);
    document.getElementById('autoMineToggle')?.addEventListener('click', toggleAutoMiningMobile);
    document.getElementById('boostMiningBtn')?.addEventListener('click', boostMiningMobile);
    document.getElementById('upgradeMinerBtn')?.addEventListener('click', upgradeMinerMobile);
    document.getElementById('withdrawBtn')?.addEventListener('click', withdrawTomanMobile);
    document.getElementById('copyReferralLink')?.addEventListener('click', copyReferralLink);
    document.getElementById('copyReferralCode')?.addEventListener('click', copyReferralCode);
    document.getElementById('shareWhatsApp')?.addEventListener('click', shareViaWhatsApp);
    document.getElementById('shareTelegram')?.addEventListener('click', shareViaTelegram);
    document.getElementById('claimAllRewardsBtn')?.addEventListener('click', claimAllRewardsMobile);
    document.getElementById('claimDailyRewardBtn')?.addEventListener('click', claimDailyReward);
    
    // تنظیمات پیش‌فرض
    showSectionMobile('home');
    
    // شروع بارگذاری اولیه
    if (window.mobileClient && window.mobileClient.currentUser) {
        updateMobileUI();
    }
});

// ==================== صادرات توابع ====================

export {
    showSectionMobile,
    toggleMenu,
    closeMenu,
    showModalMobile,
    closeModalMobile,
    updateMobileUI,
    manualMineMobile,
    toggleAutoMiningMobile,
    boostMiningMobile,
    upgradeMinerMobile,
    completeMissionMobile,
    claimRewardMobile,
    claimAllRewardsMobile,
    claimDailyReward,
    withdrawTomanMobile,
    buySodMobile,
    convertCurrencyMobile,
    copyReferralLink,
    copyReferralCode,
    shareViaWhatsApp,
    shareViaTelegram
};
