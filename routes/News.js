import express from 'express';
import NewsCollection from '../models/NewsModel.js';
import mongoose from 'mongoose';
import upload from '../middlewares/upload.js';
import auth from '../middlewares/auth.js';
import { storage } from '../firebase/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

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

    try{
        NewsCollection.find({_id: id}, (err, data)=>{
            if(err){
                res.status(404).send({message:"Data Not Found"});
            }else{
                res.status(201).send(data);
            }
        })
    }catch(error){
        res.status(500).json({ error: 'Server error' });
    }
    
})

router.post('/', auth, upload.array('img', 10), async(req, res)=>{
    try {
        const files = req.files;

        const date = req.body.date==="" ? new Date().toISOString() : new Date(req.body.date).toISOString();

        const imgArray = await Promise.all(files.map(async(file)=>{
            try {
                const { buffer, mimetype } = file;
                const dateTime = new Date().getTime();
                const storageRef = ref(storage, `images/${"news-image-" + dateTime}`);

                const metadata = {
                    contentType: mimetype,
                };

                const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);
        
                const downloadURL = await getDownloadURL(snapshot.ref)

                return downloadURL;
                
            } catch (error) {
                return res.status(400).send(error.message);
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
            date:date
        })

        await news.save()
        .then(result=>{
            res.status(201).json({message:"successfully added to database"})
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json({message:'Upload failed'});
    }
})

export default router;