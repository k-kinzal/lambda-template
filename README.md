# lambda-template

[![Build Status](https://travis-ci.org/k-kinzal/lambda-template.svg?branch=develop)](https://travis-ci.org/k-kinzal/lambda-template)
[![Dependency Status](https://david-dm.org/k-kinzal/lambda-template.png?theme=shields.io)](https://david-dm.org/k-kinzal/lambda-template)
[![devDependency Status](https://david-dm.org/k-kinzal/lambda-template/dev-status.png?theme=shields.io)](https://david-dm.org/k-kinzal/lambda-template#info=devDependencies)

Modern AWS Lambda project configuration.

## Get started

You will get the file from GitHub.

```
svn export https://github.com/k-kinzal/lambda-template/trunk lambda-template
cd lambda-template
npm install -g grunt-cli
npm install
npm run create-stack
npm run local
```

## Project structure

```
.
├── Gruntfile.js
├── README.md
├── config                  // configuration dirrectory
│   ├── default.json
│   └── local.json.template // template of configuration
├── dist                    // distribute directory
├── node_modules
├── package.json
├── src
│   └── index.js            // entry point for Lambda function
├── tasks                   // task setting directory
├── templates               // cloudformation templates directory
└── test
    ├── e2e                 // e2e test directory
    ├── fixtures            // debug and test fixtures directory
    └── unit                // unit test directory

```

## Configuration

You will generate `config/local.json.template`. will read as configuration the value of the key of the specified Outputs in Cloudformation.


```json:config/local.json.template
{
  "key": "<%- cloudformationOutputKey %>"
}
```

```js
var config = require('config');

console.log(config.get('key')); //-> show clouformation output value

```

## Task

### Run Lambda functioon on AWS

```
npm run remote
```

Upload and run the lambda functioon on AWS.
The value of the `test/fixtures/debug.json` is passed as an argument to the event at the time of execution.

Please run this task after `npm run create-task` of execution.

### Rum Lambda function on local

```
npm run local
```

Upload and run the lambda functioon on local.
The value of the `test/fixtures/debug.json` is passed as an argument to the event at the time of execution.

### Unit test

```
npm test
```

Run the unit test.

### Integration test

```
npm run e2e
```

Run the e2e test.
Please run this task after `npm run create-task` of execution.

### Watch

```
npm run debug
```

By watching the file and run the jshint and test.

### Create stack

```
npm run create-stack
```

Run the Cloudformation to create a stack.

```json:templates/cfn.json
{
  "AWSTemplateFormatVersion" : "2010-09-09",
  "Description": "Execution role for AWS Lambda",
  "Resources": {
    "LambdaSqsConsumerExecuteRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }]
        },
        "Path": "/",
        "Policies": [{
          "PolicyName": "lambda_exec_role",
          "PolicyDocument": {
            "Version":"2012-10-17",
            "Statement":[
              {
                "Effect": "Allow",
                "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
                ],
                "Resource": [
                  "arn:aws:logs:*:*:*"
                ]
              }
            ]
          }
        }]
      }
    }
  },
  "Outputs": {
    "ExecuteRoleArn": { "Value": { "Fn::GetAtt": ["LambdaSqsConsumerExecuteRole", "Arn"] } }
  }
}
```

The value specified for Outputs can be used in Lambda function by specifying the `config/local.json.template`.

### Delete stack

```
npm run delete-stack
```

You delete the created stack.

### Package

```
npm run package
```

Archive to be able to upload the Lambda function.

## CI

Please change the setting of the access key that allows you to run the CloudFormation and AWS Lambda and Other resources.

```
travis encrypt -r [your repository] AWS_ACCESS_KEY_ID=[access key] --add
travis encrypt -r [your repository] AWS_SECRET_ACCESS_KEY=[secret access key] --add
```

### IAM

To run the CI will need to set policy.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:DescribeStacks",
                "cloudformation:CreateStack",
                "cloudformation:DeleteStack"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:GetRole",
                "iam:DeleteRole",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:Describe*",
                "logs:Get*"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:InvokeFunction",
                "lambda:DeleteFunction"
            ],
            "Resource": "*"
        }
    ]
}
```

## Release

In thought...

## License

MIT

## Copyright

Copyright (c) 2012-2015 k-kinzal
