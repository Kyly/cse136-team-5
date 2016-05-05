all: hello-world.cgi env.cgi processdata.cgi

hello-world.cgi:
	g++ -o hello-world.cgi hello-world.cpp
env.cgi: 
	g++ -o env.cgi env.cpp
processdata.cgi: 
	g++ -o processdata.cgi processdata.cpp

clean:
	rm *.cgi
