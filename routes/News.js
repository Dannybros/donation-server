import express from 'express';
import NewsCollection from '../models/NewsModel.js';
import mongoose from 'mongoose';
import newsImg from '../middlewares/news.js';
import auth from '../middlewares/auth.js';
import { uploadFile } from '../firebase/index.js';
import { storage } from '../firebase/firebase.js';
import { ref, getDownloadURL, deleteObject } from "firebase/storage";

const router = express.Router();

router.get('/', (req, res)=>{
    NewsCollection.find((err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

router.get('/topThree', (req, res)=>{
   NewsCollection.find().sort({view: -1 }).limit(3).exec((err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

router.post('/view', (req, res)=>{
    const {id} = req.body;
    NewsCollection.findByIdAndUpdate(id, {$inc: {view: 1}}, {new:true}, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

router.post('/delete/:id', auth, async(req, res)=>{
    const id = req.params.id;
    const img = req.body;

    await img.map((file)=>{
        try {
            deleteObject(ref(storage, `${file}`))
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
    })

    NewsCollection.find({_id: id}, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).json({msg:'deleted'});
        }
    }).deleteOne();
})

router.get('/getOne/:id', (req, res)=>{
    const id = req.params.id

    NewsCollection.find({_id: id}, (err, data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

router.post('/', auth, newsImg.array('img', 10), async(req, res)=>{

    if(req.body.titleEn==="" || req.body.titleZh==="" || req.body.titleKo==="" || req.body.contentEn==="" ||
    req.body.contentZh==="" ||req.body.contentKo==="" ){

        res.status(500).json({message:"fill in all the input"})
        
    }else{
        
        const files = req.files;

        const imgArray =await Promise.all(files.map(async(file)=>{
            try {
                await uploadFile(`${file.destination}${file.filename}`, `images/${file.filename}`);
        
                return getDownloadURL(ref(storage, `images/${file.filename}`))
                .then((url)=>{
                    const string = url;
                    return string;
                });
                
            } catch (error) {
                console.log (error)
                res.status(400).send(error.message);
            }
        }))

        const news = new NewsCollection({
            _id: new mongoose.Types.ObjectId(),
            img:imgArray,
            title:{
                en:req.body.titleEn,
                zh:req.body.titleZh,
                ko:req.body.titleKo
            },
            content:{
                en:req.body.contentEn,
                zh:req.body.contentZh,
                ko:req.body.contentKo
            },
        })

        await news.save()
            .then(result=>{
                res.status(201).json({msg:"successfully added to database"})
            })
            .catch(err=>{
                res.status(500).json({
                    error:err
                });
            });
    }
})

export default router;