# Creating a Simple CRUD Application (Server Side Only)


Before starting -
Check books.sql file. If it has an extra extension (i.e. books.sql.txt, change it to books.sql)
Check all the files in views/books and views/users. If it has an extra extension (eg. login.ejs.html, change it to login.ejs). Do this for all .ejs files.

### Basic Steps Involved:
- Install Node.js
- Ubuntu sudo apt-get install nodejs npm
- Linux sudo yum install nodejs npm
- Windows/Mac - https://nodejs.org/en/download/

Note that the command for using node right now is nodejs and not node, if you want to change that -
`sudo ln -s /usr/bin/nodejs /usr/sbin/node`

Setup (manually or automatically) a folder structure for the web app
- Base
- views
- public
- css
- javascript
- images  

You can even use the Express Generator to create an application skeleton automatically for you. However, I would advise not to do that because in the process you would not pay attention to what you are adding and what you aren’t. It will end up in creating a lot of features that you wouldn’t even use. It’s better (although slightly more time consuming) to create it manually once and understand each of the elements and you can use the generator once you are familiar with the environment!



Install Express and ejs (or any templating engine you want)
Move to the base folder and run the following commands -
For Express -  (Web Framework for Node.js. More Info here)

``js
npm install express
npm install express-session (Session Management)
``

For Path - (Used to handle filepaths. More Info Here)
npm install path

For Template Rendering -
``js
npm install ejs
npm install body-parser
``
For MySQL (Database Access) -
npm install mysql

Create the server script to output “Hello World”, serve static web pages and route to appropriate functions when a particular URL is given

Creating - Create a file called server.js (link has the code) in the base folder.

