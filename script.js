let mainChart;

function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + id).classList.add('active');
    if (id === 'home') runCalc();
}

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
        type: 'bar', // Sloupcový graf
        data: {
            labels: labels,
            datasets: [
                { label: 'Vložené peníze', data: deposits, backgroundColor: '#1a365d' },
                { label: 'Zhodnocení (zisk)', data: interest, backgroundColor: '#90cdf4' }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { x: { stacked: true }, y: { stacked: true } } 
        }
    });
}

function reveal() {
    let reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
    }
}

function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-title').innerText = score + " / 10";
    document.getElementById('quiz-advice').innerText = score < 7 ? "Pojďme vaše finance nastavit lépe." : "Výborný výsledek!";
}

window.addEventListener("scroll", reveal);
window.onload = () => { setTimeout(openQuiz, 4000); runCalc(); reveal(); };