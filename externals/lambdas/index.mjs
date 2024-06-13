/**
 * Script Steps:
 * Bước 1 là lưu trữ giá trị được gửi từ GG Sheets vào file, xử lí tạo file tại chỗ hoặc lưu vào S3
 * Bước 2 là viết 1 API đọc file và trả về kết quả cho phía Client hiển thị.
 * Note: File sẽ lưu dưới dạng JSON, có thể dùng để xuất CSV nếu cần.
 * Note: Bước 1 sẽ phát hiện API method POST, dùng để lưu vào file
 * Note: Bước 2 sẽ phát hiện API method GET, dùng để trả về data từ file
 * Note: Sẽ tạo ra 2 file, 1 file chứa các message chưa publish, 1 file chứa các message đã publish
 * Note: Mỗi lần gọi POST sẽ lưu data vào file message chưa publish, nếu đã tồn tại thì lưu thêm, nếu chưa tồn tại file thì tạo mới.
 * Note: Mỗi lần gọi GET sẽ lấy data từ file message và trả về.
 * Note: Phía client sẽ lấy data trả về, chạy vòng lặp và hiển thị từng message theo 1 thơi gian nhất định, khi chạy xong sẽ tiến hành gọi lại GET để lấy message tiếp và lặp lại mãi
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const headers = {
    "Access-Control-Allow-Headers" : "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PUT,PATCH,GET,DELETE,OPTIONS,HEAD"
};
const s3Client = new S3Client();
const BUCKET_NAME = 'wedding-wishes-bucket';
const OBJECT_KEY = 'wishes.json';

export const handler = async (event) => {
    console.log(JSON.stringify(event, null, 2))
    // TODO implement
    const { httpMethod, body } = event;
    const data = JSON.parse(body);

    if (httpMethod === 'POST') {
        try {
            const existingData = await getDataFromS3();
            const updatedData = existingData ? [...existingData, data] : [data];

            await putDataToS3(updatedData);

            return {
                statusCode: 200,
                headers,
                body: 'Data saved successfully',
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: `Error: ${err.message}`,
            };
        }
    } else if (httpMethod === 'GET') {
        try {
            const data = await getDataFromS3();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data || []),
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: `Error: ${err.message}`,
            };
        }
    } else {
        return {
            statusCode: 400,
            headers,
            body: 'Invalid HTTP method',
        };
    }

};

const getDataFromS3 = async () => {
    try {
        const data = await s3Client.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: OBJECT_KEY }));

        return data.Body ? JSON.parse(await data.Body.transformToString()) : null;
    } catch (err) {
        if (err.name === 'NoSuchKey') {
            return null;
        }

        throw err;
    }
};

const putDataToS3 = async (data) => {
    const body = JSON.stringify(data);

    await s3Client.send(new PutObjectCommand({ Bucket: BUCKET_NAME, Key: OBJECT_KEY, Body: body }));
};
