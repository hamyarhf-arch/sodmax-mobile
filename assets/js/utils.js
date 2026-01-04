// ==================== ابزارهای کمکی ====================

// فرمت اعداد
function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// دریافت آواتار بر اساس نام
function getAvatarFromName(name) {
    return name ? name.charAt(0) : "ع";
}

// کپی به کلیپ‌بورد
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve(true);
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.resolve(false);
        }
    }
}

// اعتبارسنجی شماره موبایل
function validatePhone(phone) {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// اعتبارسنجی رمز عبور
function validatePassword(password) {
    return password.length >= 6;
}

// نمایش خطا در فرم
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

// پنهان کردن خطا در فرم
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

// ویبره
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// تولید کد دعوت
function generateReferralCode(name) {
    const namePart = name.replace(/\s/g, '').substring(0, 3).toUpperCase();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `${namePart}${randomPart}`;
}

// تبدیل تاریخ به فرمت فارسی
function toPersianDate(date) {
    return date.toLocaleDateString('fa-IR');
}

// تاخیر
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ذخیره در localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('خطا در ذخیره localStorage:', e);
        return false;
    }
}

// خواندن از localStorage
function readFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('خطا در خواندن localStorage:', e);
        return null;
    }
}

// حذف از localStorage
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('خطا در حذف localStorage:', e);
        return false;
    }
}

// بررسی پشتیبانی از ویژگی‌ها
function checkFeatures() {
    return {
        localStorage: typeof localStorage !== 'undefined',
        vibrate: typeof navigator.vibrate !== 'undefined',
        clipboard: typeof navigator.clipboard !== 'undefined',
        touch: 'ontouchstart' in window
    };
}

export {
    formatNumber,
    getAvatarFromName,
    copyToClipboard,
    validatePhone,
    validatePassword,
    showError,
    hideError,
    vibrate,
    generateReferralCode,
    toPersianDate,
    delay,
    saveToLocalStorage,
    readFromLocalStorage,
    removeFromLocalStorage,
    checkFeatures
};
