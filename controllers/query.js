const {query} = require('express');
const {connection }= require('../connection');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const { readFile } = require('fs/promises');
exports.getVols = (req,res)=>{
    
    var sql = `select vol.*,escale.ville_escal from vol,escale where vol.id_escal=escale.id_escal and vol.vile_D='${req.body.vile_D}' and vol.vile_A='${req.body.vile_A}' and vol.date_D='${req.body.date_D}' and vol.nombre_place>=${req.body.nombre_p}`;
     var sql2 = 'select * from extra';
    connection.query(sql, function (err, result) {
       if (err) {
        throw err;
       }else{
        
         var vols=result;
         connection.query(sql2, function (err, result) {
             if(err){
                 throw err
             }else{
                 var extras = result;
                 res.render('vols',{vols:vols,extras:extras});
             }
         });
         req.app.locals.data.nompbreplace=req.body.nombre_p;
       } 
      
      }); 
      
}

exports.valideResrvation= async(req,res)=>{
  var email=req.body.email;
      var sql1 = `insert into users (nom,prenom,email,telephone) value ('${req.body.nom}','${req.body.prenom}','${req.body.email}','${req.body.phone}')`
        var sql2 = 'SELECT * FROM users ORDER BY id DESC LIMIT 1';
      var lastReserv = 'SELECT * FROM reservation ORDER BY id_res DESC LIMIT 1';
      connection.query(sql1, function (err, result) {
      if (err) {
        throw err;
      }else{
        connection.query(sql2, function (err, result) {
            if (err) {
                throw err;
              }else{
                 var sql3 = `insert into reservation (id,id_vol,nombre_Res,prixtotal) value (${result[0].id},${req.app.locals.data.idVol},${req.app.locals.data.nompbreplace},${req.app.locals.data.prix})`;
                 
                 connection.query(sql3, function (err, result) {
                    if (err) {
                        throw err;
                      }else{
                        if(req.app.locals.data.extrs.length>0){
                          connection.query(lastReserv, function (err, result) {
                            var idReservation = result[0].id_res;
                            if(err){
                              throw err;
                            }else{
                              for(let i = 0 ; i<req.app.locals.data.extrs.length;i++){
                                var insertExtraReserv = `insert into reseextra (id_extra,id_res) value (${req.app.locals.data.extrs[i]},${result[0].id_res})`;
                                connection.query(insertExtraReserv, function (err, result) {
                                  if(err){
                                    throw err;
                                  }
                                });
                              }
                              
                            }
                          });
                        }
                          var sql4 = `UPDATE vol SET nombre_place = nombre_place-${req.app.locals.data.nompbreplace} WHERE id_vol = ${req.app.locals.data.idVol};`
                          connection.query(sql4,  function (err, result) {
                            if (err) {
                                throw err;
                              }else{
                                // partie envoyer email
                                var dataEmail =`SELECT * FROM vol,escale,extra,users,reseextra,reservation where reservation.id_res=1 and reservation.id_vol=vol.id_vol and reservation.id_res=reseextra.id_res and reseextra.id_extra=extra.id_extra and reservation.id=users.id and vol.id_escal=escale.id_escal`;
                                connection.query(dataEmail, async function (err, result) {
                                  if(err){
                                    throw err
                                  }else{
                                         // Step 1
                                let transporter = nodemailer.createTransport({
                                  service: 'gmail',
                                  auth: {
                                      user: '', // TODO: your gmail account
                                      pass: '' // TODO: your gmail password
                                  }
                                });
                                // res.render('ticket',{data:result});
                                
                                // console.log(typeof ticket);
                                var  test = await  ejs.render(fs.readFileSync(__dirname+'/../views/ticket.ejs','utf8'),{data:result});
                                // console.log(test);
                                // Step 2
                                console.log(test);
                                let mailOptions = {
                                  from: '', // TODO: email sender
                                  to: email, // TODO: email receiver
                                  subject: 'Reservation SafiAir',
                                  // text: 'Wooohooo it works!!',
                                  html:  test
                                };

                                // Step 3
                                transporter.sendMail(mailOptions, (err, data) => {
                                  if (err) {
                                      return log('Error occurs');
                                  }else{
                                    res.render('ticket',{data:result});
                                  }
                                  
                                });
                                  }
                             
                                });
                              }});
                        
                        
                         
                          
                      }
                    });
              }
        });
        
      }
      
      
     });



}

exports.listeVols = (req,res) =>{
  var sql = "select * from escale,vol WHERE escale.id_escal=vol.id_escal";
  var sql2 = "select * from escale"
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      connection.query(sql2, function (err, result1) {
        if(err){
          throw err
        }else{
          res.render('dashbord',{vols:result,extras:result1});
        }
        
      });
      
    }
  });

}

exports.ajouterVols = (req,res) =>{
  var sql=`INSERT INTO vol (nom_vol,vile_D,vile_A,date_D,date_A,heur_D,heur_A,nombre_place,id_escal,prix_vol) VALUES('${req.body.nom_v}','${req.body.ville_d}','${req.body.ville_a}','${req.body.date_d}','${req.body.date_a}',${req.body.heur_d},${req.body.heur_a},20,${req.body.escal},${req.body.prix})`;
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/dashbord');
    }
    
  });
}

exports.deleteVol = (req,res) =>{
  var sql=`DELETE FROM vol WHERE id_vol = ${req.params.id}`;

  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      // console.log('deleted');
      res.redirect('/dashbord');
    }
    
  });
}

exports.listeEscale = (req,res) =>{
  var sql = "select * from escale";
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.render('escals',{escals:result});
    }
    
  });
  
}
exports.ajouterEscale = (req,res) =>{
  var sql = `INSERT INTO escale(ville_escal) VALUES ('${req.body.nom_v}')`;
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/escale');
    }
    
  });
}
exports.deleteEscale = (req,res) =>{
  var sql=`DELETE FROM escale WHERE id_escal = ${req.params.id}`;

  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/escale');
    }
    
  });
}
exports.ModdifierVol = (req,res) =>{
  
  var sql=`UPDATE vol set nom_vol='${req.body.nom_v}' , vile_D='${req.body.ville_d}' , vile_A='${req.body.ville_a}' , date_D='${req.body.date_d}' , date_A='${req.body.date_a}' , heur_D=${req.body.heur_d} , heur_A=${req.body.heur_a} , id_escal=${req.body.escal} , prix_vol=${req.body.prix} WHERE id_vol=${req.body.id} `;

  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      // console.log('deleted');
      res.redirect('/dashbord');
    }
    
  });
}

exports.modifierEscale = (req,res) =>{
  var sql=`UPDATE escale set ville_escal='${req.body.nom_v}' WHERE id_escal=${req.body.id}`;

  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      // console.log('deleted');
      res.redirect('/escale');
    }
    
  });
}

exports.listeExtras = (req,res) =>{
  var sql = "select * from extra";
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.render('extars',{extras:result});
    }
    
  });
}
exports.ajouterExtra = (req,res) =>{
  var sql = `INSERT INTO extra (nom_extra,prix) VALUES ('${req.body.nom_extra}','${req.body.prix}')`;
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/extra');
    }
    
  });
}

exports.deleteExtra = (req,res) =>{
  var sql = `delete from extra where id_extra=${req.params.id}`;
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/extra');
    }
    
  });

}

exports.updateExtra = (req,res) =>{
  var sql = `UPDATE extra set nom_extra='${req.body.nom_extra}' , prix='${req.body.prix}' WHERE id_extra=${req.body.id}`;
  connection.query(sql, function (err, result) {
    if(err){
      throw err
    }else{
      res.redirect('/extra');
    }
    
  });

}