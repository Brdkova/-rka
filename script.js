let mainChart;

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    const target = document.getElementById('section-' + sectionId);
    target.style.display = 'block';
    setTimeout(() => target.classList.add('active'), 50);
    if(sectionId === 'home') runCalc();
}

function runCalc() {
    const P = parseFloat(document.getElementById('p-start').value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 0;
    
    document.getElementById('res-years').innerText = t;

    let labels = [], deposits = [], totalVal = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const val = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(dep);
        totalVal.push(Math.round(val));
    }

    document.getElementById('total-res').innerText = totalVal[t-1].toLocaleString('cs-CZ') + " Kč";

    const ctx = document.getElementById('mainChart').getContext('2d');
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vývoj majetku', data: totalVal, borderColor: '#2b6cb0', backgroundColor: 'rgba(144, 205, 244, 0.2)', fill: true, tension: 0.4 },
                { label: 'Vložené vklady', data: deposits, borderColor: '#1a365d', borderDash: [5, 5], tension: 0 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function calcHypo() {
    const p = parseFloat(document.getElementById('h-amt').value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = 30 * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ');
}

function calcPen() {
    const pmt = parseFloat(document.getElementById('pen-pmt').value) || 0;
    let res = 0;
    if (pmt >= 1700) res = 340;
    else if (pmt >= 500) res = pmt * 0.2;
    document.getElementById('pen-res').innerText = Math.round(res);
}

function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    const resDiv = document.getElementById('quiz-result');
    resDiv.style.display = 'block';
    document.getElementById('quiz-score-title').innerText = score + " / 10";
    document.getElementById('quiz-advice').innerText = score < 6 ? "Vaše finance vyžadují revizi." : "Máte velmi dobrý základ!";
}

window.onload = () => {
    setTimeout(openQuiz, 5000);
    runCalc();
    calcHypo();
    calcPen();
};