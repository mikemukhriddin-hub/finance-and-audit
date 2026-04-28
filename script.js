const translations = {
    uz: {
        nav_how: "Qanday ishlaydi?",
        nav_start: "Auditni Boshlash",
        hero_title: "Sizning Reklama Byudjetingiz <span class='gradient-text'>Qayerga Ketmoqda?</span>",
        hero_sub: "Biznesingizni audit qiling, xavflarni aniqlang va har bir sarflangan dollar uchun aniq natija oling.",
        btn_start: "Tekshirishni Boshlash",
        btn_more: "Batafsil Ma'lumot",
        risk_high: "Xavf darajasi: Yuqori",
        risk_medium: "Xavf darajasi: O'rtacha",
        risk_low: "Xavf darajasi: Past"
    },
    en: {
        nav_how: "How it works?",
        nav_start: "Start Audit",
        hero_title: "Where is Your Ad Budget <span class='gradient-text'>Going?</span>",
        hero_sub: "Audit your business, identify risks, and get a clear result for every dollar spent.",
        btn_start: "Start Checking",
        btn_more: "Learn More",
        risk_high: "Risk Level: High",
        risk_medium: "Risk Level: Medium",
        risk_low: "Risk Level: Low"
    },
    ru: {
        nav_how: "Как это работает?",
        nav_start: "Начать аудит",
        hero_title: "Куда уходит ваш <span class='gradient-text'>рекламный бюджет?</span>",
        hero_sub: "Проведите аудит вашего бизнеса, выявите риски и получите четкий результат за каждый потраченный доллар.",
        btn_start: "Начать проверку",
        btn_more: "Подробнее",
        risk_high: "Уровень риска: Высокий",
        risk_medium: "Уровень риска: Средний",
        risk_low: "Уровень риска: Низкий"
    }
};

function setLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Close dropdown after selection
    document.querySelector('.lang-selector').classList.remove('active');

    // Update dynamic calculations if the function exists
    if (typeof window.runAudit === 'function') {
        window.runAudit();
    }
}

function initTheme() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    
    if (isDayTime) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Language Toggle
    const langBtn = document.getElementById('lang-active-btn');
    const langSelector = document.querySelector('.lang-selector');
    
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langSelector.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        langSelector.classList.remove('active');
    });

    initTheme();
    const savedLang = localStorage.getItem('preferred_lang') || 'uz';
    setLanguage(savedLang);
    // Select inputs
    const incomeGoalInput = document.getElementById('income-goal');
    const avgCheckInput = document.getElementById('avg-check');
    const conversionInput = document.getElementById('conversion');
    const leadPriceInput = document.getElementById('lead-price');
    const hasCrmToggle = document.getElementById('has-crm');
    const hasSalesToggle = document.getElementById('has-sales');
    const hasSocialToggle = document.getElementById('has-social');

    // Select output elements
    const resCustomers = document.getElementById('res-customers');
    const resLeads = document.getElementById('res-leads');
    const resMinBudget = document.getElementById('res-min-budget');
    const resOptBudget = document.getElementById('res-opt-budget');
    const riskLevel = document.getElementById('risk-level');
    const riskText = riskLevel.querySelector('.risk-text');
    const riskDot = riskLevel.querySelector('.risk-dot');
    const warningsList = document.getElementById('warnings-list');
    const recommendationsList = document.getElementById('recommendations-list');

    function calculateAudit() {
        // Get values
        const incomeGoal = parseFloat(incomeGoalInput.value) || 0;
        const avgCheck = parseFloat(avgCheckInput.value) || 1;
        const conversion = parseFloat(conversionInput.value) || 1;
        const leadPrice = parseFloat(leadPriceInput.value) || 0;
        const hasCrm = hasCrmToggle.checked;
        const hasSales = hasSalesToggle.checked;

        // Core calculations
        const customersNeeded = Math.ceil(incomeGoal / avgCheck);
        const leadsNeeded = Math.ceil(customersNeeded / (conversion / 100));
        const baseBudget = leadsNeeded * leadPrice;

        // Efficiency penalties
        let penaltyPercent = 0;
        const warnings = [];
        const recommendations = [];

        if (!hasCrm) {
            penaltyPercent += 20;
            warnings.push("CRM yo'qligi sababli yo'qotishlar (+20%)");
            recommendations.push("CRM tizimi (AmoCRM/Bitrix24) o'rnating, bu byudjetni 20% gacha tejaydi.");
        }

        if (!hasSales) {
            penaltyPercent += 20;
            warnings.push("Sotuvchilar yo'qligi sababli past konversiya (+20%)");
            recommendations.push("Lidlar (mijozlar) kuyib ketmasligi uchun alohida sotuv menejeri yollang.");
        }

        recommendations.push("Reklamani kichik summa (Test) bilan boshlab, CPL (bir lid narxi) ni aniqlang.");

        const finalBudget = baseBudget * (1 + penaltyPercent / 100);

        // Update UI
        resCustomers.textContent = `${customersNeeded.toLocaleString()} ta`;
        resLeads.textContent = `${leadsNeeded.toLocaleString()} ta`;
        resMinBudget.textContent = `$${baseBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        resOptBudget.textContent = `$${finalBudget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // Risk Level UI
        const currentLang = localStorage.getItem('preferred_lang') || 'uz';
        if (penaltyPercent >= 40) {
            riskLevel.style.background = 'rgba(255, 77, 77, 0.1)';
            riskLevel.style.color = '#ff4d4d';
            riskDot.style.background = '#ff4d4d';
            riskDot.style.boxShadow = '0 0 10px #ff4d4d';
            riskText.textContent = translations[currentLang].risk_high;
        } else if (penaltyPercent > 0) {
            riskLevel.style.background = 'rgba(255, 204, 0, 0.1)';
            riskLevel.style.color = '#ffcc00';
            riskDot.style.background = '#ffcc00';
            riskDot.style.boxShadow = '0 0 10px #ffcc00';
            riskText.textContent = translations[currentLang].risk_medium;
        } else {
            riskLevel.style.background = 'rgba(0, 255, 136, 0.1)';
            riskLevel.style.color = '#00ff88';
            riskDot.style.background = '#00ff88';
            riskDot.style.boxShadow = '0 0 10px #00ff88';
            riskText.textContent = translations[currentLang].risk_low;
        }

        // Render Warnings
        warningsList.innerHTML = warnings.map(w => `
            <div class="warning-card">
                <i data-lucide="alert-triangle" class="icon"></i>
                <span>${w}</span>
            </div>
        `).join('');

        // Render Recommendations
        recommendationsList.innerHTML = recommendations.map(r => `
            <li>${r}</li>
        `).join('');

        // Re-init lucide icons for dynamic elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Add event listeners
    [incomeGoalInput, avgCheckInput, conversionInput, leadPriceInput].forEach(input => {
        input.addEventListener('input', calculateAudit);
    });

    [hasCrmToggle, hasSalesToggle, hasSocialToggle].forEach(toggle => {
        toggle.addEventListener('change', calculateAudit);
    });

    // Initial calculation
    window.runAudit = calculateAudit;
    calculateAudit();
});
