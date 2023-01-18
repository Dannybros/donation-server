import express from 'express'
import donatorCollection from '../models/DonatorModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res)=>{

    donatorCollection.find((err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

router.post('/find', (req,res)=>{
    const {donateTo} = req.body; 

    let query = donatorCollection
            .find({donateTo:donateTo})
            .sort({amount: -1})
            .limit(3);

    query.exec(function (err, data){
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })

} )

router.post('/delete/:id', (req, res)=>{
    const id = req.params.id;

    donatorCollection.find({_id: id}, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    }).deleteOne();
})

router.post('/search', async(req, res)=>{
    const page = parseInt(req.query.page);
    const limit = 1;
    
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;

    const results = {};

    if(endIndex < await donatorCollection.countDocuments().exec()){
        results.next={
            page:page + 1
        }
    }
    
    if(startIndex<0){
        results.previous ={
            page:page - 1
        }
    }
    
    try{
        results.result = await donatorCollection.find().limit(1).skip(startIndex).exec()
        res.json(results)
    }
    catch (error){
        res.status(500).json({message: error.message})
    }


})

router.post('/', async (req, res)=>{
    const donator = new donatorCollection({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        amount:req.body.amount,
        email:req.body.email,
        donateTo:req.body.donateTo,
        cardName:req.body.cardName
    })

    donator.save()
        .then(result=>{
            res.status(201).json({
                message:"Donation registered successfully",
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
})

export default router;