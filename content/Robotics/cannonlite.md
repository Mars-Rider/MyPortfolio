# CannonLite

A powerful wifi-enabled LED Controller designed to directly communicate with FRC and FTC Control hubs. It allows for complex driver signals and data with any FastLED compatable third party LED Strip

![CannonLite PCB and Case](src/assets/Assembly1.png){650px}

## Goals

My goals with this project is to have a rgb controller that can connect to a FRC or FTC control hub and it could change the lights by communicating with the robot and to also have it be standalone and controlled with a website for our T-Shirt Cannon.

## Schematic and PCB

- **Main Microcontroller** ESP8266

I designed this PCB in KICad. I got the unique shape by making the pcb outline in onshape iwth the screw hole and was able to import it into KICad as a DXF. Some photos will be added below.

## Case

I designed this case in Onshape after downloading a full 3D model of the PCB and importing it as a reference. It is configurable for different needs and mounting options.

[button: Check out the Onshape](https://cad.onshape.com/documents/47917fe705281aa4d7e3842f/w/5babca8e5f21d2a69545357a/e/fa76c2f14edc94466f4c4451?renderMode=0&uiState=6aa24401b3b9f08b1d5fd035)

## Control

I tried to control this controller with the FRC and FTC control hubs so it could change the lights by communicating with the robot. I focused on FTC but realized that the I2C speed of the control hubs don't work on the ESP8266s that are on this pcb. I started to make a softwarwI2C using the digital pins or using the servo pwm as a input. I got far enough to load the setup package onto the esp8266 but then realized the PWM range wasnt wide enough to send a large package. Instead, we transitioned this pcb to become the LED controller for our T-Shirt cannon.

I made a websocket and loaded a static website on it that you can configure the LED Controller with, including what pin to use, what colors/patters, speed and brightnes.

> **AI Disclaimer** This website that was put on the CannonLite was generated with AI but the actual websocket communication was my work.