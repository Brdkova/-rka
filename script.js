document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Děkujeme za zprávu! Brzy odpovíme.');
});

window.addEventListener('scroll', function() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});