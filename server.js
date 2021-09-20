// import express from 'express';

// const app = express();

// app.get('/',(req,res)=>{
//     res.send('WORKING!!!');
// })

// app.listen(3000,()=>{
//     console.log('App is running on port 3000');
// })


// /*


//    / -->res = Working
//    /signin --> POST request because we are posting data of user info in JSON => success /fail
//    /register --> POST  => add data into the database or variable which is in our server => user object will return
//    /profile /:userId --> GET  request for  particular user A/c the id = user
//    /image --> POST but we use PUT because we update the user profile how many links of image he/she posted


// */

//2nd

// import express from 'express';

// const app = express();

// app.get('/',(req,res)=>{
//     res.send('WORKING!!!');
// })

// app.post('/signin',(req,res)=>{
//     // res.send('signing')
//     res.json('signing')
// })

// app.listen(3000,()=>{
//     console.log('App is running on port 3000');
// })


/*


   / -->res = Working
   /signin --> POST request because we are posting data of user info in JSON => success /fail
   /register --> POST  => add data into the database or variable which is in our server => user object will return
   /profile /:userId --> GET  request for  particular user A/c the id = user
   /image --> POST but we use PUT because we update the user profile how many links of image he/she posted


*/


//3rd

// import express from 'express';
// import bodyParser from 'body-parser';




// const app = express();

// //middle ware
// app.use(bodyParser.json());

// const database = {
//     users:[
//         {
//             id:'111',
//             name: 'Hamza',
//             email:'hamza@gmail.com',
//             pwd:'secret',
//             entries:0,
//             joined: new Date()
//         },
//         {
//             id:'112',
//             name: 'Anas',
//             email:'anasrehman@gmail.com',
//             pwd:'cookies',
//             entries:0,
//             joined: new Date()
//         }
//     ]
// }

// app.get('/',(req,res)=>{
//     res.send(database.users);
// })

// app.post('/signin',(req,res)=>{
//     // res.send('signing')
//     if(req.body.email === database.users[0].email && req.body.pwd === database.users[0].pwd){
//         res.json('SUCCESS')
//     }
//     else{
//         res.status(400).json('error logging in');
//     }
    
// })

// app.post('/register',(req,res)=>{

//     const {email,name,pwd} = req.body;

//     database.users.push({
//         id:'113',
//         name: name,
//         email:email,
//         pwd:pwd,
//         entries:0,
//         joined: new Date()
//     })

//     //always remeber to response
//     res.json(database.users[database.users.length-1])

// })

// app.listen(3000,()=>{
//     console.log('App is running on port 3000');
// })

//4th
// /profile /:userId --> GET  request for  particular user A/c the id = user
// /image --> POST but we use PUT because we update the user profile how many links of image he/she posted

import express, { response } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import Clarifai from 'clarifai';

const appp = new Clarifai.App({apiKey:'40568bc656c54d0787dd4c0d4347d63d'});



 const db = knex({
     client: 'pg',
    connection: {
      host : 'localhost', //127.0.0.1 , localhost //postgresql-transparent-75739
      user : 'postgres',
      password : 'root',
      database : 'facerecognition'
    }
  });

  console.log(db.select('*').from('users'));
// db.select('*').from('users').then(data =>{
//     console.log(data);
// });




const app = express();

//middle ware
app.use(bodyParser.json());
app.use(cors());

// const database = {
//     users:[
//         {
//             id:'111',
//             name: 'Hamza',
//             email:'hamza@gmail.com',
//             pwd:'secret',
//             entries:0,
//             joined: new Date()
//         },
//         {
//             id:'112',
//             name: 'Anas',
//             email:'anasrehman@gmail.com',
//             pwd:'cookies',
//             entries:0,
//             joined: new Date()
//         }
//     ],
//     login:[
//         {
//             id:'123',
//             hash:'',
//             email:'anasrehman@gmail.com'
//         }
//     ]
// }

// app.get('/',(req,res)=>{
//     res.send(database.users);
// })

//final DB
app.get('/',(req,res)=>{
  
})

