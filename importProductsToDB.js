const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'productdb'
});

connection.connect();

const jsonData = JSON.parse(fs.readFileSync('urunler.json', 'utf8'));
const products = jsonData.products[0];

let processedProducts = 0;
const totalProducts = Object.entries(products).length;

for (const [name, product] of Object.entries(products)) {
  connection.query('SELECT id FROM products WHERE id = ?', [product.id], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      connection.query('INSERT INTO products SET ?', {
        id: product.id,
        name: name,
        price: product.price,
        stock: product.stock,
        img: product.img,
        description: product.description
      }, (error, results) => {
        if (error) throw error;

        let sizesToInsert = Array.isArray(product.size) ? product.size.length : 1;
        let insertedSizes = 0;

        const checkSizesAndEndConnection = () => {
          insertedSizes++;
          if (insertedSizes === sizesToInsert) {
            processedProducts++;
            if (processedProducts === totalProducts) {
              connection.end();
            }
          }
        };

        if (Array.isArray(product.size)) {
          product.size.forEach(size => {
            connection.query('INSERT INTO product_sizes SET ?', {
              product_id: product.id,
              size: size
            }, (error, results) => {
              if (error) throw error;
              checkSizesAndEndConnection();
            });
          });
        } else {
          connection.query('INSERT INTO product_sizes SET ?', {
            product_id: product.id,
            size: product.size
          }, (error, results) => {
            if (error) throw error;
            checkSizesAndEndConnection();
          });
        }
      });
    } else {
      console.log(`Ürün ID ${product.id} zaten veritabanında var.`);
      processedProducts++;
      if (processedProducts === totalProducts) {
        connection.end();
      }
    }
  });
}

