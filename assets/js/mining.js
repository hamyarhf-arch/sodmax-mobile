// ==================== سیستم استخراج ====================
class MobileCityVerse {
    constructor() {
        this.userManager = new UserManager();
        this.currentUser = null;
        this.autoMiningInterval = null;
        this.boostEndTime = null;
        this.boostInterval = null;
        
        this.gameData = {
            missions: {
                active: [
                    { id: 1, name: "۱۰۰ کلیک در بازی", reward: 500, progress: 45, max: 100 },
                    { id: 2, name: "دعوت ۵ دوست", reward: 1000, progress: 2, max: 5 }
                ]
            }
        };
    }
    
    // استخراج دستی
    mine(user) {
        if (!user) return 0;
        
        const baseEarn = user.miningPower || 5;
        const multiplier = user.miningMultiplier || 1;
        const earned = baseEarn * multiplier;
        
        user.sodBalance = (user.sodBalance || 0) + earned;
        user.todayEarned = (user.todayEarned || 0) + earned;
        user.totalMined = (user.totalMined || 0) + earned;
        
        if (this.gameData.missions.active[0]) {
            this.gameData.missions.active[0].progress++;
        }
        
        this.userManager.addTransaction(user.id, {
            type: "استخراج دستی",
            amount: earned,
            currency: "SOD",
            status: "موفق",
            icon: "fa-hard-hat",
            color: "var(--primary)"
        });
        
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        return earned;
    }
    
    // استخراج اتوماتیک
    autoMine(user) {
        if (!user || !user.autoMining) return 0;
        
        const earned = this.mine(user);
        return earned;
    }
    
    // فعال/غیرفعال کردن استخراج اتوماتیک
    toggleAutoMining(user) {
        if (!user) return false;
        
        user.autoMining = !user.autoMining;
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        if (user.autoMining) {
            this.startAutoMining();
        } else {
            this.stopAutoMining();
        }
        
        return user.autoMining;
    }
    
    // شروع استخراج اتوماتیک
    startAutoMining() {
        if (this.autoMiningInterval) {
            clearInterval(this.autoMiningInterval);
        }
        
        this.autoMiningInterval = setInterval(() => {
            if (this.currentUser && this.currentUser.autoMining) {
                const earned = this.autoMine(this.currentUser);
                if (earned > 0) {
                    this.createMiningEffect(earned);
                    updateMobileUI();
                }
            } else {
                this.stopAutoMining();
            }
        }, 5000);
    }
    
    // توقف استخراج اتوماتیک
    stopAutoMining() {
        if (this.autoMiningInterval) {
            clearInterval(this.autoMiningInterval);
            this.autoMiningInterval = null;
        }
    }
    
    // افزایش قدرت استخراج (بوست)
    boostMining(user) {
        if (!user) return false;
        
        const cost = 5000;
        if (user.sodBalance < cost) {
            return false;
        }
        
        user.sodBalance -= cost;
        user.miningMultiplier = 3;
        this.boostEndTime = Date.now() + 30000;
        
        this.userManager.addTransaction(user.id, {
            type: "خرید بوست",
            amount: -cost,
            currency: "SOD",
            status: "موفق",
            icon: "fa-bolt",
            color: "var(--accent)"
        });
        
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        this.startBoostTimer();
        
        return true;
    }
    
    // شروع تایمر بوست
    startBoostTimer() {
        if (this.boostInterval) {
            clearInterval(this.boostInterval);
        }
        
        this.boostInterval = setInterval(() => {
            if (this.boostEndTime && Date.now() >= this.boostEndTime) {
                if (this.currentUser) {
                    this.currentUser.miningMultiplier = 1;
                    this.userManager.updateUser(this.currentUser);
                    updateMobileUI();
                }
                this.clearBoostTimer();
            }
        }, 1000);
    }
    
    // پاک کردن تایمر بوست
    clearBoostTimer() {
        if (this.boostInterval) {
            clearInterval(this.boostInterval);
            this.boostInterval = null;
            this.boostEndTime = null;
        }
    }
    
