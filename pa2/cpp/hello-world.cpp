#include <iostream>
#include <cstdlib>
#include <math.h>
#include <ctime>


using namespace std;
int main()
{
   string colors [16] = {"aqua", "black text=white", "blue","fuchsia","gray","green","lime","maroon","navy","olive","purple","red","silver","teal","white","yellow"};

   srand((unsigned int) time (NULL));
   int randomint = rand()%15;
   string color = colors[randomint];

   time_t t = time(0);   // get time now
   struct tm * now = localtime( & t );
   char buffer[80];
   strftime(buffer, 80, "%m/%d/%Y %I:%M:%S",now);
   std::string str(buffer);

   cout << "Content-type: text/html" << endl << endl;
   cout << "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" << endl;
   cout << "<html>" << endl;
   cout << "<head> <title>We code in our underpants</title> </head>" << endl;
   cout << "<body bgcolor="+color+">" << endl;
   cout << " <h1>Hello World! from C++ @" << str << "</h1>" << endl;
   cout << "   </body>" << endl;
   cout << "</html>" << endl;

   return 0;
}