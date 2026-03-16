let mainChart;

// 1. PŘEPÍNÁNÍ SEKCÍ
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    // Aktualizace výpočtů při přepnutí sekce
    if (id === 'investice') setTimeout(runCalc, 100);
    if (id === 'penze') setTimeout(calcRenta, 100);
    if (id === 'hypoteky') setTimeout(calcHypo, 100);
}

// 2. INVESTIČNÍ KALKULAČKA
function runCalc() {
    const pStartInput = document.getElementById('p-start');
    if (!pStartInput) return;

    const P = parseFloat(pStartInput.value) || 0;
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

// 3. HYPOTEČNÍ KALKULAČKA
function calcHypo() {
    const p = parseFloat(document.getElementById('h-amt').value) || 0;
    const r = (parseFloat(document.getElementById('h-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('h-yrs').value) || 0) * 12;
    const res = (r > 0) ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;
    
    const hResElement = document.getElementById('h-res');
    if (hResElement) hResElement.innerText = Math.round(res).toLocaleString('cs-CZ') + " Kč";
}

// 4. PENZIJNÍ KALKULAČKA (RENTA)
function calcRenta() {
    const pmtInput = document.getElementById('r-monthly');
    if (!pmtInput) return;

    const pmt = parseFloat(pmtInput.value) || 0;
    const t = parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;

    let total = (r > 0) ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    const monthlyPayout = total / 240; 

    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(monthlyPayout).toLocaleString('cs-CZ') + " Kč";
}

// 5. ANIMACE VZPLÝVÁNÍ (SCROLL REVEAL)
function reveal() {
    let reveals = document.querySelectorAll(".reveal");
    reveals.forEach(element => {
        let windowHeight = window.innerHeight;
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add("active");
        }
    });
}

// 6. KVÍZOVÉ FUNKCE
function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }

function finishQuiz() {
    const score = Array.from(document.querySelectorAll('.q-check')).filter(c => c.checked).length;
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-score-num').innerText = score;
    
    let title = score <= 4 ? "Je prostor pro zlepšení" : (score <= 6 ? "Dobrá práce!" : "Skvělý výsledek!");
    let advice = score <= 4 ? "Vaše finance vyžadují pozornost. Malé změny dnes udělají velký rozdíl." : 
                 "Máte dobré základy, pojďme doladit detaily a poplatky.";
    
    document.getElementById('quiz-score-title').innerText = title;
    document.getElementById('quiz-advice').innerText = advice;
}

// 7. ROZBALOVÁNÍ ČLÁNKŮ
function toggleDipArticle() {
    const content = document.getElementById('dip-more-content');
    const btn = document.getElementById('dip-read-more-btn');
    if (content.style.display === "none") {
        content.style.display = "block";
        btn.innerText = "Zobrazit méně ↑";
    } else {
        content.style.display = "none";
        btn.innerText = "Číst celý článek ↓";
        btn.parentElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// 8. SLIDER REFERENCÍ
let currentSlide = 0;
function moveSlider() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.testimonial-slide');
    const isMobile = window.innerWidth <= 768;
    const visibleSlides = isMobile ? 1 : 2;
    const maxIndex = slides.length - visibleSlides;

    currentSlide = (currentSlide >= maxIndex) ? 0 : currentSlide + 1;
    const offset = isMobile ? (currentSlide * 100) : (currentSlide * 51.5); 
    slider.style.transform = `translateX(-${offset}%)`;
}

// 9. INICIALIZACE PŘI NAČTENÍ
window.addEventListener("scroll", reveal);
window.onload = () => { 
    setTimeout(openQuiz, 4000); 
    runCalc(); 
    calcHypo(); 
    calcRenta();
    reveal(); 
};

// Automatický pohyb slideru
setInterval(moveSlider, 5000);