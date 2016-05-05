import java.util.*;
import java.io.*;

  
class cgiHelper
{

  public static Hashtable ReadParse(InputStream inStream)
  {
      Hashtable form_data = new Hashtable();

      String inBuffer = "";
      DataInput d = new DataInputStream(inStream);
      String line;
      try
      {
         while((line = d.readLine()) != null)
         {
            inBuffer = inBuffer + line;
         }
      }
      catch (IOException ignored) { }


      StringTokenizer pairs = new StringTokenizer(inBuffer,"&");

      while (pairs.hasMoreTokens())
      {
          String pair = urlParse(pairs.nextToken());

          StringTokenizer tokens = new StringTokenizer(pair,"=");
          String keyVar = new String();
          String valueVar = new String();
          if (tokens.hasMoreTokens()) {
            keyVar = tokens.nextToken();
         }

          if (tokens.hasMoreTokens()) {
            valueVar = tokens.nextToken();
          }

          form_data.put(keyVar,valueVar);
      }

      return form_data;

  }


  public static String urlParse(String in)
  {
      StringBuffer out = new StringBuffer(in.length());
      int i = 0;
      int j = 0;

      while (i < in.length())
      {
         char ch = in.charAt(i);
         i++;
         if (ch == '+') ch = ' ';
         else if (ch == '%')
         {
            ch = (char)Integer.parseInt(in.substring(i,i+2), 16);
            i+=2;
         }
         out.append(ch);
         j++;
      }
      return new String(out);
  }


  public static String header()
  {
      return "Content-type: text/html\n\n";
  }

   public static String htmlTop(String title) {
      return "<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"UTF-8\">\n\t<title>" + title + "</title>\n</head>\n";
   }

  public static String htmlBottom()
  {
      return "</body>\n</html>\n";
  }

}
