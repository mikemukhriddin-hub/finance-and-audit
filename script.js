document.addEventListener('DOMContentLoaded', () => {
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
        if (penaltyPercent >= 40) {
            riskLevel.style.background = 'rgba(255, 77, 77, 0.1)';
            riskLevel.style.color = '#ff4d4d';
            riskDot.style.background = '#ff4d4d';
            riskDot.style.boxShadow = '0 0 10px #ff4d4d';
            riskText.textContent = 'Xavf darajasi: Yuqori';
        } else if (penaltyPercent > 0) {
            riskLevel.style.background = 'rgba(255, 204, 0, 0.1)';
            riskLevel.style.color = '#ffcc00';
            riskDot.style.background = '#ffcc00';
            riskDot.style.boxShadow = '0 0 10px #ffcc00';
            riskText.textContent = "Xavf darajasi: O'rtacha";
        } else {
            riskLevel.style.background = 'rgba(0, 255, 136, 0.1)';
            riskLevel.style.color = '#00ff88';
            riskDot.style.background = '#00ff88';
            riskDot.style.boxShadow = '0 0 10px #00ff88';
            riskText.textContent = 'Xavf darajasi: Past';
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
    calculateAudit();
});
