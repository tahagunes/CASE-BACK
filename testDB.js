const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'ProductDB'
});

connection.connect();

connection.query('SELECT * FROM products', (error, results) => {
  if (error) throw error;
  console.log('Products:', results);

  connection.query('SELECT * FROM product_sizes', (error, sizes) => {
    if (error) throw error;
    console.log('Product Sizes:', sizes);

    connection.end();
  });
});