What does the server code do?
It will serve any file in the public folder as-is.
It connects to the database (using command db.init() which runs the init() function in db.js
It will understand all urls with <domain_name>:8080/login (or logout) and map them to the appropriate functions in user.js
It will understand all urls with <domain_name>:8080/books and <domain_name>:8080/books/insert(or edit or delete or update or confirmdelete) and map them to the appropriate functions in books.js

Booting -
Run the command -
nodejs(or node) server.js

Check if the server is alive by going on your browser and typing:
http://localhost:8080/
Put some html content in a file Hello.html into the 'public' folder and check if the file displays in the browser using the following command -
http://localhost:8080/Hello.html


Install MySQL (or any other database you want)
Ubuntu (For Linux write yum instead of apt-get)
sudo apt-get update
sudo apt-get install mysql-server
	sudo mysql_secure_installation
	sudo mysql_install_db

Status checks + explanation of each of the commands is mentioned here [Please go through it!]
Windows, Mac & Ubuntu Installers with Instructions here


Create a database, schema and tables
Think about your database structure well. Do it on paper while referencing your HTML templates before actually coding it. You can run the books.sql code in your database in order to set up a schema for the example code. I recommend going through the SQL file before running that code.

Connecting to MySQL using Command Line -
mysql -u USERNAME -pPASSWORD -h HOSTNAMEORIP DATABASENAME
Creating a database (While inside the mysql terminal) -
	create database books;
use books;
Running books.sql (While inside the mysql terminal) -
	\. <full_path_to_folder_with_books.sql>/books.sql


Connect to the database through Node
Once you have your MySQL set up, find out your database’s Host (i.e. IP Address), Port (Which you configured during setup or can find it in the config files), username (usually root/admin), password (the one you mentioned during setup) and database name (that you created or which was created using books.sql) . Add these values into the config-template.js file (for DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME) and rename it to config.js.

The code used to actually connect to the database is present in db.js [Please go through it!]

Why do we use a config file?
It is always better (and is always used in enterprise class apps) to create a config file where parameters like IP addresses, ports, username and password etc are kept. This helps in many ways, one being that it is a single place where we can store all of the hard coded information and we just need to go to one place to change it. Another important advantage is that this file can now be kept privately while you can share the rest of your code base, thereby protecting your passwords from others.
Listing Information
Select data from the database
A simple select query can be used to fetch all the relevant data. In this example, we can do a simple ‘SELECT * from books’ in order to list all the books in the database.

Populate this data via the templating tool
Once we have our data, we need to populate it into the HTML templates that we created. This can be done using the EJS framework (or any other templating tool being used). Place the templates that you have created in the views/books or views/user folder with the extension .ejs (Sample can be seen in the codebase provided). Wherever you need to add values from the server, place the correct variable name and surround it with <%= var_name %>. For example, <%= book.id %>

Send the content as a response
The ejs tool automatically places the correct data into the placeholders provided in the template based on the variable names. This is done by using the response.render() function where the first parameter is the template name and the second parameter holds the data to be added into the template.

Final code to list data -
	var list = module.exports.list = function(req, res) {
 		 db.query('SELECT * from books ORDER BY id', function(err, books) {
    if (err) throw err;
    res.render('books/list', {books: books});
  });
};

How is this called?
The server.js file maps the URLs to appropriate functions. For listing the map in server.js is as follows -
app.get('/books', books.list);
So whenever we write <domain_name>:8080/books, the server calls the books.list function which in turn fetches the list of books from the database, sends it for templating and returns the rendered HTML back as a response.







Adding Information
Retrieve data from the form
To retrieve GET data - request.params.<param_name>
To retrieve POST data - request.body.<param_name>

IMPORTANT - Validate the data on server side
In order to prevent inserting malformed data, always check the data before inserting it. This can be done manually or by the tools provided. The mysql module in node has a mysql.escape() function to do that. To understand more about the escape function, you can read this link.

Write a query to insert the data into the database
Once the data has been validated, you can insert it into the database. A simple INSERT query can do this. You can structure the insert query in the following way -

‘INSERT INTO books (title, author, price) values (‘ + title_var + ‘, ‘ + author_var + ‘, ‘ + price_var + ‘)’;

Send some sort of a “Success” message back
You can send a success message, or redirect back to the index page with the changes reflected.

Final code to insert data -
module.exports.insert = function(req, res){
  	var title = db.escape(req.body.title);
var author = db.escape(req.body.author);
var price = db.escape(req.body.price);

 var queryString = 'INSERT INTO books (title, author, price) VALUES (' + title + ', ' + author + ', ' + price + ')';
db.query(queryString, function(err){
               if (err) throw err;
res.redirect('/books');
});
};

 Deleting Information
Confirm before deletion (Optional but it just is always better)
You can either do this in Javascript on client side, or redirect onto another page which has a confirm button. Right now, since we are mainly focused on making it server side based, you can probably redirect to another page which confirms the deletion



IMPORTANT - Validate data on server side
By validation here I mean to ensure that the id which was passed for deletion is actually a valid id and only then begin to delete it.

Write an appropriate query to delete the entry from the database
Once you have received an id to be deleted, you can then run a DELETE query with a condition. (Optional: You can also instead update the record and mention something like ‘marked for deletion’ and actually delete the entry a couple of days later. Why do we do this? In case we want to retrieve old data that was deleted. Not required for your assignment at all, just mentioning this since it is also something companies tend to do)

Send some sort of a “Success” message back
You can send a success message, or redirect back to the index page with the changes reflected.

Final code to delete data -
module.exports.delete = function(req, res) {
  var id = req.params.book_id;
  db.query('DELETE from books where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/books');
  });
};


Updating Information (Similar to add)
Retrieve data from the form
To retrieve GET data - request.params.<param_name>
To retrieve POST data - request.body.<param_name>

IMPORTANT - Validate data on server side
As usual, In order to prevent inserting malformed data, always check the data before inserting it.

Write a query to update the entry in the database
Once you have received an entry to be updated, you can then run an UPDATE query with a condition.

Final code to update data -
module.exports.update = function(req, res){
  var id = req.params.book_id;
  var title = db.escape(req.body.title);
  var author = db.escape(req.body.author);
  var price = db.escape(req.body.price);

  var queryString = 'UPDATE books SET title = ' + title + ', author = ' + author + ', price = ' + price + ' WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/books');
  });
};
Send some sort of a “Success” message back
You can send a success message, or redirect back to the index page with the changes reflected.
