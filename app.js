var express = require('express');
var app = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, year INTEGER, price INTEGER, color TEXT, available INTEGER)");
    
    db.get("SELECT COUNT(*) as count FROM cars", function(err, row) {
        if (row.count == 0) {
            db.run("INSERT INTO cars (brand, model, year, price, color, available) VALUES ('Toyota', 'Camry', 2020, 2500000, 'Белый', 1)");
            db.run("INSERT INTO cars (brand, model, year, price, color, available) VALUES ('BMW', 'X5', 2019, 6800000, 'Чёрный', 1)");
            db.run("INSERT INTO cars (brand, model, year, price, color, available) VALUES ('Lada', 'Vesta', 2021, 1200000, 'Синий', 0)");
        }
    });
});

app.get('/', function(req, res) {
    db.all("SELECT * FROM cars", function(err, rows) {
        res.render('index', { cars: rows });
    });
});

app.get('/create', function(req, res) {
    res.render('create');
});

app.post('/create', function(req, res) {
    var isAvail = 0;
    if (req.body.available == 'on') {
        isAvail = 1;
    }
    db.run(
        "INSERT INTO cars (brand, model, year, price, color, available) VALUES (?, ?, ?, ?, ?, ?)",
        [req.body.brand, req.body.model, req.body.year, req.body.price, req.body.color, isAvail],
        function(err) {
            res.redirect('/');
        }
    );
});

app.get('/edit/:id', function(req, res) {
    db.get("SELECT * FROM cars WHERE id = ?", [req.params.id], function(err, car) {
        res.render('edit', { car: car });
    });
});

app.post('/edit/:id', function(req, res) {
    var isAvail = 0;
    if (req.body.available == 'on') {
        isAvail = 1;
    }
    db.run(
        "UPDATE cars SET brand = ?, model = ?, year = ?, price = ?, color = ?, available = ? WHERE id = ?",
        [req.body.brand, req.body.model, req.body.year, req.body.price, req.body.color, isAvail, req.params.id],
        function(err) {
            res.redirect('/');
        }
    );
});

app.get('/delete/:id', function(req, res) {
    db.get("SELECT * FROM cars WHERE id = ?", [req.params.id], function(err, car) {
        res.render('delete', { car: car });
    });
});

app.post('/delete/:id', function(req, res) {
    db.run("DELETE FROM cars WHERE id = ?", [req.params.id], function(err) {
        res.redirect('/');
    });
});

app.listen(3000, function() {
    console.log('Сервер работает! http://localhost:3000');
});