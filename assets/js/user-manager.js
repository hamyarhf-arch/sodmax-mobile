// ==================== سیستم مدیریت کاربران ====================
class UserManager {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'sodmax_users';
        this.currentUserKey = 'sodmax_current_user';
        this.transactionsKey = 'sodmax_transactions';
        this.notificationsKey = 'sodmax_notifications';
        this.referralsKey = 'sodmax_referrals';
        
        this.initializeData();
    }
    
    initializeData() {
        if (!localStorage.getItem(this.usersKey)) {
            const defaultUsers = [
                {
                    id: 1,
                    name: "علی محمدی",
                    phone: "09123456789",
                    password: this.hashPassword("123456"),
                    avatar: "ع",
                    level: 5,
                    totalEarned: 124500,
                    referralCount: 24,
                    referralEarnings: 124000,
                    joinDate: "۱۴۰۲/۰۵/۱۰",
                    lastLogin: new Date().toLocaleDateString('fa-IR'),
                    sodBalance: 1845200,
                    tomanBalance: 28400,
                    miningPower: 18,
                    miningMultiplier: 1,
                    autoMining: false,
                    todayEarned: 2450,
                    totalMined: 1845200,
                    completedMissions: 48,
                    referralCode: "ALI12345",
                    referralLink: "https://sodmax.city/invite/ali123"
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }
        
        if (!localStorage.getItem(this.transactionsKey)) {
            const defaultTransactions = [
                {
                    id: 1,
                    userId: 1,
                    type: "برداشت تومان",
                    amount: 50000,
                    currency: "تومان",
                    status: "موفق",
                    date: "امروز - ۱۴:۳۰",
                    icon: "fa-download",
                    color: "var(--secondary)"
                }
            ];
            localStorage.setItem(this.transactionsKey, JSON.stringify(defaultTransactions));
        }
        
        if (!localStorage.getItem(this.notificationsKey)) {
            const defaultNotifications = [
                {
                    id: 1,
                    userId: 1,
                    title: "🎉 به روزرسانی جدید",
                    message: "سیستم 3D و افکت‌های جدید اضافه شد!",
                    time: "۵ دقیقه پیش",
                    read: false
                }
            ];
            localStorage.setItem(this.notificationsKey, JSON.stringify(defaultNotifications));
        }
        
        if (!localStorage.getItem(this.referralsKey)) {
            const defaultReferrals = [
                {
                    id: 1,
                    userId: 1,
                    totalInvites: 24,
                    activeInvites: 18,
                    pendingInvites: 3,
                    totalEarned: 124000,
                    referralCode: "ALI12345",
                    referralLink: "https://sodmax.city/invite/ali123"
                }
            ];
            localStorage.setItem(this.referralsKey, JSON.stringify(defaultReferrals));
        }
    }
    
    hashPassword(password) {
        return btoa(password);
    }
    
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }
    
    register(name, phone, password, referralCode = null) {
        console.log('📝 شروع ثبت‌نام:', { name, phone });
        
        const users = this.getUsers();
        
        if (users.find(user => user.phone === phone)) {
            console.log('❌ شماره موبایل تکراری');
            return { success: false, message: "این شماره موبایل قبلاً ثبت‌نام کرده است" };
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            phone: phone,
            password: this.hashPassword(password),
            avatar: name.charAt(0),
            level: 1,
            totalEarned: 0,
            referralCount: 0,
            referralEarnings: 0,
            joinDate: new Date().toLocaleDateString('fa-IR'),
            lastLogin: new Date().toLocaleDateString('fa-IR'),
            sodBalance: 1000,
            tomanBalance: 0,
            miningPower: 5,
            miningMultiplier: 1,
            autoMining: false,
            todayEarned: 0,
            totalMined: 0,
            completedMissions: 0,
            referralCode: this.generateReferralCode(name),
            referralLink: `https://sodmax.city/invite/${this.generateReferralCode(name)}`
        };
        
        console.log('👤 کاربر جدید:', newUser);
        
        let referralBonus = 0;
        if (referralCode) {
            console.log('🎁 کد دعوت وارد شده:', referralCode);
            const referrer = users.find(user => user.referralCode === referralCode);
            if (referrer) {
                console.log('✅ دعوت‌کننده یافت شد:', referrer.name);
                
                referrer.tomanBalance += 1000;
                referrer.totalEarned += 1000;
                referrer.referralEarnings += 1000;
                referrer.referralCount++;
                this.updateUser(referrer);
                
                this.addTransaction(referrer.id, {
                    type: "پاداش دعوت",
                    amount: 1000,
                    currency: "تومان",
                    status: "موفق",
                    icon: "fa-user-plus",
                    color: "var(--secondary)"
                });
                
                newUser.sodBalance += 500;
                referralBonus = 500;
                
                const notifications = this.getNotifications();
                notifications.push({
                    id: Date.now() + 1,
                    userId: referrer.id,
                    title: "🤝 دعوت موفق",
                    message: `${name} با کد دعوت شما ثبت‌نام کرد! +۱,۰۰۰ تومان پاداش`,
                    time: "همین حالا",
                    read: false
                });
                localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
            } else {
                console.log('❌ کد دعوت نامعتبر است');
            }
        }
        
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        console.log('💾 کاربر در localStorage ذخیره شد');
        
        const notifications = this.getNotifications();
        notifications.push({
            id: Date.now() + 2,
            userId: newUser.id,
            title: "👋 به SODmAX خوش آمدید",
            message: `حساب کاربری شما با موفقیت ایجاد شد! ۱۰۰۰ SOD هدیه دریافت کردید. ${referralBonus > 0 ? `+ ${referralBonus} SOD پاداش دعوت` : ''}`,
            time: "همین حالا",
            read: false
        });
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
        
        const referrals = this.getReferrals();
        referrals.push({
            id: newUser.id,
            userId: newUser.id,
            totalInvites: 0,
            activeInvites: 0,
            pendingInvites: 0,
            totalEarned: 0,
            referralCode: newUser.referralCode,
            referralLink: newUser.referralLink
        });
        localStorage.setItem(this.referralsKey, JSON.stringify(referrals));
        
        console.log('✅ ثبت‌نام کامل شد');
        return { 
            success: true, 
            user: newUser,
            referralBonus: referralBonus
        };
    }
    
    generateReferralCode(name) {
        const namePart = name.replace(/\s/g, '').substring(0, 3).toUpperCase();
        const randomPart = Math.floor(10000 + Math.random() * 90000);
        return `${namePart}${randomPart}`;
    }
    
    login(phone, password) {
        console.log('🔐 شروع ورود:', { phone });
        
        const users = this.getUsers();
        const user = users.find(user => user.phone === phone);
        
        if (!user) {
            console.log('❌ کاربر یافت نشد');
            return { success: false, message: "شماره موبایل یا رمز عبور اشتباه است" };
        }
        
        if (!this.verifyPassword(password, user.password)) {
            console.log('❌ رمز عبور اشتباه');
            return { success: false, message: "شماره موبایل یا رمز عبور اشتباه است" };
        }
        
        console.log('✅ احراز هویت موفق:', user.name);
        
        user.lastLogin = new Date().toLocaleDateString('fa-IR');
        this.updateUser(user);
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUser = user;
        
        console.log('💾 کاربر جاری ذخیره شد');
        return { success: true, user: user };
    }
    
    logout() {
        console.log('👋 خروج کاربر');
        localStorage.removeItem(this.currentUserKey);
        this.currentUser = null;
        return true;
    }
    
    getCurrentUser() {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem(this.currentUserKey);
            if (storedUser) {
                try {
                    this.currentUser = JSON.parse(storedUser);
                    console.log('👤 کاربر جاری از localStorage بازیابی شد:', this.currentUser.name);
                } catch (error) {
                    console.error('❌ خطا در بازیابی کاربر:', error);
                    this.currentUser = null;
                }
            }
        }
        return this.currentUser;
    }
    
    updateUser(updatedUser) {
        console.log('✏️ به‌روزرسانی کاربر:', updatedUser.name);
        
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);
        
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            if (this.currentUser && this.currentUser.id === updatedUser.id) {
                this.currentUser = updatedUser;
                localStorage.setItem(this.currentUserKey, JSON.stringify(updatedUser));
            }
            
            console.log('✅ کاربر به‌روزرسانی شد');
            return true;
        }
        
        console.log('❌ کاربر برای به‌روزرسانی یافت نشد');
        return false;
    }
    
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        if (!users) {
            console.log('📁 هیچ کاربری در localStorage وجود ندارد');
            return [];
        }
        
        try {
            return JSON.parse(users);
        } catch (error) {
            console.error('❌ خطا در خواندن کاربران:', error);
            return [];
        }
    }
    
    getTransactions(userId) {
        const transactions = JSON.parse(localStorage.getItem(this.transactionsKey)) || [];
        return transactions.filter(t => t.userId === userId);
    }
    
    addTransaction(userId, transaction) {
        const transactions = this.getTransactions();
        transaction.id = Date.now();
        transaction.userId = userId;
        transaction.date = new Date().toLocaleDateString('fa-IR') + " - " + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        
        transactions.unshift(transaction);
        localStorage.setItem(this.transactionsKey, JSON.stringify(transactions));
        
        return transaction;
    }
    
    getNotifications(userId) {
        const notifications = JSON.parse(localStorage.getItem(this.notificationsKey)) || [];
        return notifications.filter(n => n.userId === userId);
    }
    
    markNotificationAsRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem(this.notificationsKey)) || [];
        const index = notifications.findIndex(n => n.id === notificationId);
        
        if (index !== -1) {
            notifications[index].read = true;
            localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
            return true;
        }
        return false;
    }
    
    getUnreadNotificationsCount(userId) {
        const notifications = this.getNotifications(userId);
        return notifications.filter(n => !n.read).length;
    }
    
    getReferrals(userId) {
        const referrals = JSON.parse(localStorage.getItem(this.referralsKey)) || [];
        return referrals.find(r => r.userId === userId);
    }
    
    updateReferrals(userId, updatedReferrals) {
        const referrals = JSON.parse(localStorage.getItem(this.referralsKey)) || [];
        const index = referrals.findIndex(r => r.userId === userId);
        
        if (index !== -1) {
            referrals[index] = updatedReferrals;
            localStorage.setItem(this.referralsKey, JSON.stringify(referrals));
            return true;
        }
        return false;
    }
}
