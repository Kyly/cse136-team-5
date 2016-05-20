PA5/6
=====

Setup
-----
- The database interface has changed too. You can find the configurations in `database/config/config.json`. 
You only need to change the configurations for _development_. 
- Drop your existing `Bookmarks` and `Users` table. When you run the server it will build your tables for you. 
- `npm install`
- `bower install`
- Then start the server. *_See below_*
- You will have no default users at the moment so just create one. 
- If js is turned on logging in should take you to what we did in project 3.

Run project
-----------
Pick your flavor
- `npm start`
- `grunt serve` or `grunt watch:express` 
- `node ./bin/www`