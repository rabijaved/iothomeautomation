#include <ESP8266WiFi.h> 
#include <ESP8266HTTPClient.h>
#include <Base64.h>

const char* ssid = "*****"; //your WiFi Name
const char* password = "*****";  //Your Wifi Password

int plantVal  = 0;        //Variable to store analog input values
const int analog_ip = A0; //Naming analog input pin
const char* host="http://192.168.1.108:5000/";
const int retryCount = 5;

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

  plantVal = analogRead (analog_ip); // Analog Values 0 to 1023
  
  if(plantVal >= 0 && plantVal <= 1023) return String(plantVal);
  else return "invalid";

}


void postData(){

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

void loop() {

  postData();
  delay(150000);

}