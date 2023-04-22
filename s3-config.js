const { S3Client } = require('@aws-sdk/client-s3')

let s3;
if (process.env.NODE_ENV !== 'test') {
    s3 = new S3Client({
        region: process.env.AWS_REGION,
    })
} else {
    s3 = {}
}

module.exports = s3