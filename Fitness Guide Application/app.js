const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/controller', express.static('controller'));


const session = require('express-session');
app.use(session({secret : 'session-secret'}));

let catalog = require('./controller/catalog');
let profile = require('./controller/Profile');

app.use('/profile', profile);
app.use('/', catalog);


app.listen(8080,function(){
    console.log('app started')
    console.log('listening on port 8080')
});
