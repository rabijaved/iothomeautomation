#include <ESP8266WiFi.h> 
#include <ESP8266HTTPClient.h>
#include <Base64.h>

const char* ssid = "*****"; //your WiFi Name
const char* password = "*****";  //Your Wifi Password

int plantVal  = 0;        //Variable to store analog input values
const int analog_ip = A0; //Naming analog input pin
const char* host="http://192.168.1.102:5000/";
const int retryCount = 5;
const int pumpPin = 5; // GPIO5---D1 of NodeMCU
String output5State = "off";
unsigned long curr_timestamp = 0;

// Variable to store the HTTP request
String header;

WiFiServer server(80);
 
void setup() {

  Serial.begin(115200);

  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, LOW); // set pin to off
  
  // Connect to WiFi network
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started");
 
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");

  postIdentity();
  curr_timestamp = millis();
 
}


int checkTimestamp(){

  if ((millis() - curr_timestamp) >= 150000) {
    curr_timestamp = millis();  
    return 1;
  }

  return 0;
}


String readSensors(){
  
  plantVal = analogRead (analog_ip); // Analog Values 0 to 1024
  if(!(plantVal >= 0 && plantVal <= 1024)) return "invalid";
  Serial.println(plantVal);
  return String(plantVal);

}

/*
void getCommand(int interval){

    WiFiClient client = server.available();

    if (client) {
      if(client.available()){
          // Read the first line of the request
          String request = client.readStringUntil('\r');
          Serial.println(request);
          client.flush();

          int value = LOW;
          if (request.indexOf("/PUMP=ON") != -1)  {
            digitalWrite(pumpPin, HIGH);
            value = HIGH;
          }
          if (request.indexOf("/PUMP=OFF") != -1)  {
            digitalWrite(pumpPin, LOW);
            value = LOW;
          }

          if(value == HIGH) {
            postResponse("On");
          } else {
            postResponse("Off");
          }

      }
  }
}
*/

void postData(){

  if (checkTimestamp() == 0) return;

  String sensorReading = readSensors();

  if(sensorReading != "invalid"){
    String pData = "express_backend?jname=mcuplant&jstate="+sensorReading+"&jaction=set";

    HTTPClient http;
    http.begin(host+pData);
    http.addHeader("Authorization", String(base64::encode("0e3cbac3-d0dc-47ab-96aa-2785b0557346")));
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    http.GET();
    http.writeToStream(&Serial);
    http.end();
  }
  
}

void postIdentity(){

    String pData = "express_backend?jname=mcuplant&jstate="+WiFi.localIP().toString()+"&jaction=setIP";

    HTTPClient http;
    http.begin(host+pData);
    http.addHeader("Authorization", String(base64::encode("0e3cbac3-d0dc-47ab-96aa-2785b0557346")));
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    http.GET();
    http.writeToStream(&Serial);
    http.end();

}

void loop(){
  WiFiClient client = server.available();   // Listen for incoming clients
  postData();
  if (client) {                             // If a new client connects,
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // turns the GPIOs on and off
            if (header.indexOf("GET /5/on") >= 0) {
              Serial.println("GPIO 5 on");
              output5State = "on";
              digitalWrite(pumpPin, HIGH);
            } else if (header.indexOf("GET /5/off") >= 0) {
              Serial.println("GPIO 5 off");
              output5State = "off";
              digitalWrite(pumpPin, LOW);
            } 
            
            // Display the HTML web page
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            // CSS to style the on/off buttons 
            // Feel free to change the background-color and font-size attributes to fit your preferences
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
            client.println(".button2 {background-color: #77878A;}</style></head>");
            
            // Web Page Heading
            client.println("<body><h1>ESP8266 Web Server</h1>");
            
            // Display current state, and ON/OFF buttons for GPIO 5  
            client.println("<p>GPIO 5 - State " + output5State + "</p>");
            // If the output5State is off, it displays the ON button       
            if (output5State=="off") {
              client.println("<p><a href=\"/5/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/5/off\"><button class=\"button button2\">OFF</button></a></p>");
            } 
               
            client.println("</body></html>");
            
            // The HTTP response ends with another blank line
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  delay(1);
}
