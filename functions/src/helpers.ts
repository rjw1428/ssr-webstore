import * as functions from 'firebase-functions';
import { db } from './config'
import * as admin from 'firebase-admin';
import { tmpdir } from 'os';
import { join, dirname } from 'path'
import * as sharp from 'sharp';
import * as fs from 'fs-extra';


export const test = functions.https.onCall(async (object: any) => {
    return db.collection('alpineKnives')
        .doc('customerInfo')
        .collection('accounts')
        .doc(object.uid)
        .get()
        .then(doc=>{
            return doc.data()
        })
})

export const resizeImage = functions.storage.object().onFinalize(async (object: any) => {
    console.log(object)
    const contentType = object.contentType;
    const filePath = object.name;
    const fileName = filePath.split('/').pop();
    const destBucket = admin.storage().bucket(object.bucket)
    const bucketDir = dirname(filePath)
    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.png')

    if (fileName.includes('thumb@')) {
        console.log("Already Thumbnail")
        return false;
    } else if (!contentType.includes('image')) {
        console.log("Not an Image")
        return false;
    } else {

        await fs.ensureDir(workingDir)

        await destBucket.file(filePath).download({
            destination: tmpFilePath
        })

        const sizes = [100, 200];

        const uploadPromises = sizes.map(async size => {
            const thumbName = `thumb@${size}_${fileName}`
            const thumbPath = join(workingDir, thumbName);

            await sharp(tmpFilePath)
                .resize(size, size)
                .toFile(thumbPath)

            return destBucket.upload(thumbPath, {
                destination: join(bucketDir, thumbName)
            })
        })

        await Promise.all(uploadPromises)

        return fs.remove(workingDir);
    }
})