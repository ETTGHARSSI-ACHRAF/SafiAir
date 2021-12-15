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
    app.locals.data.idVol=req.body.idVol;
    app.locals.data.prix=req.body.prixVol;
    app.locals.data.extrs= req.body.extra;
     res.render('inscription');
});

app.get('/',(req,res)=>{
res.render('index');
});
app.get('/login',(req,res)=>{
  res.render('login');
});
  
  // admin
  app.get('/dashbord',query.listeVols);
  app.get('/escale',query.listeEscale);
  app.post('/ajouterVols',query.ajouterVols);
  app.post('/delete/:id',query.deleteVol);
  app.post('/ajouterEscale',query.ajouterEscale);
  app.post('/deleteEscale/:id',query.deleteEscale);
  app.post('/ModdifierVols',query.ModdifierVol);
  app.post('/modifierEscale',query.modifierEscale);
  app.get('/extra',query.listeExtras);
  app.post('/deleteExtra/:id',query.deleteExtra);
  app.post('/ajouterExtra',query.ajouterExtra);
  app.post('/updateExtra',query.updateExtra);
  app.get('/ticket',(req,res)=>{
    res.render('ticket')
  })
const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`http://localhost:${port}`);});