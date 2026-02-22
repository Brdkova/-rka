let myChart;

// Funkce pro výpočet investic
function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r_annual = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const years = parseInt(document.getElementById('years').value) || 0;

    const labels = [];
    const depositsData = [];
    const interestData = [];

    for (let i = 1; i <= years; i++) {
        labels.push("Rok " + i);
        const totalDeposits = P + (PMT * 12 * i);
        
        const valPrincipal = P * Math.pow(1 + r_annual, i);
        let valMonthly = 0;
        if (r_annual > 0) {
            valMonthly = (PMT * 12) * ((Math.pow(1 + r_annual, i) - 1) / r_annual);
        } else {
            valMonthly = (PMT * 12) * i;
        }

        const totalValue = valPrincipal + valMonthly;
        const totalInterest = Math.max(0, Math.round(totalValue - totalDeposits));
        
        depositsData.push(totalDeposits);
        interestData.push(totalInterest);
    }

    const finalVal = depositsData[depositsData.length - 1] + interestData[interestData.length - 1];
    document.getElementById('total-result').innerText = Math.round(finalVal).toLocaleString('cs-CZ');

    const ctx = document.getElementById('interestChart').getContext('2d');
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vaše vklady', data: depositsData, backgroundColor: '#1a365d' },
                { label: 'Zhodnocení (Úrok)', data: interestData, backgroundColor: '#90cdf4' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, ticks: { callback: (v) => v.toLocaleString('cs-CZ') + ' Kč' } }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString('cs-CZ') + ' Kč'
                    }
                }
            }
        }
    });
}

// Funkce pro rozbalení hypotéky
function toggleHypo() {
    const content = document.getElementById('hypo-content');
    content.style.display = (content.style.display === 'none') ? 'block' : 'none';
    calculateHypo();
}

// Funkce pro nastavení sazby kliknutím na banku
function setRate(rate) {
    const rateInput = document.getElementById('loanRate');
    rateInput.value = rate;
    calculateHypo();
    
    // Malý vizuální efekt bliknutí pole
    rateInput.style.backgroundColor = '#90cdf4';
    setTimeout(() => { rateInput.style.backgroundColor = 'white'; }, 200);
}

// Funkce pro výpočet hypotéky
function calculateHypo() {
    const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const years = parseFloat(document.getElementById('loanYears').value) || 0;
    const rate = (parseFloat(document.getElementById('loanRate').value) || 0) / 100 / 12;
    const n = years * 12;

    if (rate > 0 && n > 0) {
        const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -n));
        document.getElementById('monthlyPayment').innerText = Math.round(monthly).toLocaleString('cs-CZ');
    } else {
        document.getElementById('monthlyPayment').innerText = "0";
    }
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    calculateInterest();
});