// ==================== ابزارهای کمکی ====================

// فرمت اعداد
function formatNumber(num) {
    if (!num && num !== 0) return "0";
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

// ایجاد افکت ماینینگ
function createMiningEffect(amount, elementSelector = '.miner-3d-mobile') {
    const minerElement = document.querySelector(elementSelector);
    if (!minerElement) {
        console.error('عنصر ماینر پیدا نشد:', elementSelector);
        return;
    }
    
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
    effect.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(effect);
    
    // حذف بعد از انیمیشن
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1100);
}

// افکت ویژه برای استخراج دستی
function createManualMiningEffect(amount) {
    const minerElement = document.querySelector('.miner-3d-mobile');
    if (!minerElement) return;
    
    const rect = minerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // افکت اصلی
    const effect = document.createElement('div');
    effect.className = 'mining-effect';
    effect.innerHTML = `<span>⚡ +${amount} SOD ⚡</span>`;
    
    effect.style.position = 'fixed';
    effect.style.left = `${centerX}px`;
    effect.style.top = `${centerY}px`;
    effect.style.zIndex = '10000';
    effect.style.transform = 'translate(-50%, -50%)';
    
    // افکت اضافی (دایره‌های انرژی)
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const energyRing = document.createElement('div');
            energyRing.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 50px;
                height: 50px;
                border: 3px solid var(--primary);
                border-radius: 50%;
                z-index: 9999;
                pointer-events: none;
                transform: translate(-50%, -50%) scale(0);
                animation: energyPulse 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(energyRing);
            
            setTimeout(() => {
                if (energyRing.parentNode) {
                    energyRing.parentNode.removeChild(energyRing);
                }
            }, 800);
        }, i * 100);
    }
    
    // اضافه کردن انیمیشن CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes energyPulse {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
                border-color: var(--primary);
            }
            100% {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
                border-color: var(--primary-light);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(effect);
    
    // حذف افکت‌ها بعد از انیمیشن
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 1100);
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

// Export برای استفاده در سایر فایل‌ها
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
    checkFeatures,
    createMiningEffect,
    createManualMiningEffect,
    showToastMobile,
    createToastContainer
};
