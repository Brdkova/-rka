let mainChart;

// 1. Přepínání sekcí (stránek)
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Spuštění kalkulaček po přepnutí
    if (id === 'investice') setTimeout(runCalc, 100);
    if (id === 'penze') setTimeout(calcRenta, 100);
    if (id === 'hypoteky') setTimeout(calcHypo, 100);
}

// 2. Investiční kalkulačka (Graf)
function runCalc() {
    const pStartInput = document.getElementById('p-start');
    if (!pStartInput) return;

    const P = parseFloat(pStartInput.value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 0;

    let labels = [], deposits = [], interest = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(dep);
        interest.push(Math.max(0, Math.round(totalVal - dep)));
    }

    document.getElementById('total-res').innerText = Math.round(deposits[t-1] + interest[t-1]).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('res-years').innerText = t;

    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (mainChart) mainChart.destroy();
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels, datasets: [
            { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
            { label: 'Zisk', data: interest, backgroundColor: '#90cdf4' }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
}

// 3. Ostatní kalkulačky
function calcHypo() {
    const p = parseFloat(document.getElementById('h-amt').value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

function calcRenta() {
    const pmt = parseFloat(document.getElementById('r-monthly').value) || 0;
    const t = parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;
    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(total / 240).toLocaleString('cs-CZ') + " Kč";
}

// 4. Rozbalování článků
function toggleInvArticle() {
    const c = document.getElementById('inv-more-content');
    const b = document.getElementById('inv-read-more-btn');
    const isHidden = c.style.display === "none" || c.style.display === "";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Číst celý článek ↓";
}

function toggleDipArticle() {
    const c = document.getElementById('dip-more-content');
    const b = document.getElementById('dip-read-more-btn');
    const isHidden = c.style.display === "none" || c.style.display === "";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Zobrazit celý článek o DIP ↓";
}

function toggleInsArticle() {
    const c = document.getElementById('ins-more-content');
    const b = document.getElementById('ins-read-more-btn');
    const isHidden = c.style.display === "none" || c.style.display === "";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Jak správně pojistit majetek ↓";
}

// 5. Kvíz
function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-num').innerText = score;
    document.getElementById('quiz-score-title').innerText = score <= 2 ? "🔴 Pozor na finance" : "🟢 Dobré základy";
    document.getElementById('quiz-advice').innerText = "Vaše skóre je " + score + " z 5. Doporučuji revizi portfolia.";
}

// 6. Automatický slider pro recenze
let currentSlide = 0;
function moveSlider() {
    const s = document.getElementById('testimonial-slider');
    if (!s) return;
    const slides = document.querySelectorAll('.testimonial-slide');
    const isMob = window.innerWidth <= 768;
    // Na desktopu posouváme o dva, na mobilu o jeden
    currentSlide = (currentSlide >= slides.length - (isMob ? 1 : 2)) ? 0 : currentSlide + 1;
    s.style.transform = `translateX(-${currentSlide * (isMob ? 100 : 51.5)}%)`;
}

// Spuštění při načtení
window.onload = () => {
    setTimeout(openQuiz, 4000);
    runCalc();
    calcHypo();
    calcRenta();
    setInterval(moveSlider, 5000); // Každých 5 sekund posune recenze
};