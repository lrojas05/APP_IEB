/* 
    Nombre: app_supermercado
    Descripción: Aplicación seudo front para mostrar flujo de sistema de supermercado
    Autor: Lany Rojas
    Empresa: Invertir en bolsa

 */
const axios = require('axios');
const Math = require('math')


// Calculo de número aleatorio
function aleatorio(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleatorio = Math.random() * (numPosibilidades + 1);
    aleatorio = Math.floor(aleatorio);
    return inferior + aleatorio;
}

// Inicio de seudo-interfaz
process.stdout.write("Bienvenidos al sistema de supermercados\n");
process.stdout.write("Suscripción\n");


let questions = [
                  'Ingrese nombre de supermercado: ',
                  'Ingrese email de supermercado: ',
                  'Ingrese nombre de categoria: ',
                  'Ingrese nombre de producto: ',
                  'Ingrese precio de compra: ',
                  'Ingrese precio de venta al publico: ',
                  'Ingrese precio de venta al mayor: '
                ];

let anwers = [];

  async function question(i){
    process.stdout.write(questions[i]);
}

    process.stdin.on('data', async function(data){
    anwers.push(data.toString().trim());

    if(anwers.length < questions.length){
        question(anwers.length);
    }else{
        
        // Seteo y consulta de datos necesarios para completas los campos solicitados en BD
        
        var idmarket, idcategory;
        var marketCode = aleatorio(1,9999);
        var categoryCode = aleatorio(1,9999);

        // Agrega un supermercado
        await axios.post('http://localhost:3001/addmarket', {
            id_market: 0,
            market_code: marketCode,
            market_name: anwers[0],
            market_email: anwers[1],
        })
          .then(function (response) { 
             console.log(response.data);
        })
          .catch(function (response) {
            console.log(response.data);
        });

        // Consulta ID de supermercado para utilizarlo en el agregador de producto 
        await axios.get(`http://localhost:3001/marketbycode?market_code=${marketCode}`)
          .then(function (response) { 
             idmarket = response.data[0].id_market;
        })
          .catch(function (response) {
            console.log(response.data);
        });

        // Agrega una categoria
        await axios.post('http://localhost:3001/addcategory', {
            id_category: 0,
            category_code: categoryCode,
            category_name: anwers[2],
        })
          .then(function (response) { 
            
            console.log(response.data);
        })
          .catch(function (response) {
            console.log(response.data);
          });

        // Consulta ID de categoria para utilizarlo en el agregador de producto 
        await axios.get(`http://localhost:3001/categorybycode?category_code=${categoryCode}`)
          .then(function (response) { 
             idcategory = response.data[0].id_category;
          })
          .catch(function (response) {
            console.log(response.data);
          });

        // Agrega el producto
        await axios.post('http://localhost:3001/addproduct', {
            id_product: 0,
            product_code: aleatorio(1,9999),
            product_name: anwers[3],
            buy_price: parseFloat(anwers[4]),
            public_sell_price: parseFloat(anwers[5]),
            mayor_sell_price: parseFloat(anwers[6]),
            id_category : idcategory,
            id_market : idmarket
          })
          .then(function (response) { 
            console.log(response.data);
          })
          .catch(function (response) {
            console.log(response.data);
          });
          process.exit();
    }
    
});
    
question(0);