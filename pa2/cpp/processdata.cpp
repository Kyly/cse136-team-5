#include <iostream>
#include <stdlib.h>     /* getenv atoi*/
#include <stdio.h>
#include <string.h>

using namespace std;

char InputData[4096];

void getAllParams() {
    if( getenv( "REQUEST_METHOD" ) == 0 ) {
        return;
    } else if (strcmp( getenv("REQUEST_METHOD"), "POST") == 0) {
        char *endptr;
        char *len1 = getenv("CONTENT_LENGTH");
        int contentlength = strtol(len1, &endptr, 10);
        fread(InputData , contentlength, 1, stdin);
    } else {
        strcpy(InputData, getenv("QUERY_STRING"));
    }
}

void getParam(const char *Name, char *Value) { 
    char *pos1 = strstr(InputData, Name);

    if (pos1) {
        pos1 += strlen(Name);

        if (*pos1 == '=') {
            pos1++;
            while (*pos1 && *pos1 != '&') {
	            *Value++ = *pos1++;
	            }
            *Value++ = '\0';
            return;
        }

    }

    strcpy(Value, "undefine");
    return;
} 


int main()
{


char* query = getenv("QUERY_STRING");
char Name[100] = "";
char Password[100] = "";
char mnumber[100] = "";
int magicnumber = 0;

   cout << "Content-type: text/html" << endl << endl;
   cout << "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" << endl;
   cout << "<html>" << endl;
   cout << "<head> <title>We code in our underpants</title> </head>" << endl;
   cout << "<body>" << endl;

//cout << "Form Result" << endl;
//cout << query << endl;

getAllParams(); 
//cout<< InputData << endl;
getParam("username", Name);
//cout<< Name <<endl;
getParam("userpassword", Password);
//cout<<Password<<endl;
getParam("magicnumber", mnumber);
//cout<<mnumber<<endl;
magicnumber = atoi(mnumber);
//cout<<magicnumber<<endl;
while(magicnumber > 0){
	cout << "<h1>Hello " << Name << " with a password of " << Password << " !</h1>" << endl;
	magicnumber--;
}
   cout << "   </body>" << endl;
   cout << "</html>" << endl;



  return 0;
}