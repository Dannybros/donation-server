import express from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './project-image/')
    },
    filename:function(req, file, cb){
        cb(null,  Date.now() +  file.originalname)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype=== 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const projImg = multer({storage:storage, fileFilter:fileFilter});

export default projImg