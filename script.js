let mainChart;

function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    if (id === 'investice') setTimeout(runCalc, 100);
    if (id === 'penze') setTimeout(calcRenta, 100);
    if (id === 'hypoteky') setTimeout(calcHypo, 100);
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
        type: 'bar',
        data: { labels: labels, datasets: [
            { label: 'Vklady', data: deposits, backgroundColor: '#1a365d' },
            { label: 'Zisk', data: interest, backgroundColor: '#90cdf4' }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
    });
}

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

function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add("active");
    });
}

function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-num').innerText = score;
    document.getElementById('quiz-score-title').innerText = score <= 3 ? "Je prostor pro zlepšení" : "Skvělá práce!";
    document.getElementById('quiz-advice').innerText = "Vaše skóre je " + score + " z 6. Pojďme to probrat u kávy.";
}

function toggleDipArticle() {
    const c = document.getElementById('dip-more-content');
    const b = document.getElementById('dip-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Číst celý článek ↓" : "Zobrazit méně ↑";
}

function toggleInvArticle() {
    const c = document.getElementById('inv-more-content');
    const b = document.getElementById('inv-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Číst celý průvodce ↓" : "Zobrazit méně ↑";
}

let currentSlide = 0;
function moveSlider() {
    const s = document.getElementById('testimonial-slider');
    if (!s) return;
    const slides = document.querySelectorAll('.testimonial-slide');
    const isMob = window.innerWidth <= 768;
    currentSlide = (currentSlide >= slides.length - (isMob ? 1 : 2)) ? 0 : currentSlide + 1;
    s.style.transform = `translateX(-${currentSlide * (isMob ? 100 : 51)}%)`;
}

window.addEventListener("scroll", reveal);
window.onload = () => { setTimeout(openQuiz, 4000); runCalc(); calcHypo(); calcRenta(); reveal(); };
setInterval(moveSlider, 5000);

// Přidej k ostatním funkcím
function toggleInsArticle() {
    const c = document.getElementById('ins-more-content');
    const b = document.getElementById('ins-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Jak správně pojistit sebe i majetek ↓" : "Zobrazit méně ↑";
}

// Upravená funkce finishQuiz pro tvůj nový počet otázek (6)
function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-num').innerText = score;
    
    let title = "";
    let advice = "";
    
    if(score <= 2) {
        title = "🔴 Vaše finance jsou v ohrožení";
        advice = "Doporučuji co nejdříve provést revizi. Aktuální tržní rizika a inflace mohou vaše úspory rychle znehodnotit.";
    } else if(score <= 4) {
        title = "🟡 Dobré základy, ale...";
        advice = "Máte postavené základy, ale unikají vám peníze na daních a poplatcích. DIP a optimalizace pojistek by vám ušetřily tisíce měsíčně.";
    } else {
        title = "🟢 Skvělé finanční zdraví";
        advice = "Gratuluji! Patříte k velmi zodpovědným lidem. Pojďme se podívat na pokročilé strategie pro budování renty.";
    }
    
    document.getElementById('quiz-score-title').innerText = title;
    document.getElementById('quiz-advice').innerText = advice;
}

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
    if (id === 'penze') setTimeout(calcRenta, 100);
    if (id === 'hypoteky') setTimeout(calcHypo, 100);
}

// Investiční kalkulačka
function runCalc() {
    const P = parseFloat(document.getElementById('p-start').value) || 0;
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

// Penzijní kalkulačka
function calcRenta() {
    const pmt = parseFloat(document.getElementById('r-monthly').value) || 0;
    const t = parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;
    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(total / 240).toLocaleString('cs-CZ') + " Kč";
}

// Hypoteční kalkulačka
function calcHypo() {
    const p = parseFloat(document.getElementById('h-amt').value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    document.getElementById('h-res').innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

// Rozbalování článků
function toggleInvArticle() {
    const c = document.getElementById('inv-more-content');
    const b = document.getElementById('inv-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Číst celý článek ↓" : "Zobrazit méně ↑";
}

function toggleDipArticle() {
    const c = document.getElementById('dip-more-content');
    const b = document.getElementById('dip-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Jak funguje DIP v praxi ↓" : "Zobrazit méně ↑";
}

function toggleInsArticle() {
    const c = document.getElementById('ins-more-content');
    const b = document.getElementById('ins-read-more-btn');
    c.style.display = c.style.display === "none" ? "block" : "none";
    b.innerText = c.style.display === "none" ? "Jak správně pojistit majetek ↓" : "Zobrazit méně ↑";
}

// Kvíz
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

// Scroll animace
function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add("active");
    });
}

window.addEventListener("scroll", reveal);
window.onload = () => { setTimeout(openQuiz, 4000); runCalc(); calcHypo(); calcRenta(); reveal(); };