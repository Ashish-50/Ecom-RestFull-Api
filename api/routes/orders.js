const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product')
const Order = require('../models/order');


router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc =>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
            
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    });
});

router.post('/',(req,res,next)=>{
    Product.findById(req.body.product)
    .then(product=>{
        if (!product){
            return res.status(404).json({
                messaage:"Product Not Found"
            })
        }
        const order = new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.product
       })
       return order.save()
       
    })
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:"Order Stored",
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request: {
                type:"GET",
                url:'http://localhost:3000/orders/' + result._id
            }
        })
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});


router.get('/:id',(req,res,next)=>{
    Order.findById(req.params.id)
    .populate('product')
    .exec()
    .then(order =>{
        if(!order){
            return res.status(404).json({
                messaage:"Order Not Found",

            })
        }
        res.status(200).json({
            order:order,
            request:{
                type:"GET",
                url:'http://localhost:3000/orders'
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})
router.delete('/:id',(req,res,next)=>{
    Order.remove({_id:req.params.id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Order removed',
            request:{
                type:"POST",
                url:'http://localhost:3000/orders',
                body:{product:"ID",quantity:"Number"}
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router