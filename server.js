const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // نضع HTML هنا

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'HoneyShopDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log('متصل بقاعدة البيانات MySQL!');
});

app.post('/add-order', (req, res) => {
  const { name, phone, email, honeyType, quantity, notes } = req.body;
  const sql = `INSERT INTO Orders (CustomerName, PhoneNumber, ProductName, Quantity, Address)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, phone, honeyType, quantity, notes], (err, result) => {
    if (err) return res.status(500).send({ success: false });
    res.send({ success: true, orderId: result.insertId });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
// Endpoint لعرض كل الطلبات
app.get('/orders', (req, res) => {
  const sql = "SELECT * FROM Orders ORDER BY OrderDate DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('حدث خطأ أثناء جلب البيانات');
    res.json(results); // نرسل كل الطلبات بصيغة JSON
  });
});
