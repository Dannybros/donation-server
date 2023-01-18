import { initializeApp, cert }  from "firebase-admin/app";
import { getStorage } from 'firebase-admin/storage';
import { readFile } from 'fs/promises';
import * as fs from 'fs';

const serviceAccount = JSON.parse(
    await readFile(
        new URL('./donationimagebucket-firebase-adminsdk-2z9af-f092a183c5.json', import.meta.url)
    )
);

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'gs://donationimagebucket.appspot.com'
});
  
const bucket = getStorage().bucket();

export const uploadFile=async(filepath, destFileName)=>{
    await bucket.upload(filepath, {
        destination:destFileName,
    })
    fs.unlinkSync(filepath);
}
