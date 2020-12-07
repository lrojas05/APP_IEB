/* 
    Nombre: app_cliente
    Descripción: Aplicación de seudo front para mostrar el flujo del sistema de consulta de cliente
    Autor: Lany Rojas
    Empresa: Invertir en bolsa

 */
const axios = require('axios');
const inquirer = require('inquirer');
const Math = require('math');

const aleatorio = (inferior, superior) => {
    var numPosibilidades = superior - inferior;
    var aleatorio = Math.random() * (numPosibilidades + 1);
    aleatorio = Math.floor(aleatorio);
    return inferior + aleatorio;
}

//  Guardar Suscripción de cliente

const guardarClienteToAPI = async (nombre , email) => {
    await axios.post('http://localhost:3001/addclient', {
             id_client: 0,
             client_code: aleatorio(1,9999),
             client_name: nombre,
             client_email: email,
           }) .then(function (response) { 
             console.log(response.data);
           })
           .catch(function (response) {
             console.log(response.data);
           });
}

//  Ingreso de datos de cliente
const guardarCliente = () => {
    inquirer.prompt([{
        name: 'nombre',
        message: 'Ingresa el nombre del cliente: ',
        default: 'Usuario'
    },{
        name: 'email',
        message: 'Ingresa el email del cliente: ',
    }])
    .then( async (answers) => {
        guardarClienteToAPI(answers.nombre, answers.email);
        try{
            const supermercados = await obtenerSupermercados();
            const market = supermercados.map(({market_name}) => market_name);
            listarSupermercados(market);
        }catch(err){
            console.log(err);
        }
    })
}

// Consulta de los supermercado disponibles
const obtenerSupermercados = async () => {
    let markets = null;

    let res = await axios.get('http://localhost:3001/market')
            .catch(err =>  console.log("Ocurrio un error obteniendo los Supermercados: ", err))

    res.data.length > 0 ? markets = res.data : null

    return markets
}

// COnsulta para  obtener los datos de supermercados por id
const obtenerIdSupermercadoByName = async (nombre) => {
    let products = null;

    let res = await axios.get(`http://localhost:3001/marketbyname?market_name=${nombre}`)
                .catch(err =>  console.log("Ocurrio un error : ", err))
    
    res.data.length > 0 ? products = res.data : null

    return products
}

// Consulta para obtener 5 categorias diferentes
const obtenerCategorias = async () => {
    let categories = null;

    let res = await axios.get(`http://localhost:3001/idcategory`)
                    .catch(err =>  console.log("Ocurrio un error obteniendo los id de categoria: ", err))
     res.data.length > 0 ? categories = res.data : null

    return categories
}

// Consulta de productos por id de categoria
const obtnerProductosRandom = async (idCategory) => {

        for (i = 0; i < idCategory.length; i++)
        {
            
        let res = await axios.get(`http://localhost:3001/productradom?id_category=${idCategory[i]}`)
            .catch(err =>  console.log("Ocurrio un error obteniendo los Productos: ", err))

            if(res.data.product_name != undefined)
                console.log("Producto: " + res.data.product_name, " Precio: " + res.data.public_sell_price)
            else
                console.log("No hay producto de esta categoria");
        }
}

// Opciones de supermercado disponibles
const listarSupermercados = async (markets) => {
    await inquirer.prompt({
        type: 'list',
        name: 'market',
        message: 'Selecciona el Supermercado',
        choices: markets,
    })
    .then(async (answer) => {
        try{
        await obtenerIdSupermercadoByName(answer.market);
        const categoryId = await obtenerCategorias();
        await obtnerProductosRandom(categoryId)
        }catch(err){
            console.log(err);
        }
    })    
}

console.log("Bienvenidos al sistema de consulta de clientes!");
console.log("Suscripción");
guardarCliente();
 