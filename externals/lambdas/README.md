# Tutorial

## Lambda Config
- Create a Lambda function with a name such as `wedding-wishes-lambda` and paste the content in `index.mjs` to that function.
- Do the same with `cors-proxy.mjs` file into a new Lambda function with a name such as `api-gateway-cors-proxy`.

## S3 Config
- Create a bucket on AWS S3 to store the data file
- Set your new bucket name into the `BUCKET_NAME` constant variable.

## API Gateway Config
- Create an API and choose the REST API type.
- Create a resource and 3 methods inside for that.
  - `POST` & `GET`: Set the integration request type is Lambda and choose the function `wedding-wishes-lambda`
  - `OPTIONS`: Do the same above but choose the function `cors-proxy.mjs`
- Deploy the API to the `Stages` and get the URL for the resource created above.
- Take the API Gateway URL and drop it to the `apiUrl` variable in the `/scripts/app.js` and the `API_GATEWAY_ENDPOINT` variable in the `/externals/spreadsheets/script.gs` file
