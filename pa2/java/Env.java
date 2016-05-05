import java.util.Map;
import java.util.TreeMap;

public class Env {
    public static void printTable(Map<String, String> vars) {
        System.out.println("<table><tr><th>Name</th><th>Value</th></tr>");
	for (String varName : vars.keySet()) {
          System.out.println("<tr>");
          System.out.println("<td>" + varName + "</td><td>" + vars.get(varName) + "</td>");
          System.out.println("</tr>");
          //System.out.println("<h3>" + varName + "=" + vars.get(varName) + "</h3>\n"); 
       }
       System.out.println("</table>");
    }

    public static void main (String[] args) {
	System.out.println(cgiHelper.header());
	System.out.println(cgiHelper.htmlTop("Environment CGI"));
        Map<String, String> unsorted = System.getenv();
	Map<String, String> env = new TreeMap<String, String>(unsorted);
	Map<String, String> browser = new TreeMap<String, String>();
	Map<String, String> server = new TreeMap<String, String>();
	for(String envName : env.keySet()) {
	   if(envName.matches("(HTTP_|REQUEST_|QUERY_).*")) {
	      if(!(env.get(envName).equals(""))) {
	         browser.put(envName, env.get(envName));
	      }
	   }
	   else {
              if(!(env.get(envName).equals(""))) {
	         server.put(envName, env.get(envName));
              }
	   }
	}

	System.out.println("<h1> Server </h1>");
        printTable(server);
        System.out.println("<h1> Client </h1>");
        printTable(browser);
	
        // html bottom
        System.out.println(cgiHelper.htmlBottom());
    }
 
}
