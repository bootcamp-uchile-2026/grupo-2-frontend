//Evento para desplegar el menú de categorías 
document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('boton-categorias');
    const menu = document.getElementById('menu-categorias');

if (boton && menu) {
    boton.addEventListener('click', () => {
    menu.classList.toggle('activo');
    });
}
});