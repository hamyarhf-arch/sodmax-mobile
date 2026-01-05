// ==================== Mining Functions ====================

// استخراج دستی
function manualMineMobile() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    // محاسبه مقدار استخراج بر اساس قدرت ماینر
    const miningAmount = Math.floor(currentUser.miningPower * 10);
    
    // به‌روزرسانی موجودی کاربر
    currentUser.sodBalance += miningAmount;
    currentUser.todayEarned += miningAmount;
    currentUser.totalMined += miningAmount;
    
    userManager.updateUser(currentUser);
    
    // نمایش افکت استخراج
    createManualMiningEffect(miningAmount);
    
    // به‌روزرسانی UI
    updateMiningUI();
    
    console.log('⚡ استخراج دستی:', miningAmount + ' SOD');
    
    // نمایش پیام موفقیت
    setTimeout(() => {
        showToastMobile('⚡ استخراج موفق', `+${miningAmount} SOD استخراج شد!`, 'success');
    }, 500);
}

// به‌روزرسانی UI استخراج
function updateMiningUI() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) return;
    
    console.log('🔄 به‌روزرسانی UI استخراج');
    
    // به‌روزرسانی موجودی‌ها
    const quickSodBalance = document.getElementById('quickSodBalance');
    if (quickSodBalance) {
        quickSodBalance.textContent = formatNumber(currentUser.sodBalance);
    }
    
    const walletSodBalance = document.getElementById('walletSodBalance');
    if (walletSodBalance) {
        walletSodBalance.textContent = formatNumber(currentUser.sodBalance);
    }
    
    const modalSodBalance = document.getElementById('modalSodBalance');
    if (modalSodBalance) {
        modalSodBalance.textContent = formatNumber(currentUser.sodBalance) + ' SOD';
    }
    
    const menuSodBalance = document.getElementById('menuSodBalance');
    if (menuSodBalance) {
        menuSodBalance.textContent = formatNumber(currentUser.sodBalance);
    }
    
    // به‌روزرسانی آمار استخراج
    const miningTodayMobile = document.getElementById('miningTodayMobile');
    if (miningTodayMobile) {
        miningTodayMobile.textContent = formatNumber(currentUser.todayEarned);
    }
    
    const miningTotalMobile = document.getElementById('miningTotalMobile');
    if (miningTotalMobile) {
        miningTotalMobile.textContent = formatNumber(currentUser.totalMined);
    }
    
    const miningPowerMobile = document.getElementById('miningPowerMobile');
    if (miningPowerMobile) {
        miningPowerMobile.textContent = currentUser.miningPower + 'x';
    }
    
    const miningTodayText = document.getElementById('miningTodayText');
    if (miningTodayText) {
        miningTodayText.textContent = `+${formatNumber(currentUser.todayEarned)} SOD`;
    }
    
    // به‌روزرسانی اطلاعات ماینر
    const minerLevel = document.getElementById('minerLevel');
    if (minerLevel) {
        minerLevel.textContent = currentUser.level;
    }
    
    const currentPower = document.getElementById('currentPower');
    if (currentPower) {
        currentPower.textContent = currentUser.miningPower + 'x';
    }
    
    const nextPower = document.getElementById('nextPower');
    if (nextPower) {
        nextPower.textContent = (currentUser.miningPower + 5) + 'x';
    }
    
    const upgradeCost = document.getElementById('upgradeCost');
    if (upgradeCost) {
        const cost = currentUser.level * 50000;
        upgradeCost.textContent = formatNumber(cost) + ' SOD';
    }
    
    const upgradeCostBtn = document.getElementById('upgradeCostBtn');
    if (upgradeCostBtn) {
        const cost = currentUser.level * 50000;
        upgradeCostBtn.textContent = formatNumber(cost);
    }
    
    const nextLevelCost = document.getElementById('nextLevelCost');
    if (nextLevelCost) {
        const cost = currentUser.level * 50000;
        nextLevelCost.textContent = formatNumber(cost);
    }
    
    const clickRewardMobile = document.getElementById('clickRewardMobile');
    if (clickRewardMobile) {
        const rewardAmount = Math.floor(currentUser.miningPower * 10);
        clickRewardMobile.textContent = `+${rewardAmount} SOD`;
    }
    
    console.log('✅ UI استخراج به‌روزرسانی شد');
}

// ارتقاء ماینر
function upgradeMinerMobile() {
    const userManager = new UserManager();
    const currentUser = userManager.getCurrentUser();
    
    if (!currentUser) {
        alert('لطفاً اول وارد شوید');
        return;
    }
    
    const upgradeCost = currentUser.level * 50000; // هزینه ارتقاء بر اساس سطح
    
    if (currentUser.sodBalance >= upgradeCost) {
        if (confirm(`⚠️ آیا مایل به ارتقاء ماینر هستید؟\n\nهزینه: ${formatNumber(upgradeCost)} SOD\nقدرت فعلی: ${currentUser.miningPower}x\nقدرت جدید: ${currentUser.miningPower + 5}x`)) {
            // کسر هزینه
            currentUser.sodBalance -= upgradeCost;
            
            // افزایش قدرت ماینر
            currentUser.miningPower += 5;
            
            // افزایش سطح کاربر
            currentUser.level += 1;
            
            // ذخیره تغییرات
            userManager.updateUser(currentUser);
            
            // به‌روزرسانی UI
            updateMiningUI();
            
            // نمایش پیام موفقیت
            alert(`✅ ماینر با موفقیت ارتقاء یافت!\n\n✨ قدرت جدید: ${currentUser.miningPower}x\n📈 سطح جدید: ${currentUser.level}`);
            
            console.log('⬆️ ماینر ارتقاء یافت:', {
                level: currentUser.level,
                power: currentUser.miningPower,
                cost: upgradeCost
            });
            
            // نمایش افکت
            setTimeout(() => {
                createMiningEffect(0); // افکت ویژه ارتقاء
                showToastMobile('🎉 ارتقاء موفق', `ماینر به سطح ${currentUser.level} ارتقاء یافت!`, 'success');
            }, 300);
        }
    } else {
        alert(`❌ موجودی SOD کافی نیست!\n\n💰 نیاز: ${formatNumber(upgradeCost)} SOD\n💳 موجودی شما: ${formatNumber(currentUser.sodBalance)} SOD\n\nبرای افزایش موجودی می‌توانید:\n1. دوستان خود را دعوت کنید\n2. استخراج بیشتری انجام دهید\n3. مأموریت‌ها را تکمیل کنید`);
        console.log('❌ موجودی ناکافی برای ارتقاء:', {
            needed: upgradeCost,
            current: currentUser.sodBalance
        });
    }
}

// بارگذاری اولیه اطلاعات استخراج
function initializeMining() {
    console.log('⛏️ راه‌اندازی سیستم استخراج...');
    
    // به‌روزرسانی UI استخراج
    updateMiningUI();
    
    // تنظیم کلیک روی ماینر
    const minerElement = document.querySelector('.miner-3d-mobile');
    if (minerElement) {
        console.log('✅ ماینر برای کلیک آماده شد');
    }
    
    console.log('✅ سیستم استخراج راه‌اندازی شد');
}

// اجرا وقتی اپلیکیشن آماده است
setTimeout(initializeMining, 1000);
