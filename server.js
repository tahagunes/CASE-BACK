const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

// MySQL bağlantısı
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'productdb'
});

// const server = http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Socket.io Server Running');
// });

// const io = socketIo(server);
const express = require('express');

const app = express();
const server = http.createServer(app);

// const io = socketIo(server);
const io = socketIo(server, {
  cors: {
    origin: "*",  // Bütün kaynaklardan gelen bağlantılara izin ver
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
// Statik dosyaları sunmak için (Özellikle socket.io'nun istemci kütüphanesi için)
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));
app.get('/', (req, res) => {
  res.send("Merhaba, sunucu çalışıyor!");
});

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');

  // Eğer istemciden bir 'get_products' isteği gelirse, ürünleri veritabanından çekip geri dönelim.
  socket.on('get_products', () => {
    connection.query('SELECT * FROM products', (error, results) => {
      if (error) {
        socket.emit('error', 'Veritabanında bir hata oluştu');
        return;
      }
      socket.emit('products', results);
    });
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı bağlantıyı kesdi');
  });
//   socket.on('send_value', (value) => {
//     console.log('Alınan değer:', value);
// });
socket.on('send_value', (value) => {
  console.log('Alınan değer:', value);
  
  let query = `
      SELECT DISTINCT products.* 
      FROM products
      JOIN product_sizes ON products.id = product_sizes.product_id
      WHERE product_sizes.size = ?
  `;
  
  connection.query(query, [value], (error, results) => {
      if (error) {
          socket.emit('error', 'Veritabanında bir hata oluştu');
          return;
      }
      socket.emit('products', results);
  });
});
});

server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
