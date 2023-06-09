const url = 'http://localhost:3008/api/acciones/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalAccion = new bootstrap.Modal(document.getElementById('modalAccion'))
const formAccion = document.querySelector('form')
const nombre = document.getElementById('nombre')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    modalAccion.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (accion) => {
    accion.forEach(accion => {
        resultados += `<tr>
                            <td>${accion.id}</td>
                            <td>${accion.nombre}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}   

//Procedimiento Mostrar
fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error))

  
const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        //alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    nombre.value =  nombreForm
    opcion = 'editar'
    modalAccion.show()
    
})

//Procedimiento para Crear y Editar
formAccion.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre:nombre.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoAccion = []
            nuevoAccion.push(data)
            mostrar(nuevoAccion)
        })
    }
    if(opcion=='editar'){    
        //console.log('OPCION EDITAR')
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre:nombre.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalAccion.hide()
})