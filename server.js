const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.locals.data = {
  'nombrePlace' : '',
  'idVol' : '',
  'prix':'',
  'extrs' : []
};
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
const query = require('./controllers/query');

app.post('/vols',query.getVols);

app.post('/confirmation',query.valideResrvation);

app.post('/validation',(req,res)=>{
// console.log(req.body);
    app.locals.data.idVol=req.body.idVol;
    app.locals.data.prix=req.body.prixVol;
    app.locals.data.extrs= req.body.extra;
     res.render('inscription');
    // console.log(app.locals.data);
});

app.get('/',(req,res)=>{
res.render('index');
});
app.get('/login',(req,res)=>{
  res.render('login');
  });
const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`http://localhost:${port}`);});