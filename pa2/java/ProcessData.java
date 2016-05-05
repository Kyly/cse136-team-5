import java.util.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
 
public class ProcessData {

   public static void main(String[] args) {
      System.out.println(cgiHelper.header());
      System.out.println(cgiHelper.htmlTop("We code in our underpants"));
      Map<String, String> env = System.getenv();
      String query = "";
      for(String envName : env.keySet()) {
         if(envName.equals("QUERY_STRING")) {
            query = env.get(envName);
	}
      }
      Hashtable formData;
      if(query.equals("")) {
         formData = cgiHelper.ReadParse(System.in);
      }
	
      else {
         InputStream stream = new ByteArrayInputStream(query.getBytes(StandardCharsets.UTF_8)); 
         formData = cgiHelper.ReadParse(stream);
      }     

      String name = (String)formData.get("username");
      String password = (String)formData.get("userpassword");
      int magicnum = Integer.parseInt((String)formData.get("magicnumber"));
      for(int i = 0; i < magicnum; i++) {
         System.out.println("<h1>Hello " + name + " with a password of " + password + "!</h1>");
      }       
      System.out.println(cgiHelper.htmlBottom());
   }
}
