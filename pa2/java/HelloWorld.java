import java.util.*;
import java.text.SimpleDateFormat;

public class HelloWorld {

    public static void main(String[] args) {
    	// Header portion of the code
	System.out.println(cgiHelper.header());
	System.out.println(cgiHelper.htmlTop("Hello from CGI World"));

	// set the body background color
	Random rn = new Random();
	int colorNum = rn.nextInt(16);
        String [] colors = {"aqua","black","blue","fuchsia","gray","green","lime",
                         "maroon","navy","olive","purple","red","silver","teal",
                         "white","yellow"};
	String color = colors[colorNum];
        String text = "black";
        if(colorNum == 1) {
           text = "white";
	}
	System.out.println("<body style='background-color:" + color + ";'>\n");

	// set time and print Hello World message
	String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
    	System.out.println("<h1 style = 'color:" + text +";'>Hello World from Java @ " + timeStamp + "</h1>\n");
	// html bottom
	System.out.println(cgiHelper.htmlBottom());         
    }

}
