const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../models/product')  // here I am requiring Product model


router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id') // from this we can see only specified fields drom adocument
    .exec()
    .then(docs =>{
        const response = {
            count:docs.length,
            products:docs.map(doc =>{
                return {
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'htpp:localhost:3000/products/' +doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

router.post('/',(req,res,next)=>{ // upload is a middle ware or handler and upload.single is a method which parse or read the image file or form format file single means it can parse only single file
    console.log(req.file)
    // const product = {
    //     name:req.body.name,
    //     price:req.body.price
    // };
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,

    });
    product
    .save()
    .then(result=>{ 
        console.log(result)
        res.status(201).json({
            message:"Product Created Successfully...",
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products/" + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    
});

router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc =>{
        console.log("From Database",doc)
        if (doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:"GET",
                    url:'http://localhost:3000/products/'
                }
            })
        }
        else{
            res.status(404).json({
                message:"No Valid entry Found for Provided ID"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    });

});


router.patch('/:id',(req,res,next)=>{
    const id = req.params.id
    Product.update({_id:id} , {$set: {
        name:req.body.newName,
        price:req.body.newPrice
    }})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"Product updated",
            request:{
                type:"GET",
                url:'http://localhost:3000/products/' +  id 
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
});


router.delete('/:id',(req,res,next)=>{
    const id = req.params.id
    Product.remove({
        _id:id
    })
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"Product Deleted From the Database",
            productId:req.params.id,
            request:{
                type:"POST",
                url:"http://localhost:3000/products/",
                body:{
                    name:"String" , price:'Number'
                }
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
})

module.exports = router