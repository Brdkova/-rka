let myChart;

function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('years').value) || 0;

    let labels = [];
    let deposits = [];
    let interest = [];

    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const totalDeposits = P + (PMT * 12 * i);
        const totalValue = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / r);
        deposits.push(totalDeposits);
        interest.push(Math.max(0, Math.round(totalValue - totalDeposits)));
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
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { 
                x: { stacked: true }, 
                y: { stacked: true, ticks: { callback: v => v.toLocaleString('cs-CZ') + ' Kč' } } 
            } 
        }
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
    let statniPodpora = (ulozka >= 1700) ? 340 : (ulozka >= 500 ? ulozka * 0.2 : 0);
    const mesicniCelkem = ulozka + zamestnavatel + statniPodpora;
    const r = 0.04 / 12; 
    const n = letDoPenze * 12;
    const celkem = (r > 0) ? mesicniCelkem * ((Math.pow(1 + r, n) - 1) / r) : mesicniCelkem * n;
    document.getElementById('penzeCelkem').innerText = Math.round(celkem).toLocaleString('cs-CZ') + " Kč";
}

document.addEventListener('DOMContentLoaded', () => {
    calculateInterest();
    calculatePenze();
    calculateHypo();
});