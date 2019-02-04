#include <ESP8266WiFi.h> 
#include <ESP8266HTTPClient.h>
#include <dht.h>
#include <Base64.h>
dht DHT;
//Constants
#define DHT11_PIN 2     // Pin 2 D4

const char* ssid = "Poop:ps"; //your WiFi Name
const char* password = "28102018_Noor";  //Your Wifi Password

int lightVal  = 0;        //Variable to store analog input values
const int analog_ip = A0; //Naming analog input pin
float hum;  //Stores humidity value
float temp; //Stores temperature value
const char* host="http://192.168.1.108:5000/";

WiFiServer server(80);
 
void setup() {
  Serial.begin(115200);
  delay(10);
 
  // Connect to WiFi network
  Serial.println();
  Serial.println();
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
 
}

String readSensors(){

  lightVal = analogRead (analog_ip); // Analog Values 0 to 1023
  int chk = DHT.read11(DHT11_PIN);
  //if(chk==DHTLIB_OK)
  //Read data and store it to variables hum and temp
  hum = DHT.humidity;
  temp= DHT.temperature;    
  return String(lightVal) + "|" + String(temp) + "|" + String(hum);

}


void postData(){

  String sensorReading = readSensors();
  String pData = "express_backend?jname=mculht&jstate="+sensorReading+"&jaction=set";

  HTTPClient http;
  http.begin(host+pData);
  http.addHeader("Authorization", String(base64::encode("0e3cbac3-d0dc-47ab-96aa-2785b0557346")));
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  http.GET();
  http.writeToStream(&Serial);
  http.end();

}

void loop() {


postData();
delay(9500);

  
/*
  // Check if a client has connected
  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
 
            lightVal = analogRead (analog_ip); // Analog Values 0 to 1023
            int chk = DHT.read11(DHT11_PIN);
            //Read data and store it to variables hum and temp
            hum = DHT.humidity;
            temp= DHT.temperature;    
             // Return the response
            String response = String(lightVal) + "|" + String(temp) + "|" + String(hum);
            client.printf("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: %u\r\n\r\n%s",
                response.length(), response.c_str());          
            client.flush();
            }
          }    
      }

*/
}
