//форматируем цену
document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('ua', {
        currency: 'uah',
        style: 'currency'
    }).format(node.textContent);
});