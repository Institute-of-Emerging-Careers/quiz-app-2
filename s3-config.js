const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    bucket: process.env.LEC_BUCKET_NAME,
})

module.exports = s3