app.post('/signin',(req,res)=>{

    const {email,pwd} = req.body

     //validation //security
     if(!email ||  !pwd){

        return res.status(400).json('incorrect form submission');
    }

     //without db
    //         // Load hash from your password DB.
    //     bcrypt.compare("yoursecret", '$2a$10$nIjb8tdep8N6WI7kGGSisO5lYORosjrk/qFkQr7loYLDgwdpkYX3W', function(err, res) {
    //         // res == true
    //         console.log('first guess: ',res);
    //     });
    //     bcrypt.compare("yoursecre", '$2a$10$nIjb8tdep8N6WI7kGGSisO5lYORosjrk/qFkQr7loYLDgwdpkYX3W', function(err, res) {
    //         // res = false
    //         console.log('second guess: ',res);
    //     });

    // // res.send('signing')
    // if(req.body.email === database.users[0].email && req.body.pwd === database.users[0].pwd){
    //     // res.json('SUCCESS')
    //     res.json(database.users[0]);
    // }
    // else{
    //     res.status(400).json('error logging in');
    // }

    //with db and final
        db.select('email','hash').from('login')
        .where('email', '=', email)
        .then(data =>{
                const isValid = bcrypt.compareSync(pwd,data[0].hash);
                if(isValid){
                  return  db.select('*').from('users')
                    .where('email', '=',email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err=>res.status(400).json('unable to get user'))
                  
                }else{
                    res.status(400).json('wrong credentials')
                }
        }).catch(err=>res.status(400).json('wrong credentials'))
  
    
})

app.post('/register',(req,res)=>{
    // console.log(res.json());

    const {email,name,pwd} = req.body;

    //validation //security
    if(!email || !name || !pwd){

        return res.status(400).json('incorrect form submission');
    }


    //
    // console.log('email:',email);

    // bcrypt.hash(pwd, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    // database.users.push({
    //     id:'113',
    //     name: name,
    //     email:email,
    //     pwd:pwd,
    //     entries:0,
    //     joined: new Date()
    // })
//1
    // db('users').insert({
    //         email:email,
    //         name :name,
    //         joined:new Date()

    // }).then(console.log).catch(err =>{
    //     console.log(err);
    // })
//2
        // db('users')
        // .returning('*')
        // .insert({
        //     email:email,
        //     name :name,
        //     joined:new Date()

        // })
        // .then(user=>{
        //     res.json(user[0]);
        // })
        // .catch(err=>res.status(400).json('unable to register'))

        //fdb
        const hash = bcrypt.hashSync(pwd); //using sync way not assync
        db.transaction(trx => {
            trx.insert({
                hash:hash,
                email:email
            })
            .into('login')
            .returning('email')
            .then(loginEmail=>{

                    return  trx('users')
                        .returning('*')
                        .insert({
                            email:loginEmail[0],
                            name :name,
                            joined:new Date()
                
                        })
                        .then(user=>{
                            res.json(user[0]);
                        })
            }).then(trx.commit)
            .catch(trx.rollback)
        })
       
        .catch(err=>res.status(400).json('unable to register'))

    // //always remeber to response
    // res.json(database.users[database.users.length-1])

})
//without database
// app.get('/profile/:id',(req,res)=>{
//      const { id } = req.params;
//      let found = false;
//      database.users.forEach(user=>{

//         if(user.id === id){
//             found = true;
//             return   res.json(user);
//         }

//      })
//      if(!found){
//          res.status(400).json('not found');
//      }
// })
//With database
// app.get('/profile/:id',(req,res)=>{
//     const { id } = req.params;
//     let found = false;
//    db.select('*').from('users').where(
//        {id:id}
//     ).then(user =>{
//         console.log(user);
//     })
//     if(!found){
//         res.status(400).json('not found');
//     }
// })
//with database p2
app.get('/profile/:id',(req,res)=>{
    const { id } = req.params;
   
   db.select('*').from('users').where(
       {id:id}
    ).then(user =>{
       if(user.length){
        res.json(user[0])
       }else{
        res.status(400).json('Not Found')
       }
    }).catch(err=>res.status(400).json('error getting user'))
})

//Without DB
// app.post('/image',(req,res)=>{

//     const { id } = req.body;
//     let found = false;
//     database.users.forEach(user=>{

//        if(user.id === id){
//            found = true;
//            user.entries++;
//            return   res.json(user.entries);
//        }

//     })

//     if(!found){
//         res.status(400).json('not found');
//     }

// })

//With DB
app.put('/image',(req,res)=>{
//we update the entries here
    const { id } = req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries);
    }).catch(err=>res.status(400).json('unable to get entries'))
   

})

app.post('/imageurl',(req,res)=>{

    appp.models.predict("a403429f2ddf4b49b307e318f00e528b",req.body.input)
    .then(data=>{
        res.json(data);
    }).catch(err => res.status(400).json('unable to work with API'))

})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

// app.listen(3000,()=>{
//     console.log('App is running on port 3000');
// })
app.listen(process.env.PORT || 3000,()=>{
    console.log(`App is running on port ${process.env.PORT}`);
})