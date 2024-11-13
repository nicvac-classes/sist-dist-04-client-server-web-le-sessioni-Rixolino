const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const session= require('express-session');
const { v4: uuidv4 } = require('uuid');
const FileStore = require('session-file-store')(session);

// Configurazione EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    store: new FileStore({
        path: './sessions',
        ttl: 86400
    }),
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24*60*60*1000
    }
}));

app.get('/', (req, res) => {
    const name = req.cookies.name; // Legge il cookie "name"
    if (req.session.name) {
        // Se il cookie esiste, mostra la pagina di saluto
        res.render('greet', { message:'Bentornato', name: req.session.name });
    } else {
        // Se non esiste, mostra il form
        res.render('form');
    }
});

app.post('/greet', (req, res) => {
    const name = req.body.name;

    req.session.name = name;

    req.session.id = uuidv4();

    // Imposta un cookie chiamato "name" con valore l'input dell'utente
    res.render('greet', { message:'Benvenuto', name: name });
});

app.post('/logout', (req, res) => {

    req.session.destroy((err)=> {
        if (err) {
            console.log(err);
        }
    })
    
    res.redirect('/'); // Reindirizza alla home page
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});