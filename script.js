let mainChart;

// 1. PŘEPÍNÁNÍ SEKCÍ (STRÁNEK)
function showSection(id) {
    // Schovat všechny sekce
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        // Plynulý scroll nahoru
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Spuštění kalkulaček po přepnutí, aby se grafy/data ihned vykreslily
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
    const t = parseInt(document.getElementById('p-years').value) || 1; // Minimálně 1 rok

    let labels = [], deposits = [], interest = [];
    for (let i = 1; i <= t; i++) {
        labels.push("Rok " + i);
        const dep = P + (PMT * 12 * i);
        // Výpočet složeného úročení
        const totalVal = P * Math.pow(1 + r, i) + (PMT * 12) * ((Math.pow(1 + r, i) - 1) / (r || 0.0001));
        deposits.push(Math.round(dep));
        interest.push(Math.max(0, Math.round(totalVal - dep)));
    }

    // Aktualizace textových výsledků
    document.getElementById('total-res').innerText = (deposits[deposits.length-1] + interest[interest.length-1]).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('res-years').innerText = t;

    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
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
            scales: { 
                x: { stacked: true }, 
                y: { stacked: true, ticks: { callback: value => value.toLocaleString('cs-CZ') + ' Kč' } } 
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => context.dataset.label + ': ' + context.raw.toLocaleString('cs-CZ') + ' Kč'
                    }
                }
            }
        }
    });
}

// 3. OSTATNÍ KALKULAČKY (HYPOTÉKA & RENTA)
function calcHypo() {
    const amtEl = document.getElementById('h-amt');
    if (!amtEl) return;
    const p = parseFloat(amtEl.value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / (n || 1);
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

function calcRenta() {
    const pmtEl = document.getElementById('r-monthly');
    if (!pmtEl) return;
    const pmt = parseFloat(pmtEl.value) || 0;
    const t = parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;
    
    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    const monthlyPayout = total / 240; // Odhad renty na 20 let

    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(monthlyPayout).toLocaleString('cs-CZ') + " Kč";
}

// 4. FUNKCE PRO ROZBALOVÁNÍ ČLÁNKŮ
function toggleArticle(contentId, btnId, baseText) {
    const c = document.getElementById(contentId);
    const b = document.getElementById(btnId);
    if (!c || !b) return;
    
    const isHidden = c.style.display === "none" || c.style.display === "";
    c.style.display = isHidden ? "block" : "none";
    b.innerText = isHidden ? "Zobrazit méně ↑" : baseText;
}

// Propojení s vašimi konkrétními tlačítky
function toggleInvArticle() { toggleArticle('inv-more-content', 'inv-read-more-btn', 'Číst celý článek ↓'); }
function toggleDipArticle() { toggleArticle('dip-more-content', 'dip-read-more-btn', 'Zobrazit celý článek o DIP ↓'); }
function toggleInsArticle() { toggleArticle('ins-more-content', 'ins-read-more-btn', 'Jak správně pojistit majetek ↓'); }

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

// 6. AUTOMATICKÝ SLIDER PRO RECENZE
let currentSlide = 0;
function moveSlider() {
    const s = document.getElementById('testimonial-slider');
    if (!s) return;
    const slides = document.querySelectorAll('.testimonial-slide');
    const isMob = window.innerWidth <= 768;
    
    // Na desktopu posouváme po jednom (vidíme dva), na mobilu po jednom (vidíme jeden)
    const maxIndex = isMob ? slides.length - 1 : slides.length - 2;
    
    currentSlide++;
    if (currentSlide > maxIndex) currentSlide = 0;

    // Přesnější výpočet šířky včetně mezer
    const moveAmount = isMob ? 100 : 51.5; 
    s.style.transform = `translateX(-${currentSlide * moveAmount}%)`;
}

// SPUŠTĚNÍ PŘI NAČTENÍ
window.addEventListener("load", () => {
    setTimeout(openQuiz, 4000); // Kvíz vyskočí po 4 sekundách
    runCalc();
    calcHypo();
    calcRenta();
    setInterval(moveSlider, 5000); // Slider se hýbe každých 5 sekund
});