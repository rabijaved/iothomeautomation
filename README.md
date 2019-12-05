[IOT Home Automation]
```
*Integration for :
 DHT11/DHT22 Temperature Humidity sensor
 Motion sensor
 Soil moisture sensor
 Water pump
 Switch relays
 LED/Touch screen management
 Google home integration through IFTTT

*The project uses an Express backend and a ReactJs WebApp
```
## File Structure

Within the download you'll find the following directories and files:

```
.
├── README.md
├── documentation
├── package.json
├── server.js
└── scripts
    └── c
        ├── dht11.c
    └── js
        ├── backlightControl.js
        ├── dht11Control.js
        ├── switchControl.js
└── client
        ├── README.md
├── node_modules
├── resources
└── bootScript.sh

```

## Hardware Setup
![alt text](./resources/HardwareArch.png)

## Preview
![alt text](./resources/Preview.gif)
   
   
# Raspberry PI settings  

## Install NPM  
sudo apt-get install nodejs npm  

## Install utility tools  
npm install pm2 -g  
sudo apt-get install xscreensaver  
sudo apt-get install nginx  

## Configure Static IP  

sudo nano /etc/dhcpcd.conf  

### Paste the following :

```shell
interface wlan0   
static ip_address=192.168.1.101/24   
static routers=192.168.1.1   
static domain_name_servers=192.168.1.1   
```
## SQLite3 Install  
sudo apt-get install sqlite3  
npm install sqlite3 --build-from-source  

### Create Database Tables   

```sql
sqlite3 SensorData.db   
CREATE TABLE AL_DHT11(AMBLIGHT,TEMP, HUMID,DATECREATED);   
CREATE TABLE MOTION_SENSOR (MT_VAL, DATECREATED);   
CREATE TABLE PL_NODE1 (SL_HUM,DATECREATED);   
```


## Configure NGINX

```shell
sudo rm /etc/nginx/sites-enabled/default   
sudo nano /etc/nginx/sites-available/node   
   
server {

    listen 80;
    server_name _;
    location / {
        proxy_pass         "http://127.0.0.1:3000";
        proxy_set_header    Host                $proxy_host;
        proxy_set_header    X-Forwarded-For     $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
    location /express_backend {
            proxy_pass "http://127.0.0.1:5000";
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $proxy_host;
            proxy_cache_bypass $http_upgrade;
    }
}   
   
sudo ln -s /etc/nginx/sites-available/node /etc/nginx/sites-enabled/node   
sudo service nginx restart   
```

## Point Autostart Script
```shell
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```
   
Add line to execute "bootScript.sh" from repository

## Configure PM2
browse to "iothomeautomation" folder   
```shell
sudo pm2 start server.js
```

browse to "iothomeautomation/client" folder   
```shell
pm2 start npm -- start
```

Configure autostart
```shell
pm2 save   
pm2 startup
```
