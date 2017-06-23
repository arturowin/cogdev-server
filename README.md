# Coglite Backend

Coglite uses Typescript, Node.js and Express.

Running Locally

Make sure you have Node.js and gulp installed.

## Tip
Install gulp using
<code>npm install -g gulp</code> command.

Use nodemon to have your server restart 
on file changes. Install nodemon using 
<code>npm install -g nodemon</code>.
 
Then start your server with nodemon index.js.

    npm i
    gulp build
    npm start

Your app should now be running on localhost:3500.

## Configuration

Create **.env** file in root directory 
using **.env.example** file.



## Seeds and Tests.

Run seeds and tests using
<code>npm test</code> command.

 **.env.test** configuration file is used for tests.

**Note**: During test running process you must provide

the auth code which is necessary for Google Authentication.
