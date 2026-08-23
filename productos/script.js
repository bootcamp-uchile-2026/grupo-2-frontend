const boton = document.getElementById('boton-categorias'); 
const lista = document.querySelector('.lista-categorias');
//Evento de escucha para el botón categorias
boton.addEventListener('click',() => {
    lista.classList.toggle('activo');
});
document.addEventListener('click', (evento) => {
if (!boton.contains(evento.target) && !lista.contains(evento.target)){
    lista.classList.remove ('activo');
}
})