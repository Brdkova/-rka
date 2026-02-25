let myChart;

function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
}

function updateChecklist() {
    const checks = document.querySelectorAll('.check-box');
    const checkedCount = Array.from(checks).filter(c => c.checked).length;
    const resultDiv = document.getElementById('checklist-result');
    const resultText = document.getElementById('checklist-text');
    const scoreSpan = document.getElementById('score-percent');

    resultDiv.style.display = 'block';
    scoreSpan.innerText = (checkedCount / 5) * 100;
    
    if (checkedCount === 5) resultText.innerText = "Výborně! Vaše finance jsou v top kondici.";
    else if (checkedCount >= 3) resultText.innerText = "Dobrý základ, ale jsou tam mezery.";
    else resultText.innerText = "Doporučuji co nejdříve nastavit krizový plán.";
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

function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    calculateInterest();
    calculateHypo();
});