const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

// MySQL bağlantısı için yapılandırma
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

// Express uygulamasını oluşturma
const express = require('express');

const app = express();
const server = http.createServer(app);

// const io = socketIo(server);
// CORS ayarlarıyla birlikte socket.io'u yapılandırma
const io = socketIo(server, {
  cors: {
    origin: "*",  // Bütün kaynaklardan gelen bağlantılara izin ver
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
// Statik dosyaları sunmak için (özellikle socket.io'nun istemci kütüphanesi için)

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));
app.get('/', (req, res) => {
  res.send("Merhaba, sunucu çalışıyor!");
});
// Yeni bir kullanıcı bağlandığında tetiklenir
io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');

  // İstemciden 'get_products' talebi geldiğinde, veritabanından ürünleri çekip geri döndür
 socket.on('get_products', () => {
    connection.query('SELECT * FROM products', (error, results) => {
      if (error) {
        socket.emit('error', 'Veritabanında bir hata oluştu');
        return;
      }
      socket.emit('products', results);
    });
  });
 // Kullanıcının bağlantıyı kestiği an
  socket.on('disconnect', () => {
    console.log('Kullanıcı bağlantıyı kesdi');
  });
//   socket.on('send_value', (value) => {
//     console.log('Alınan değer:', value);
// });

// İstemciden belirli bir değerin (X ya da M) geldiğinde tetiklenir
  
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
// Sunucunun dinlemeye başladığı yer
server.listen(3000, () => {
  console.log('Server 3000 portunda çalışıyor');
});
