# Dweet.io

> **Disclaimer:** Sadly, Dweet.io has closed down as of April 2025. I'm leaving this page here as it's useful for making HTTP POST and GET requests without other libraries, and in case Dweet.io ever reopens. Any alternatives I start using will hopefully replace this page, but I haven't found one yet.

## How to Use Dweet.io

Dweet.io was simple publishing and subscribing for machines, sensors, devices, robots, and gadgets ("things"). Published messages are called "dweets." Think of it as Twitter for things — free, no account or key required. It only held the last 5 dweets for 24 hours; keeping more data required a paid "lock" ($1.99/mo). Dweet.io only used POST and GET requests, with responses in JSON.

To monitor a control panel, visit `https://dweet.io/follow/your-controlPanel-name` in a new tab.

Before using dweet.io with an Arduino or ESP board, make sure the board is connected to the internet using its WiFi library. You'll also need the [ArduinoHttpClient](https://github.com/arduino-libraries/ArduinoHttpClient) library installed via the Arduino IDE's library manager. Then add this at the top of your sketch:

```cpp
#include <ArduinoHttpClient.h>

const char serverAddress[] = "dweet.io"; // Server address
int port = 80;
String controlPanelName = "your-controlPanel-name";

WiFiClient client;
HttpClient httpClient = HttpClient(client, serverAddress, port);
```

### Sending a POST Request

A POST request with dweet.io is written as `/dweet/for/your-controlPanel-name`. Build the path and content type as strings, build a string of the data to send, then pass path, content type, and data into the HTTP client's POST function, in that order, from inside the sketch's loop.

```cpp
// Path for the POST message
String path = "/dweet/for/" + controlPanelName;
String contentType = "application/json";

// Body of the POST message
int sensorValueOne = analogRead(A0); // First sensor
String postData = "{\"sensorValueOne\":\"";
postData += sensorValueOne;
postData += ","; // End of key/value pair

int sensorValueTwo = analogRead(A1); // Second sensor
postData += "\"sensorValueTwo\":\"";
postData += sensorValueTwo;
postData += "\"}"; // End of POST data

// The POST request
httpClient.post(path, contentType, postData);
```

### Sending a GET Request

Unlike POST, there are three different GET request paths:

- `/get/latest/dweet/for/your-controlPanel-name` — gets the latest dweet for your thing/control panel
- `/get/dweets/for/your-controlPanel-name` — gets the last 5 cached dweets
- `/listen/for/dweets/from/your-controlPanel-name` — listens for new dweets

```cpp
// Path for the GET request
String path = "/get/latest/dweet/for/" + dweetName;

// The GET request
httpClient.get(path);

// The response body
String response = httpClient.responseBody();
```

### Understanding the Response

Visiting `/get/latest/dweet/for/your-controlPanel-name` in a browser returns JSON like:

```json
{
  "this": "succeeded",
  "by": "getting",
  "the": "dweets",
  "with": [
    {
      "thing": "Sensors",
      "created": "2018-03-04T04:22:06.541Z",
      "content": {
        "sensorValueOne": 134,
        "sensorValueTwo": 458
      }
    }
  ]
}
```

The values needed are nested inside `content`. To read them on the board, you have to parse the JSON manually:

```cpp
// Finds the start of the content object
int labelStart = response.indexOf("content\":");
int contentStart = response.indexOf("{", labelStart);
int contentEnd = response.indexOf("}", labelStart);
String content = response.substring(contentStart + 1, contentEnd);
```

Then pull out each key/value pair:

```cpp
// First sensor value
int valueStart = content.indexOf(":");
String valueString = content.substring(valueStart + 1);
int sensorValueOne = valueString.toInt();

// Second sensor value (advance past the first pair first)
int valueStart2 = content.indexOf(":", valueStart + 1);
String valueString2 = content.substring(valueStart2 + 1);
int sensorValueTwo = valueString2.toInt();
```

## Code Example

A full example controlling two lights on an Arduino MKR through dweet.io:

```cpp
#include <ArduinoHttpClient.h>
#include <WiFi101.h>
#include "arduino_secrets.h"

/////// Lights ///////
int lightOne = 5;
int lightTwo = 6;

/////// WiFi Settings ///////
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

/////// HTTP Client Settings ///////
const char serverAddress[] = "dweet.io"; // server address
int port = 80;
String controlPanelName = "lightController"; // use your own control panel name here
WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
  }

  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {
  // Assemble the path for the GET message
  String path = "/get/latest/dweet/for/" + controlPanelName;

  Serial.println("making GET request");
  client.get(path);

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  // Parse the response
  int labelStart = response.indexOf("content\":");
  int contentStart = response.indexOf("{", labelStart);
  int contentEnd = response.indexOf("}", labelStart);
  String content = response.substring(contentStart + 1, contentEnd);
  Serial.println(content);

  // First light value
  int valueStart = content.indexOf(":");
  String valueString = content.substring(valueStart + 1);
  int lightOneValue = valueString.toInt();

  // Second light value
  int valueStart2 = content.indexOf(":", valueStart + 1);
  String valueString2 = content.substring(valueStart2 + 1);
  int lightTwoValue = valueString2.toInt();

  // Set the first light on or off
  digitalWrite(lightOne, lightOneValue == 1 ? HIGH : LOW);

  // Set the second light on or off
  digitalWrite(lightTwo, lightTwoValue == 1 ? HIGH : LOW);

  Serial.println("Wait 1 second\n");
  delay(1000);
}
```

## How to Use It on a Website

Notes on this coming soon.
