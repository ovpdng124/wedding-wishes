export const handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,PUT,PATCH,GET,DELETE,OPTIONS,HEAD"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
