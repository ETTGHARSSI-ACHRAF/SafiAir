const {query} = require('express');
const {connection }= require('../connection');

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

exports.valideResrvation=(req,res)=>{
    //   var sql1 = `insert into users (nom,prenom,email,telephone) value ('${req.body.nom}','${req.body.prenom}','${req.body.email}','${req.body.phone}')`
    //     var sql2 = 'SELECT * FROM users ORDER BY id DESC LIMIT 1';
    //   var lastReserv = 'SELECT * FROM reservation ORDER BY id_res DESC LIMIT 1';
    //   connection.query(sql1, function (err, result) {
    //   if (err) {
    //     throw err;
    //   }else{
    //     connection.query(sql2, function (err, result) {
    //         if (err) {
    //             throw err;
    //           }else{
    //              var sql3 = `insert into reservation (id,id_vol,nombre_Res,prixtotal) value (${result[0].id},${req.app.locals.data.idVol},${req.app.locals.data.nompbreplace},${req.app.locals.data.prix})`;
    //              connection.query(sql3, function (err, result) {
    //                 if (err) {
    //                     throw err;
    //                   }else{
    //                     if(req.app.locals.data.extrs.length>0){
    //                       connection.query(lastReserv, function (err, result) {
    //                         if(err){
    //                           throw err;
    //                         }else{
    //                           for(let i = 0 ; i<req.app.locals.data.extrs.length;i++){
    //                             var insertExtraReserv = `insert into reseextra (id_extra,id_res) value (${req.app.locals.data.extrs[i]},${result.id_res})`;
    //                             connection.query(insertExtraReserv, function (err, result) {
    //                               if(err){
    //                                 throw err;
    //                               }
    //                             });
    //                           }
                              
    //                         }
    //                       });
    //                     }
    //                       var sql4 = `UPDATE vol SET nombre_place = nombre_place-${req.app.locals.data.nompbreplace} WHERE id_vol = ${req.app.locals.data.idVol};`
    //                       connection.query(sql4, function (err, result) {
    //                         if (err) {
    //                             throw err;
    //                           }else{
    //                             res.redirect('/');
    //                           }});
                        
                        
                         
                          
    //                   }
    //                 });
    //           }
    //     });
        
    //   }
      
      
    //  });
    for(let i = 0 ; i<req.app.locals.data.extrs.length;i++){
      var insertExtraReserv = `insert into reseextra (id_extra,id_res) value (${req.app.locals.data.extrs[i]},${result.id_res})`;

    }
}