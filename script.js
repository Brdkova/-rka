let myChart;

// Harmonika pro FAQ
function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const isVisible = answer.style.display === 'block';
    document.querySelectorAll('.faq-answer').forEach(el => el.style.display = 'none');
    answer.style.display = isVisible ? 'none' : 'block';
}

// Logika Checklistu
function updateChecklist() {
    const checks = document.querySelectorAll('.check-box');
    const checkedCount = Array.from(checks).filter(c => c.checked).length;
    const resultDiv = document.getElementById('checklist-result');
    const resultText = document.getElementById('checklist-text');

    resultDiv.style.display = 'block';
    
    if (checkedCount === 5) {
        resultText.innerText = "Skvělá práce! Vaše finance jsou ve výborné kondici. Chcete je posunout ještě dál?";
    } else if (checkedCount >= 3) {
        resultText.innerText = "Máte dobrý základ, ale jsou tam místa, kde vám utíkají peníze. Pojďme to vyladit.";
    } else {
        resultText.innerText = "Vaše finance vyžadují pozornost. Společně najdeme cestu, jak je zabezpečit a stabilizovat.";
    }
}

function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('years').value) || 0;

    let labels = [], deposits = [], interest = [];
    for (let i = 1; i <= t; i++) {
        labels.push("R " + i);
        const totalDeps = P + (PMT * 12 * i);
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / r);
        deposits.push(totalDeps);
        interest.push(Math.max(0, Math.round(totalVal - totalDeps)));
    }

    document.getElementById('total-result').innerText = Math.round(deposits[t-1] + interest[t-1]).toLocaleString('cs-CZ');

    const ctx = document.getElementById('interestChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
                { label: 'Zhodnocení', data: interest, backgroundColor: '#90cdf4' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
}

function setRate(rate) {
    document.getElementById('loanRate').value = rate;
    calculateHypo();
}

function calculateHypo() {
    const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const years = parseFloat(document.getElementById('loanYears').value) || 0;
    const rate = (parseFloat(document.getElementById('loanRate').value) || 0) / 100 / 12;
    const n = years * 12;
    const monthly = (rate > 0) ? (amount * rate) / (1 - Math.pow(1 + rate, -n)) : amount / n;
    document.getElementById('monthlyPayment').innerText = Math.round(monthly).toLocaleString('cs-CZ');
}

function calculatePenze() {
    const vek = parseInt(document.getElementById('penzeVek').value) || 0;
    const ulozka = parseFloat(document.getElementById('penzeUlozka').value) || 0;
    const zamestnavatel = parseFloat(document.getElementById('penzeZamestnavatel').value) || 0;
    const letDoPenze = 65 - vek;
    if (letDoPenze <= 0) { document.getElementById('penzeCelkem').innerText = "V penzi"; return; }
    let podpora = (ulozka >= 1700) ? 340 : (ulozka >= 500 ? ulozka * 0.2 : 0);
    const mCelkem = ulozka + zamestnavatel + podpora;
    const r = 0.04 / 12; 
    const n = letDoPenze * 12;
    const celkem = (r > 0) ? mCelkem * ((Math.pow(1 + r, n) - 1) / r) : mCelkem * n;
    document.getElementById('penzeCelkem').innerText = Math.round(celkem).toLocaleString('cs-CZ') + " Kč";
}

document.addEventListener('DOMContentLoaded', () => {
    calculateInterest();
    calculatePenze();
    calculateHypo();
});