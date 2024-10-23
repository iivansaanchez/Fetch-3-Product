/*
Listar todos los elementos de la API de Productos realizada en la asignatura de Servidor.

Al abrir la página principal, deben listarse todos los productos que haya en la bbdd. Estos deben aparecer con un icono de borrado, que al pulsarlo se borre dicho elemento de la base de datos.

Al final de la página, debe aparecer un formulario que servirá para insertar productos en la base de datos.
*/

//Almacenamos en una variable el tbody donde vamos a añadir los datos que debemos rescatar
const tbody = document.querySelector("#apiData");

//Creamos variables de endpoint donde se obtengan los datos que necesitamos
const urlListAPi = "http://localhost:8080/api/v1/product";
const urlAddProduct = "http://localhost:8080/api/v1/product/insertProduct";


//Hacemos una funcion donde obtengamos todos los productos
function findAll() {
    fetch(urlListAPi)
    .then(response => {
        if(!response.ok){
            throw new Error("Ha ocurrido un error al obtener todos los productos");
        }
        return response.json();
    })
    .then(data =>{
        //Una vez que tenemos los datos comprobamos a ver si al respuesta es correcta
        //console.log(data);

        //Iteramos sobre la respuesta
        for(product of data){
            //Por cada producto debemos crear un tr y sus td correspondientes
            let tr = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = product.id;
            tr.appendChild(td);

            let td2 = document.createElement('td');
            td2.textContent = product.name;
            tr.appendChild(td2);

            let td3 = document.createElement('td');
            td3.textContent = product.price;
            tr.appendChild(td3);

            //En el caso del cuarto td aqui ira un boton eliminar
            let button = document.createElement('button');
            button.textContent = "Delete";
            button.className = 'btn btn-danger';
            let td4 = document.createElement('td');
            td4.appendChild(button);
            tr.appendChild(td4);
            button.addEventListener('click', () => {
                //Almacenamos en el id del boton el id de dicho producto
                button.id = product.id;
                //Guardamos el id del producto en una variable
                idProduct = button.id;
                //Usamos la ruta creada desde la parte de servidor añadiendole el id
                const urlDeleteProduct = `http://localhost:8080/api/v1/product/delete/${idProduct}`;
                //Hacemos la peticion DELETE usando fetch
                fetch(urlDeleteProduct, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                //Por último, borramos el tbody y lo extraemos de nuevo para que se actualice nuevamente
                .then(() =>{
                    tbody.innerHTML = "";
                    findAll();
                })
            })
            //Por último añadimos al tbody este tr
            tbody.appendChild(tr);
            
        }
    })
}



//Rescatamos el formulario
const productForm = document.querySelector('#productForm');
//Le hacemos un evento a ese product para que cuando haga submit se ejecute la siguiente funcion
productForm.addEventListener('submit', function(e) {
    
    //Evitamos que se envie por defecto
    e.preventDefault();
    
    //Obtenemos los datos
    const name = document.querySelector('#productName').value;
    const price = document.querySelector('#productPrice').value;
    //Validamos que los datos sean validos
    if(name !== "" && price !== ""){
        //Creamos un objeto con los valores introducidos por el usuario
        const newProduct = {
            name: name,
            price: price
        }
        
        fetch(urlAddProduct, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(
            ()=> {
                tbody.innerHTML = ""
                findAll()
            }
        )
        //Obtenemos la respuesta porque en caso de error nos devolvera la respuesta de error por consola
        .then(response => response.json())
        .then((data) => {
            console.log("Hemos añadido: ", data);
        })
        .catch((error) =>{
            console.error(error);
        })
        
    }else{
        console.error="No es posible añadir a la APi datos vacíos";
    }
})
findAll();

