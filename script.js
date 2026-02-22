let myChart;

function calculateInterest() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly').value) || 0;
    const r_annual = (parseFloat(document.getElementById('rate').value) || 0) / 100;
    const years = parseInt(document.getElementById('years').value) || 0;

    const labels = [];
    const data = [];
    
    // Výpočet pro graf (ukazuje hodnotu na konci každého roku)
    for (let i = 1; i <= years; i++) {
        labels.push("Rok " + i);
        
        // Složené úročení počátečního vkladu + měsíčních úložek
        // Vzorec: A = P(1+r)^t + PMT * [((1+r)^t - 1) / r]
        const value_from_principal = P * Math.pow(1 + r_annual, i);
        let value_from_monthly = 0;
        
        if (r_annual > 0) {
            value_from_monthly = (PMT * 12) * ((Math.pow(1 + r_annual, i) - 1) / r_annual);
        } else {
            value_from_monthly = (PMT * 12) * i;
        }

        const total = Math.round(value_from_principal + value_from_monthly);
        data.push(total);
    }

    // Vypsání výsledku do textového políčka
    const finalTotal = data.length > 0 ? data[data.length - 1] : P;
    document.getElementById('total-result').innerText = finalTotal.toLocaleString('cs-CZ');

    // Vykreslení nebo aktualizace grafu
    const ctx = document.getElementById('interestChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hodnota investice v čase',
                data: data,
                backgroundColor: 'rgba(43, 108, 176, 0.7)',
                borderColor: '#1a365d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('cs-CZ') + ' Kč';
                        }
                    }
                }
            }
        }
    });
}

// Spustí výpočet hned po načtení stránky, aby tam graf nebyl prázdný
window.onload = calculateInterest;