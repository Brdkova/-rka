let mainChart;

// Přepínání sekcí
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + id);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    // Spustit výpočty při přepnutí, aby tam nebyla nula
    if (id === 'investice') setTimeout(runCalc, 100);
    if (id === 'penze') setTimeout(calcRenta, 100);
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

function calcRenta() {
    const pmt = parseFloat(document.getElementById('r-monthly').value) || 0;
    const t = parseInt(document.getElementById('r-years').value) || 0;
    const r = (parseFloat(document.getElementById('r-rate').value) || 0) / 100 / 12;
    const n = t * 12;

    // Výpočet budoucí hodnoty (FV) pravidelného spoření
    let total = 0;
    if (r > 0) {
        total = pmt * ((Math.pow(1 + r, n) - 1) / r);
    } else {
        total = pmt * n;
    }

    // Výpočet orientační měsíční renty na 20 let (zjednodušeně)
    const monthlyPayout = total / 240; 

    document.getElementById('r-total').innerText = Math.round(total).toLocaleString('cs-CZ') + " Kč";
    document.getElementById('r-monthly-payout').innerText = Math.round(monthlyPayout).toLocaleString('cs-CZ') + " Kč";
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

function finishQuiz() {
    // Spočítáme zaškrtnutá políčka
    const checks = document.querySelectorAll('.q-check');
    const score = Array.from(checks).filter(c => c.checked).length;
    
    // Skryjeme otázky a ukážeme výsledek
    document.getElementById('quiz-steps').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    
    // Vložíme číslo do kroužku
    document.getElementById('quiz-score-num').innerText = score;
    
    // Texty podle skóre
    let title = "";
    let advice = "";
    
    if(score <= 4) {
        title = "Je prostor pro zlepšení";
        advice = "Vaše finanční zdraví vyžaduje pozornost. Malé změny dnes udělají velký rozdíl v budoucnu.";
    } else if(score <= 7) {
        title = "Dobrá práce!";
        advice = "Máte slušný základ. Pojďme se podívat, jak z vašich peněz vytěžit maximum a snížit poplatky.";
    } else {
        title = "Skvělý výsledek!";
        advice = "Gratuluji! Patříte k lidem, kteří mají své finance pod kontrolou. Chcete vyladit detaily?";
    }
    
    document.getElementById('quiz-score-title').innerText = title;
    document.getElementById('quiz-advice').innerText = advice;
}

window.addEventListener("scroll", reveal);
window.onload = () => { setTimeout(openQuiz, 4000); runCalc(); calcHypo(); reveal(); };

function openQuiz() { document.getElementById('quiz-overlay').style.display = 'flex'; }
function closeQuiz() { document.getElementById('quiz-overlay').style.display = 'none'; }