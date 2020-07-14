# mock-json-response

A flexible RESTful API provider for front end developers to mock server response. The basic idea of this project is to provide ready to use tool to mock a given response.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install mock-json-response.

```bash
npm install mock-json-response
```

## Usage

```js
const logicDirectory = __dirname + '/logic';
const dataDirectory = __dirname + '/data';

require('mock-json-response')(logicDirectory, dataDirectory)
```
Directory address of both logic and data should be passed to mock-json-response. On successful start mock-json-response will be listening to 3000 port (by default).


## functions directory
This contains JS files that would have 3 sections:
1. logic: A function that would get the data and request object, ani kind of data manipulation can be performed.
2. request: This object defines "method": type of request (GET, POST, PATCH, DELETE) and "urlPath": Path of the request as fields. 
3. response: This object defines response status and response data.

## data directory
This contains JSON files with raw response.

## Request
Possible fields of the request object

```js
{
    method: "GET",     //type of request
    urlPath: "/mock/test", //path of the request
    headers: {      
        "x-mock": {   //header keys
            contains: "error",  //matchers to match the incoming header value to passed value
        },
        "x-purchase": {
            equalTo: "mock"
        }
    },
}
```

## Response

Possible fields of the response object. If both inlineData and bodyFileName is present inlineData will take precedence.

```js
{
    status: 200,  //status to be returned
    headers: {    //headers in response
        "Content-Type": "application/json",
    },
    inlineData: {   //a way to pass raw data inline
        test: 'inline data'
    },
    bodyFileName: "data.json"   //name of the file with raw json data
}
```

## logic
```js
logic: function ({ headers, params }, data) {
      //data manipulation logic goes here
}
```

## Contributing
Pull requests are welcome. For major changes or features, please open an issue first to discuss what you would like to change.


## Why MJR?

1. Request Matching
2. Response Manipulating

## Git book

For more information and detailed explanation. Please visit: [gitbook](https://akhilgangula.gitbook.io/mock-json-response/response)