    // ارتقاء ماینر
    upgradeMiner(user) {
        if (!user) return false;
        
        const cost = 50000;
        if (user.sodBalance < cost) {
            return false;
        }
        
        user.sodBalance -= cost;
        user.miningPower = (user.miningPower || 5) + 5;
        user.level = (user.level || 1) + 1;
        
        this.userManager.addTransaction(user.id, {
            type: "ارتقاء ماینر",
            amount: -cost,
            currency: "SOD",
            status: "موفق",
            icon: "fa-arrow-up",
            color: "var(--accent)"
        });
        
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        const notifications = JSON.parse(localStorage.getItem(this.userManager.notificationsKey)) || [];
        notifications.push({
            id: Date.now(),
            userId: user.id,
            title: "🎉 ارتقاء موفق",
            message: `ماینر شما به سطح ${user.level} ارتقا یافت! قدرت +۵ افزایش یافت.`,
            time: "همین حالا",
            read: false
        });
        localStorage.setItem(this.userManager.notificationsKey, JSON.stringify(notifications));
        
        return true;
    }
    
    // تکمیل مأموریت
    completeMission(user, missionId) {
        const mission = this.gameData.missions.active.find(m => m.id === missionId);
        if (!mission) return false;
        
        user.tomanBalance += mission.reward;
        user.totalEarned += mission.reward;
        user.completedMissions = (user.completedMissions || 0) + 1;
        
        this.userManager.addTransaction(user.id, {
            type: "پاداش مأموریت",
            amount: mission.reward,
            currency: "تومان",
            status: "موفق",
            icon: "fa-trophy",
            color: "var(--secondary)"
        });
        
        this.gameData.missions.active = this.gameData.missions.active.filter(m => m.id !== missionId);
        
        this.addNewMission();
        
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        return mission.reward;
    }
    
    // اضافه کردن مأموریت جدید
    addNewMission() {
        const newMissionId = this.gameData.missions.active.length > 0 ? 
            Math.max(...this.gameData.missions.active.map(m => m.id)) + 1 : 1;
        
        const missionsPool = [
            { name: "۲۰۰ کلیک در بازی", reward: 1000, max: 200 },
            { name: "دعوت ۳ دوست", reward: 2000, max: 3 },
            { name: "ارتقاء ماینر", reward: 3000, max: 1 },
            { name: "برداشت تومان", reward: 1500, max: 1 }
        ];
        
        const randomMission = missionsPool[Math.floor(Math.random() * missionsPool.length)];
        
        this.gameData.missions.active.push({
            id: newMissionId,
            name: randomMission.name,
            reward: randomMission.reward,
            progress: 0,
            max: randomMission.max
        });
    }
    
    // برداشت تومان
    withdrawToman(user) {
        if (!user) return false;
        
        if (user.tomanBalance < 10000) {
            return false;
        }
        
        const amount = user.tomanBalance;
        user.tomanBalance = 0;
        
        this.userManager.addTransaction(user.id, {
            type: "برداشت تومان",
            amount: amount,
            currency: "تومان",
            status: "در حال پردازش",
            icon: "fa-download",
            color: "var(--secondary)"
        });
        
        this.userManager.updateUser(user);
        this.currentUser = user;
        
        return amount;
    }
    
    // دعوت دوست
    inviteFriend(user) {
        if (!user) return false;
        
        const referrals = this.userManager.addReferral(user.id);
        
        if (referrals) {
            return true;
        }
        return false;
    }
    
    // تأیید دعوت
    confirmReferral(userId) {
        return this.userManager.confirmReferral(userId);
    }
    
    // محاسبه هزینه ارتقای سطح بعدی
    getNextLevelCost(level) {
        return level * 10000;
    }
    
    // ایجاد افکت ماینینگ
    createMiningEffect(amount) {
        const minerElement = document.querySelector('.miner-3d-mobile');
        if (!minerElement) return;
        
        const rect = minerElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const effect = document.createElement('div');
        effect.className = 'mining-effect';
        effect.innerHTML = `<span>+${amount} SOD</span>`;
        
        effect.style.position = 'fixed';
        effect.style.left = `${centerX}px`;
        effect.style.top = `${centerY}px`;
        effect.style.zIndex = '10000';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1100);
    }
    
    // پخش صدای استخراج
    playMiningSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            
        } catch (e) {
            console.log('پخش صدا پشتیبانی نمی‌شود');
        }
    }
}
