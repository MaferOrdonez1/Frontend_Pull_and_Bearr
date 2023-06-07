const url = 'http://localhost:3008/api/entrada/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalEntrada = new bootstrap.Modal(document.getElementById('modalEntrada'))
const formEntrada = document.querySelector('form')
const fecha = document.getElementById('fecha')
const precio = document.getElementById('precio')
const cantidad = document.getElementById('cantidad')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    fecha.value = ''
    precio.value = ''
    cantidad .value = ''
    modalEntrada.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (entrada) => {
    entrada.forEach(entrada => {
        resultados += `<tr>
                            <td>${entrada.id}</td>
                            <td>${entrada.fecha}</td>
                            <td>${entrada.precio}</td>
                            <td>${entrada.cantidad}</td>
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
    const fechaForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const cantidadForm = fila.children[3].innerHTML
    fecha.value =  fechaForm
    precio.value =  precioForm
    cantidad.value =  cantidadForm
    opcion = 'editar'
    modalEntrada.show()
    
})

//Procedimiento para Crear y Editar
formEntrada.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fecha:fecha.value,
                precio:precio.value,
                cantidad:cantidad.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoEntrada = []
            nuevoEntrada.push(data)
            mostrar(nuevoEntrada)
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
                fecha:fecha.value,
                precio:precio.value,
                cantidad:cantidad.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalEntrada.hide()
})