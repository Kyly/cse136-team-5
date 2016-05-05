# PA1
CGI scripts

Everyone is expected to run these script locally before they commit. Follow the
directions below to configure your system to run your scripts.  

## Apache install and configuration
- Install Apache web server locally  

    ```
    $ sudo apt-get install apache2
    ```  
      
- Edit `apache2.conf` to read `.htaccess` file.  
    * `$ vim /etc/apache2/apache2.conf`
    * Find the folling in the configuration file.

    ```
    <Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride NONE
        Require all granted
    </Directory>
    ```  

    * Change `AllowOverride NONE` to `AllowOverride ALL`
    * Save and exit the conf file.  

- Turn on cgi module
    ```
    $ sudo a2enmod cgi
    $ sudo service apache2 restart
    ```  

- Now clone repository to `/var/www/html/`.  
    ```
    $ cd  /var/www/html
    $ git clone https://github.com/Kyly/cse-136-pa1.git pa1
    ```  

- Almost there. Before you can run any of your scripts it must be executable
and be readable by the apache web server. For example to run `pa1/perl/hello-world.cgi`
you to run the following.  
    ```
    $ chmod 775 hello-world.cgi
    ```  

You can check if this is successful by going to `http://localhost/pa1/perl/hello-world.cgi`
In your browser. You should see `Hello, World.`.  

Congrats and happy coding.  
