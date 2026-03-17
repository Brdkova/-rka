let mainChart;

// 1. PŘEPÍNÁNÍ SEKCÍ
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Spustit výpočty s malou prodlevou, aby se stihly vykreslit elementy
    if (id === 'investice') setTimeout(runCalc, 100);
    if (id === 'penze') setTimeout(calcRenta, 100);
    if (id === 'hypoteky') setTimeout(calcHypo, 100);
}

// 2. INVESTIČNÍ KALKULAČKA (GRAF)
function runCalc() {
    const pStart = document.getElementById('p-start');
    if (!pStart) return; // Ochrana proti chybě, pokud element neexistuje

    const P = parseFloat(pStart.value) || 0;
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

    const totalResElement = document.getElementById('total-res');
    if(totalResElement) totalResElement.innerText = Math.round(deposits[t-1] + interest[t-1]).toLocaleString('cs-CZ') + " Kč";
    
    const resYearsElement = document.getElementById('res-years');
    if(resYearsElement) resYearsElement.innerText = t;

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

// 3. OSTATNÍ KALKULAČKY
function calcHypo() {
    const amt = document.getElementById('h-amt');
    if (!amt) return;
    const p = parseFloat(amt.value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

function calcRenta() {
    const monthly = document.getElementById('r-monthly');
    if (!monthly) return;
    const pmt = parseFloat(monthly.value) || 0;
    const t = parseInt(document.getElementById('r-years.value')) || parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;
    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(total / 240).toLocaleString('cs-CZ') + " Kč";
}

// 4. ROZBALOVÁNÍ ČLÁNKŮ
function toggleInvArticle() {
    const c = document.getElementById('inv-more-content');
    const b = document.getElementById('inv-read-more-btn');
    const isHidden = c.style.display === "none";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Číst celý článek ↓";
}

function toggleDipArticle() {
    const c = document.getElementById('dip-more-content');
    const b = document.getElementById('dip-read-more-btn');
    const isHidden = c.style.display === "none";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Jak funguje DIP v praxi ↓";
}

function toggleInsArticle() {
    const c = document.getElementById('ins-more-content');
    const b = document.getElementById('ins-read-more-btn');
    const isHidden = c.style.display === "none";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : "Jak správně pojistit majetek ↓";
}

// 5. KVÍZOVÉ FUNKCE
function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }

function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-num').innerText = score;
    
    const title = document.getElementById('quiz-score-title');
    const advice = document.getElementById('quiz-advice');
    
    if(score <= 2) {
        title.innerText = "🔴 Vaše finance jsou v ohrožení";
        advice.innerText = "Doporučuji co nejdříve provést revizi portfolia a pojistných smluv.";
    } else if(score <= 4) {
        title.innerText = "🟡 Dobré základy, ale...";
        advice.innerText = "Unikají vám peníze na daních a poplatcích. DIP by vám mohl ušetřit tisíce.";
    } else {
        title.innerText = "🟢 Skvělé finanční zdraví";
        advice.innerText = "Gratuluji! Patříte k velmi zodpovědným lidem. Pojďme doladit detaily.";
    }
}

// 6. SLIDER A ANIMACE
let currentSlide = 0;
function moveSlider() {
    const s = document.getElementById('testimonial-slider');
    if (!s) return;
    const slides = document.querySelectorAll('.testimonial-slide');
    const isMob = window.innerWidth <= 768;
    const visibleSlides = isMob ? 1 : 2;
    const maxIndex = slides.length - visibleSlides;

    currentSlide = (currentSlide >= maxIndex) ? 0 : currentSlide + 1;
    
    // Výpočet posunu (šířka karty + mezera)
    const gap = 20; 
    const moveAmount = isMob ? 100 : 51.5; 
    s.style.transform = `translateX(-${currentSlide * moveAmount}%)`;
}

function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}

// Inicializace
window.addEventListener("scroll", reveal);
window.onload = () => { 
    setTimeout(openQuiz, 4000); 
    runCalc(); 
    calcHypo(); 
    calcRenta(); 
    reveal(); 
};
setInterval(moveSlider, 5000);

let mainChart;

function showSection(id) {
    // Schová všechny sekce
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    // Ukáže jen tu vybranou
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Pokud je to investice, spustí kalkulačku
    if (id === 'investice') setTimeout(runCalc, 100);
}

function runCalc() {
    const P = parseFloat(document.getElementById('p-start').value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 0;

    const labels = [];
    const deposits = [];
    const interest = [];

    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(dep);
        interest.push(Math.max(0, Math.round(totalVal - dep)));
    }

    document.getElementById('total-res').innerText = Math.round(deposits[t-1] + interest[t-1]).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('res-years').innerText = t;

    const ctx = document.getElementById('mainChart').getContext('2d');
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

function toggleDipArticle() {
    const content = document.getElementById('dip-more-content');
    const btn = document.getElementById('dip-read-more-btn');
    const isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";
    btn.innerText = isHidden ? "Zobrazit méně ↑" : "Zobrazit celý článek o DIP ↓";
}

// Inicializace
window.onload = () => { runCalc(); };