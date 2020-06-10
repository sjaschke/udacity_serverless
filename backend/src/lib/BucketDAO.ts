import * as AWS from "aws-sdk";
import {setAttachmentURL} from "./TodoDAO";

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

export async function getUploadUrl(todoId: string, userId : string) {
    const uploadURL = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })

    const downloadURL = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })

    await setAttachmentURL(todoId,userId, downloadURL)

    return uploadURL;
}
