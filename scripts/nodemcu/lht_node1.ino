#include <ESP8266WiFi.h> 
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <Base64.h>

//Constants
#define DHTPIN 4     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE); //// Initialize DHT sensor for normal 16mhz Arduino



const char* ssid = "*****"; //your WiFi Name
const char* password = "*****";  //Your Wifi Password

int lightVal  = 0;        //Variable to store analog input values
const int analog_ip = A0; //Naming analog input pin
float hum;  //Stores humidity value
float temp; //Stores temperature value
const char* host="http://192.168.1.101:5000/";
const int retryCount = 5;
float prevTemp = 0;
float prevHum = 0;

WiFiServer server(80);
 
void setup() {
  Serial.begin(115200);

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

  //Get initial reading
  dht.begin();
  
  prevHum = dht.readHumidity();
  prevTemp= dht.readTemperature();  

  if (isnan(hum) || isnan(temp)) {
    prevHum = 0;
    prevTemp = 0;
  }
  Serial.println("Initial DHT reading: " +String(prevTemp) + "|" + String(prevHum));
}

String readSensors(){


  //if temperature or hum difference is too big then get another reading
  hum = dht.readHumidity();
  temp= dht.readTemperature();  
   int retryCount = 0;
   while (isnan(hum) || isnan(temp)) {
      delay(2000);
      if (retryCount >= 3) {
        Serial.println("Failed to read from DHT sensor! Exiting function...");
        return "invalid";
      }
      Serial.println("Failed to read from DHT sensor! Retrying...");
      hum = dht.readHumidity();
      temp= dht.readTemperature();  
      retryCount++;
      
    }
    
  int diffRetry = 0;
  while((abs(temp-prevTemp) >= 0.5) || (abs(hum-prevHum) >= 5)){
    delay(2000);

    if (diffRetry >= 2) {
      Serial.println("Failed to get DHT reading in range! Proceeding...");
      break;
    }

    Serial.println("Failed to get DHT reading in range! Retrying...");
    hum = dht.readHumidity();
    temp= dht.readTemperature();  

   int retryCount = 0;
   while (isnan(hum) || isnan(temp)) {
      delay(2000);
      if (retryCount >= 3) {
        Serial.println("Failed to read from DHT sensor! Exiting function...");
        return "invalid";
      }
      Serial.println("Failed to read from DHT sensor! Retrying...");
      hum = dht.readHumidity();
      temp= dht.readTemperature();  
      retryCount++;
      
    }

    diffRetry++;
  }


  lightVal = analogRead (analog_ip); // Analog Values 0 to 1024
  prevTemp = temp;
  prevHum = hum;

  if(!(lightVal >= 0 && lightVal <=1024)) lightVal = 0;
  
  return String(lightVal) + "|" + String(temp) + "|" + String(hum);
}


void postData(){

  String sensorReading = readSensors();
  Serial.println(sensorReading);
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