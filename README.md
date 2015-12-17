# Sample project using gulp-swag 

This is a sample project that create an API with one endpoint /articles.


## Get Started
1. Create AWS user with following permissions:
   * AWSLambdaFullAccess
   * AmazonDynamoDBFullAccess
   * AmazonAPIGatewayAdministrator

2. Add your the user credentials to ~/.aws/credentials
```
[default] ; user account
aws_access_key_id = xxxx
aws_secret_access_key = xxxx
```

3. Download the local dynamoDB [here](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html#Tools.DynamoDBLocal.DownloadingAndRunning) and start it

4. Create the articles table
```sh
$ gulp db:migrate
```

5. Start the local server
```sh
$ cd handlers/create_article
$ npm install
$ cd ../..
$ gulp lambda:server
```
NB: Each handler manages its own set of dependencies.


6. Test your lambda handler
```sh
$ gulp
```

7. Test local API
```sh
$ NODE_ENV=test gulp lambda:server &
$ NODE_ENV=test gulp mocha:routes
or
$ curl -X POST -H 'application/json' -d '{"article":{"title": "first article", "text": "persisted in local dynamoDB"}}' http://localhost:5000/articles
```

## Deployment to AWS
1. Create a environment folder "alpha"
```sh
$ cp -r env/dev env/alpha
```

2. Create Api Gateway execution role with the following permissions:
   * lambda:InvokeFunction
   * iam:PassRole

3. Create the Lambda execution role with the following permissions:
   * AmazonDynamoDBFullAccess
   * [lamdba permission](http://docs.aws.amazon.com/lambda/latest/\
dg/intro-permission-model.html)

4. Edit env/alpha/config.json
   * set your desired AWS region
   * set your dynamoDB endpoint in the same region
   * set the deployment.credentials to the ARN created in step 2
   * set the deployment.api.name 
   * set the deployment.stage.name

5. Edit env/alpha/routes.json
   * set role to the ARN created in step 3

6. Edit env/alpha/version.json (optional at this stage). This file allows you to deploy a specific version of lambda handler to your API.

7. Create your dynamoDB Table 
```sh
$ NODE_ENV=alpha gulp db:migrate
```

8. Deploy your lambda handler
```sh
$ NODE_ENV=alpha gulp lambda:deploy
```

9. Deploy your api
```sh
NODE_ENV=alpha gulp apigateway:deploy
```

10. Test your API on AWS
```sh
curl -X POST -H 'Content-Type: application/json' -d '{"article":{"title": "first article", "text": "persisted in cloud dynamoDB"}}' <api-url>
```
