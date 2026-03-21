let mainChart;

// 1. PŘEPÍNÁNÍ SEKCÍ
function showSection(id) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.remove('active'));
    
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

// 2. INVESTIČNÍ KALKULAČKA (GRAF)
function runCalc() {
    const pStartInput = document.getElementById('p-start');
    if (!pStartInput) return;

    const P = parseFloat(pStartInput.value) || 0;
    const PMT = parseFloat(document.getElementById('p-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('p-rate').value) || 0) / 100;
    const t = parseInt(document.getElementById('p-years').value) || 1;

    let labels = [], deposits = [], interest = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(Math.round(dep));
        interest.push(Math.max(0, Math.round(totalVal - dep)));
    }

    if(document.getElementById('total-res')) {
        document.getElementById('total-res').innerText = (deposits[deposits.length-1] + interest[interest.length-1]).toLocaleString('cs-CZ') + " Kč";
    }
    if(document.getElementById('res-years')) {
        document.getElementById('res-years').innerText = t;
    }

    const canvas = document.getElementById('mainChart');
    if (!canvas || typeof Chart === 'undefined') return; 
    
    const ctx = canvas.getContext('2d');
    if (mainChart) mainChart.destroy();
    
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
                { label: 'Zhodnocení', data: interest, backgroundColor: '#90cdf4' }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { x: { stacked: true }, y: { stacked: true } }
        }
    });
}

// 3. OSTATNÍ KALKULAČKY
function calcHypo() {
    const amtEl = document.getElementById('h-amt');
    const resEl = document.getElementById('h-res');
    if (!amtEl || !resEl) return;
    const p = parseFloat(amtEl.value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / (n || 1);
    resEl.innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

function calcRenta() {
    const pmtEl = document.getElementById('r-monthly');
    if (!pmtEl) return;
    const pmt = parseFloat(pmtEl.value) || 0;
    const tEl = document.getElementById('r-years');
    const t = tEl ? parseInt(tEl.value) : 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;
    
    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    const monthlyPayout = total / 240; 

    if(document.getElementById('r-total')) document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    if(document.getElementById('r-monthly-payout')) document.getElementById('r-monthly-payout').innerText = Math.round(monthlyPayout).toLocaleString('cs-CZ') + " Kč";
}

// 4. ROZBALOVÁNÍ ČLÁNKŮ
function toggleArticle(contentId, btnId, baseText) {
    const c = document.getElementById(contentId);
    const b = document.getElementById(btnId);
    if (!c || !b) return;
    const isHidden = c.style.display === "none" || c.style.display === "";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : baseText;
}
function toggleInvArticle() { toggleArticle('inv-more-content', 'inv-read-more-btn', 'Číst celý článek ↓'); }

// OPRAVA: Text tlačítka opraven z 'Zobrazit celý článek o DIP ↓' na 'Zobrazit detail o DIP ↓'
// aby odpovídal textu v HTML — jinak se tlačítko po zavření nevrátilo do původního stavu
function toggleDipArticle() { toggleArticle('dip-more-content', 'dip-read-more-btn', 'Zobrazit detail o DIP ↓'); }

function toggleInsArticle() { toggleArticle('ins-more-content', 'ins-read-more-btn', 'Jak správně pojistit? ↓'); }

// 5. KVÍZOVÉ FUNKCE
function openQuiz() { 
    const quiz = document.getElementById('quiz-overlay');
    if(quiz) quiz.style.display = 'flex'; 
}
function closeQuiz() { 
    const quiz = document.getElementById('quiz-overlay');
    if(quiz) quiz.style.display = 'none'; 
}
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    if(document.getElementById('quiz-steps')) document.getElementById('quiz-steps').style.display = 'none';
    if(document.getElementById('quiz-result')) document.getElementById('quiz-result').style.display = 'block';
    if(document.getElementById('quiz-score-num')) document.getElementById('quiz-score-num').innerText = score;
    
    const title = document.getElementById('quiz-score-title');
    const advice = document.getElementById('quiz-advice');
    if(!title || !advice) return;

    if(score <= 2) {
        title.innerText = "🔴 Vaše finance jsou v ohrožení";
        advice.innerText = "Doporučuji co nejdříve provést revizi portfolia.";
    } else if(score <= 4) {
        title.innerText = "🟡 Dobré základy, ale...";
        advice.innerText = "Unikají vám peníze na daních. DIP by vám mohl ušetřit tisíce.";
    } else {
        title.innerText = "🟢 Skvělé finanční zdraví";
        advice.innerText = "Gratuluji! Pojďme doladit detaily.";
    }
}

// 6. RECENZE - autoplay každé 3 sekundy
function carouselInit() {
    const track = document.getElementById('reviews-track');
    const dotsContainer = document.getElementById('reviews-dots');
    if (!track || !dotsContainer) return;

    const pages = track.querySelectorAll('.reviews-page');
    let current = 0;

    // Vytvoř tečky
    pages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goTo(i);
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        current = index;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        document.querySelectorAll('.reviews-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    setInterval(function() {
        goTo((current + 1) % pages.length);
    }, 3000);
}

// SPUŠTĚNÍ
window.addEventListener("load", () => {
    setTimeout(openQuiz, 4000); 
    runCalc();
    calcHypo();
    calcRenta();
    carouselInit();
});