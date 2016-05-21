PA5/6
=====

Setup
-----
- The database interface has changed too. You can find the configurations in `database/config/config.json`. 
You only need to change the configurations for _development_. 
- Drop your existing `Bookmarks` and `Users` table. When you run the server it will build your tables for you. 
- `npm install`
- Then start the server. *_See below_*
- You will have no default users at the moment so just create one. 
- If js is turned on logging in should take you to what we did in project 3.

Run project
-----------
Pick your flavor
- `npm start`
- `grunt server` or `grunt watch:express` 
- `node ./bin/www`

API
---
__GET__ */api/bookmarks* 200 (OK), list of bookmarks. Support sorting and filtering.
```js
axios.get('/api/bookmarks').then(function (payload) {
      console.log(JSON.stringify(payload));
  });

{
  "data": [
    {
      "id": 7,
      "url": "https://github.com/",
      "name": "a",
      "description": "",
      "keywords": "",
      "favorite": false,
      "isFolder": false,
      "createdAt": "2016-05-21T08:22:34.000Z",
      "updatedAt": "2016-05-21T08:22:34.000Z",
      "folderId": 1,
      "userId": 1
    },
    {
      "id": 8,
      "url": "https://github.com/",
      "name": "b",
      "description": "",
      "keywords": "",
      "favorite": false,
      "isFolder": false,
      "createdAt": "2016-05-21T08:22:48.000Z",
      "updatedAt": "2016-05-21T08:22:48.000Z",
      "folderId": 1,
      "userId": 1
    },
    {
      "id": 9,
      "url": "https://github.com/",
      "name": "c",
      "description": "",
      "keywords": "",
      "favorite": false,
      "isFolder": false,
      "createdAt": "2016-05-21T08:23:21.000Z",
      "updatedAt": "2016-05-21T08:23:21.000Z",
      "folderId": 1,
      "userId": 1
    }
  ],
  "status": 200,
  "statusText": "OK",
  "headers": {
    "date": "Sat, 21 May 2016 08:24:59 GMT",
    "etag": "W/\"286-d4f1174c\"",
    "connection": "keep-alive",
    "x-powered-by": "Express",
    "content-length": "646",
    "content-type": "application/json; charset=utf-8"
  },
  "config": {
    "transformRequest": {},
    "transformResponse": {},
    "headers": {
      "Accept": "application/json, text/plain, */*"
    },
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "method": "get",
    "url": "/api/bookmarks"
  },
  "request": {}
}
```  

### Create
__POST__ */api/bookmarks* 404 (Not Found), 400 (Bad Request) if invalid,  409 (Conflict) if resource already exists
```js
axios.post('/api/bookmarks', {
    "url": "https://someuri.com/",
    "name": "bar",
    "description": "",
    "keywords": "",
    "favorite": false,
    "isFolder": false,
    "folderId": 1
}).then(function (payload) {
    console.log(JSON.stringify(payload));
});

{
  "data": "",
  "status": 204,
  "statusText": "No Content",
  ...
}
```  

### Update
__POST__ */api/bookmarks/:bookId* 204 (No Content). 404 (Not Found), if ID not found or invalid.
```js
axios.post('/api/bookmarks/5', {name: 'Dudiest'}).then(function (payload) {
    console.log(JSON.stringify(payload));
});

{
  "data": "",
  "status": 204,
  "statusText": "No Content",
  ...
}
```  

> Before update
```json
{
  "id": 5,
  "url": "https://github.com/",
  "name": "Dude",
  "description": "",
  "keywords": "",
  "favorite": false,
  "isFolder": false,
  "createdAt": null,
  "updatedAt": null,
  "folderId": 1,
  "userId": 4
}
```  
 
> After update 
```json
{
  "id": 5,
  "url": "https://github.com/",
  "name": "Dudiest",
  "description": "",
  "keywords": "",
  "favorite": false,
  "isFolder": false,
  "createdAt": null,
  "updatedAt": "2016-05-21T10:04:46.000Z",
  "folderId": 1,
  "userId": 4
}
```  

## DELETE
__DELETE__ */api/bookmarks/:bookId* 200 (OK). 404 (Not Found), if ID not found or invalid.