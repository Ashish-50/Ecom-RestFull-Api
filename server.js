const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')



mongoose.connect(`${process.env.databaseurl}`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err)
});

app.use(express.static(path.join(__dirname + '/images')))
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//CORS - Cross-Origin-Resource-Sharing
// if both client and the server are on same server let's say localhost:3000
//then Cors simply allow them to transfer data but
//if any of them not on same server let say server want to get resource from any other origin or server then 
// cors will not allow them to access the data it is act like authentication
// but in api case  server and client server are different but api are meant to fetch data from other resources and give to us so a API has to access all the origin so
//we have to set cors for allowcation as below
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*"); //access-control-allow-origin means it will allow by the browser and * means anyone can access
    res.header('Access-Control-Allow-Header','Origin,X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});
 

app.use('/products',productRoutes); // this middleware forward the request to the routes /products
app.use('/orders',orderRoutes);



app.use((req,res,next)=>{  // if client is not resolved by any above routes then this route handle that
    const error = new Error('Not Found');
    error.status=404;
    next(error);  // here next will pass the error to next middle ware
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

app.listen(port,()=>{
    console.log("server started at port 3000")
});