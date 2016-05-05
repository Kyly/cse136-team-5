#include <iostream>
#include <stdlib.h>     /* getenv */
#include <algorithm>
#include <string.h>

using namespace std;

int get_environ_length(char ** env){
	int i = 0;
	while(env[i] != NULL){i++;}
	return i;
}

bool compare(char* i, char * j){ return strcmp(i,j) < 0; }

int main ()
{

    extern char **environ;

    int count = 0;

    cout << "Content-type: text/html" << endl << endl;
    cout << "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" << endl;
    cout << "<html>" << endl;
    cout << "<head> <title>We code in our underpants</title> </head>" << endl;
    cout << "<body>" << endl;


   cout << "<h1> Server </h1>" << endl;
   cout << "<table>" << endl;
   cout << "<tr>" << endl;
   cout << "<th>NAME</th>" << endl;
   cout << "<th>VALUE</th>" << endl;
   cout << "</tr>" << endl;
    int envsize = get_environ_length(environ);

    char *browvars [envsize];
    char *servvars [envsize];
    int browcount = 0;
    int servcount = 0;


    while(environ[count] != NULL)
    {
    	if(strstr(environ[count],"HTTP_") != 0 || strstr(environ[count],"REQUEST_") != 0){
		browvars[browcount] = environ[count];
		browcount++;
	}
	else{
		servvars[servcount] = environ[count];
		servcount++;
	}
    	//cout << environ[count] << "<br>" << endl;
    	count++;
    }


    sort(browvars, browvars + browcount, compare);
    sort(servvars, servvars + servcount, compare);
    count = 0;

   for(count = 0; count < servcount; count++){
	const char * separator = strchr(servvars[count], '=');
	if(separator == NULL) continue;
	int index = separator - servvars[count];
	string pre(servvars[count], index);
	string post(servvars[count]+index+1);
        cout << "<tr><td>" << pre <<"</td><td>" << post << "</td></tr>" <<endl;
   }
 


   cout << "</table>" << endl;

   cout << "<h1>Client</h1>" << endl;
   cout << "<table>" << endl;
   cout << "<tr>" << endl;
   cout << "<th>NAME</th>" << endl;
   cout << "<th>VALUE</th>" << endl;
   cout << "</tr>" << endl;

   count = 0;
   for(count = 0; count < browcount; count++){
	const char * separator = strchr(browvars[count], '=');
	if(separator == NULL) continue;
	int index = separator - browvars[count];
	string pre(browvars[count], index);
	string post(browvars[count]+index+1);
        cout << "<tr><td>" << pre <<"</td><td>" << post << "</td></tr>" <<endl;
    }

   cout << "</table>" << endl;
    cout << "</body>" << endl;
    cout << "</html>" << endl;

   return 0;
}