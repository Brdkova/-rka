function calculateHealth() {
    const checks = document.querySelectorAll('.health-check');
    const checkedCount = Array.from(checks).filter(c => c.checked).length;
    const percentage = Math.round((checkedCount / checks.length) * 100);
    
    // Update bar a labelu
    document.getElementById('health-progress').style.width = percentage + '%';
    document.getElementById('progress-label').innerText = `Vaše skóre: ${percentage} %`;
    
    // Feedback text
    const resultDiv = document.getElementById('health-result');
    const textEl = document.getElementById('health-text');
    resultDiv.style.display = 'block';
    
    if (percentage <= 20) {
        textEl.innerText = "🚩 Vaše finance vyžadují okamžitou první pomoc.";
    } else if (percentage <= 60) {
        textEl.innerText = "🟡 Máte základy, ale váš majetek zatím spí. Pojďme ho probudit.";
    } else if (percentage <= 80) {
        textEl.innerText = "🟢 Skvělá práce! Ladíme už jen detaily pro maximální rentu.";
    } else {
        textEl.innerText = "🏆 Gratuluji! Patříte mezi 5 % finančně nejzdravějších Čechů.";
    }
}