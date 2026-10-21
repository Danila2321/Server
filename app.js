var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname);

var cars = [
    { id: 1, brand: 'Toyota', model: 'Camry', year: 2020, price: 2500000, color: 'Белый', available: true },
    { id: 2, brand: 'BMW', model: 'X5', year: 2019, price: 6800000, color: 'Чёрный', available: true },
    { id: 3, brand: 'Lada', model: 'Vesta', year: 2021, price: 1200000, color: 'Синий', available: false }
];
var nextId = 4;

app.get('/', function(req, res) {
    res.render('index', { cars: cars });
});

app.get('/create', function(req, res) {
    res.render('create');
});

app.post('/create', function(req, res) {
    cars.push({
        id: nextId,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price,
        color: req.body.color,
        available: (req.body.available == 'on')
    });
    
    nextId = nextId + 1;
    res.redirect('/');
});

app.get('/edit/:id', function(req, res) {
    var car = cars.find(function(item) {
        return item.id == req.params.id;
    });
    
    res.render('edit', { car: car });
});

app.post('/edit/:id', function(req, res) {
    var car = cars.find(function(item) {
        return item.id == req.params.id;
    });

    car.brand = req.body.brand;
    car.model = req.body.model;
    car.year = req.body.year;
    car.price = req.body.price;
    car.color = req.body.color;
    car.available = (req.body.available == 'on');

    res.redirect('/');
});

app.get('/delete/:id', function(req, res) {
    var car = cars.find(function(item) {
        return item.id == req.params.id;
    });
    res.render('delete', { car: car });
});

app.post('/delete/:id', function(req, res) {
    var index = cars.findIndex(function(item) {
        return item.id == req.params.id;
    });
    cars.splice(index, 1);
    res.redirect('/');
});

app.listen(3000, function() {
    console.log('Открыть: http://localhost:3000');
});