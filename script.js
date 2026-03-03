let mainChart;

// Přepínání sekcí
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    if (id === 'investice') setTimeout(runCalc, 100);
}

// Investiční kalkulačka
function runCalc() {
    const P = parseFloat(document.getElementById('p-start').value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 0;
    document.getElementById('res-years').innerText = t;

    let labels = [], deposits = [], interest = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(dep);
        interest.push(Math.max(0, Math.round(totalVal - dep)));
    }

    document.getElementById('total-res').innerText = (deposits[t-1] + interest[t-1]).toLocaleString('cs-CZ') + " Kč";

    const ctx = document.getElementById('mainChart').getContext('2d');
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
                { label: 'Zisk', data: interest, backgroundColor: '#90cdf4' }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { x: { stacked: true }, y: { stacked: true } } 
        }
    });
}

// Ostatní výpočty
function calcHypo() {
    const p = parseFloat(document.getElementById('h-amt').value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

// Animace vynoření
function reveal() {
    let reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
    }
}

// Kvíz
function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-title').innerText = score + " / 10";
    document.getElementById('quiz-advice').innerText = score < 7 ? "Pojďme to probrat u kávy." : "Vypadá to na velmi solidní základ!";
}

window.addEventListener("scroll", reveal);
window.onload = () => { setTimeout(openQuiz, 4000); runCalc(); calcHypo(); reveal(); };