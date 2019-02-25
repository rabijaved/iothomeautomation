#include <ESP8266WiFi.h> 
#include <ESP8266HTTPClient.h>
#include <dht.h>
#include <Base64.h>
dht DHT;
//Constants
#define DHT11_PIN 2     // Pin 2 D4

const char* ssid = "*****"; //your WiFi Name
const char* password = "*****";  //Your Wifi Password

int lightVal  = 0;        //Variable to store analog input values
const int analog_ip = A0; //Naming analog input pin
float hum;  //Stores humidity value
float temp; //Stores temperature value
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
  DHT.read11(DHT11_PIN);
  delay(1);
  int chk = DHT.read11(DHT11_PIN);

  int readRetry = 0;
  while(chk!=DHTLIB_OK){
    delay(10);
    chk = DHT.read11(DHT11_PIN);
    readRetry++;
    if(readRetry >= retryCount) return "invalid";
  }

  hum = DHT.humidity;
  temp= DHT.temperature;  
  lightVal = analogRead (analog_ip); // Analog Values 0 to 1024

   if(!(lightVal >= 0 && lightVal <=1024)) return "invalid";

  return String(lightVal) + "|" + String(temp) + "|" + String(hum);
}


void postData(){

  String sensorReading = readSensors();

  if(sensorReading != "invalid"){
    String pData = "express_backend?jname=mculht&jstate="+sensorReading+"&jaction=set";

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