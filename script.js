let myChart;

function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r_annual = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const years = parseInt(document.getElementById('years').value) || 0;

    const labels = [];
    const depositsData = []; // Celkové vklady
    const interestData = []; // Celkové zhodnocení

    for (let i = 1; i <= years; i++) {
        labels.push("Rok " + i);
        
        // Celkové vklady (Počáteční + měsíční * 12 * počet let)
        const totalDeposits = P + (PMT * 12 * i);
        depositsData.push(totalDeposits);

        // Celková hodnota se složeným úročením
        const value_from_principal = P * Math.pow(1 + r_annual, i);
        let value_from_monthly = 0;
        if (r_annual > 0) {
            value_from_monthly = (PMT * 12) * ((Math.pow(1 + r_annual, i) - 1) / r_annual);
        } else {
            value_from_monthly = (PMT * 12) * i;
        }

        const totalValue = value_from_principal + value_from_monthly;
        const totalInterest = Math.round(totalValue - totalDeposits);
        interestData.push(totalInterest > 0 ? totalInterest : 0);
    }

    const finalValue = Math.round(depositsData[depositsData.length - 1] + interestData[interestData.length - 1]);
    document.getElementById('total-result').innerText = finalValue.toLocaleString('cs-CZ');

    const ctx = document.getElementById('interestChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Vaše vklady',
                    data: depositsData,
                    backgroundColor: '#2b6cb0', // Stabilní tmavší modrá
                },
                {
                    label: 'Zhodnocení (Úrok)',
                    data: interestData,
                    backgroundColor: '#90cdf4', // Světle modrá (růst)
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { 
                    stacked: true,
                    ticks: {
                        callback: (value) => value.toLocaleString('cs-CZ') + ' Kč'
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString('cs-CZ') + ' Kč';
                        }
                    }
                }
            }
        }
    });
}

window.onload = calculateInterest;