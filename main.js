const tareas = [];
let tiempo = 0;
let timer = null;
let timerBreak = null;
let tareaActual = null;
let estadoApp = "stop";
let pausa = false;

const btnTarea = document.querySelector('#btnTarea');
const tarea = document.querySelector('#tarea');
const formulario = document.querySelector('#formulario');
const nombreTarea = document.querySelector("#tiempo #nombreTarea");

renderTarea();
renderTiempo();

formulario.addEventListener("submit", e => {
    e.preventDefault();
    if (tarea.value !== "") {
        crearTarea(tarea.value);
        tarea.value = "";
        renderTarea();
    }
});

function crearTarea(value) {
    const nuevaTarea = {
        id: (Math.random() * 100).toString(36).slice(3),
        titulo: value,
        completado: false,
    }
    tareas.unshift(nuevaTarea);
}

function renderTarea() {
    const html = tareas.map((tarea) => {
        return `
            <div class="tarea">
                <div class="completado">
                    ${tarea.completado 
                        ? '<span class="terminado">Terminado</span>' 
                        : `<button class="btn-start" data-id="${tarea.id}">Empezar</button></div>`
                    }
                <div class="titulo">${tarea.titulo}</div>
            </div>`;
        
    });
    const contenedorTareas = document.querySelector("#tareas");
    contenedorTareas.innerHTML = html.join("");

    const btnStart = document.querySelectorAll("#tareas .btn-start");

    btnStart.forEach(btnStart =>{ 
        btnStart.addEventListener("click", () => {
            if (!timer){
                btnStartManejo(btnStart.getAttribute("data-id"));
                btnStart.textContent = "En proceso...";
            } else{
                pausa = !pausa;
                btnStart.textContent = pausa ?"Reanudar" : "Pausa";
            }
        });
    });
}

function btnStartManejo(id){
    tiempo =25*60;
    tareaActual = id;
    const tareaId = tareas.findIndex((tarea) => tarea.id === id);
    document.querySelector("#tiempo #nombreTarea").textContent = tareas[tareaId].titulo;
    
    timer =setInterval(() =>{
        if (!pausa){
            manejadorTiempo(id);
        }
        
        
    },1000); 
    document.querySelector(`[data-id="${id}"]`).textContent = "Pausa";
}

function manejadorTiempo ( id = null ){
    tiempo--;
    renderTiempo();
    if (tiempo === 0 ){
        terminado(id);
        timer= null;
        clearInterval(timer);
        renderTarea();
        descanso();
    }
}


function terminado(id){
    const tareaId = tareas.findIndex((tarea) => tarea.id === id);
    tareas[tareaId].completado = true;
    tareaActual = null;//
    if (timer !== null) {
        clearInterval(timer);
    }

}

function descanso(){
    tiempo = 5*60;
    nombreTarea.textContent = "descanso"
    document.querySelector("#tiempo #nombreTarea").textContent = "Descanso";
    timerBreak = setInterval(()=>{
        manejadorDescanso();
    }, 1000);
}

function manejadorDescanso(){
    tiempo--;
    renderTiempo();

    if(tiempo===0){
        clearInterval(timerBreak);
        tareaActual = null;
        timerBreak = null;
        nombreTarea.textContent = "";
        renderTiempo();
        renderTarea();
        clearInterval(timer);
        btnStartManejo(tareaActual);
    }
}


function renderTiempo (){
    const divTiempo = document.querySelector("#tiempo #valor");
    const minutos = parseInt (tiempo / 60);
    const segundos =parseInt (tiempo % 60);

    divTiempo.textContent = `${minutos < 10 ? "0" : ""}${minutos} : ${segundos<10 ? "0" : ""} ${segundos}`;
}






























