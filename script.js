let myChart;

// Funkce pro zobrazení/skrytí sekcí
function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

// INVESTIČNÍ KALKULAČKA
function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r_annual = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const years = parseInt(document.getElementById('years').value) || 0;

    let labels = [];
    let deposits = [];
    let interest = [];

    for (let i = 1; i <= years; i++) {
        labels.push("Rok " + i);
        const totalDeposits = P + (PMT * 12 * i);
        const totalValue = P * Math.pow(1 + r_annual, i) + (PMT * 12) * ((Math.pow(1 + r_annual, i) - 1) / r_annual);
        
        deposits.push(totalDeposits);
        interest.push(Math.max(0, Math.round(totalValue - totalDeposits)));
    }

    document.getElementById('total-result').innerText = Math.round(deposits[years-1] + interest[years-1]).toLocaleString('cs-CZ');

    const ctx = document.getElementById('interestChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
                { label: 'Úrok', data: interest, backgroundColor: '#90cdf4' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
}

// HYPOTEČNÍ KALKULAČKA
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

// PENZIJNÍ KALKULAČKA
function calculatePenze() {
    const vek = parseInt(document.getElementById('penzeVek').value) || 0;
    const ulozka = parseFloat(document.getElementById('penzeUlozka').value) || 0;
    const zamestnavatel = parseFloat(document.getElementById('penzeZamestnavatel').value) || 0;
    
    const letDoPenze = 65 - vek;
    if (letDoPenze <= 0) {
        document.getElementById('penzeCelkem').innerText = "Již v penzi";
        return;
    }

    // Odhad státní podpory (zjednodušeně dle aktuálních pravidel)
    let statniPodpora = 0;
    if (ulozka >= 1700) statniPodpora = 340;
    else if (ulozka >= 500) statniPodpora = ulozka * 0.2;

    const mesicniCelkem = ulozka + zamestnavatel + statniPodpora;
    const r = 0.04 / 12; // Odhadované zhodnocení 4% p.a.
    const n = letDoPenze * 12;

    const celkem = mesicniCelkem * ((Math.pow(1 + r, n) - 1) / r);
    document.getElementById('penzeCelkem').innerText = Math.round(celkem).toLocaleString('cs-CZ') + " Kč";
}

document.addEventListener('DOMContentLoaded', () => {
    calculateInterest();
    calculatePenze();
});