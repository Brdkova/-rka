let mainChart;

// Přepínání sekcí bez načítání stránky
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    const target = document.getElementById('section-' + sectionId);
    target.classList.add('active');
    
    if(sectionId === 'home') runCalc();
}

// Investiční výpočet
function runCalc() {
    const P = parseFloat(document.getElementById('p-start').value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 0;

    let labels = [], deposits = [], totalVal = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const val = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(dep);
        totalVal.push(Math.round(val));
    }

    document.getElementById('total-res').innerText = totalVal[t-1].toLocaleString('cs-CZ');

    const ctx = document.getElementById('mainChart').getContext('2d');
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Budovaný majetek', data: totalVal, borderColor: '#2b6cb0', backgroundColor: 'rgba(144, 205, 244, 0.2)', fill: true },
                { label: 'Vložené peníze', data: deposits, borderColor: '#1a365d', borderDash: [5, 5] }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Kvíz logika
function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-title').innerText = score + " / 10";
    document.getElementById('quiz-advice').innerText = score < 6 ? "Vaše finance vyžadují revizi." : "Skvělý výsledek!";
}

window.onload = () => {
    setTimeout(openQuiz, 5000);
    runCalc();
};