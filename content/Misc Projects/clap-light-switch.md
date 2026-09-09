# Clap Light Switch

## About

This is a project I created to turn on and off my lights with a clap. I used this opportunity to learn about power saving on Arduino boards in order to extend the battery life of the switch.

![Clap switch](https://lh3.googleusercontent.com/sitesv/AG8ngQUvnKpHRgflae28CoxFw2IEERvZh9IRC7dhYInS2jLvfxffcSfqlOg3tPM6GibxOQ_vzIIsj_kUR-Wx6J6rPj7lw2HM401MmXyaxyXcU7fOEPbOd6wLqVrCmqdgTMyZClsMeA-VOzr4x-8hJE2LWh3G0itaDy7CiqUNK50gJk0Q7dk3aGh3Zsx6EEoGaluPdaqKRuHjjowNZ6Ky_eZOBYIz0UsYtIa85nvKixe03rw=w1280)

## Details

### Tools

- Wire strippers
- 3D printer
- Hot glue gun
- Double-sided mounting tape

### Materials

- [KY-030 Microphone Sensor](https://www.amazon.com/) — Amazon
- [Arduino Nano](https://www.amazon.com/) — Amazon
- [N-Type MOSFET (2N7000)](https://www.amazon.com/BOJACK-2N7000-MOSFET-Transistor-N-Channel/dp/B083WMZ5KT) — Amazon
- [9V Battery Connector](https://www.amazon.com/RUZYY-Battery-Connector-Tinned-Leads/dp/B082DZ6YQJ) — Amazon
- Generic duopoint wires
- Generic rocker switch
- Generic 3D printing filament
- Generic 9V battery

### Designing

I designed all the 3D models in Onshape and printed them on my Ender 3 V2 Neo. I designed the circuit in Fritzing.

### Building It

Assembled the case, wired the sensor, MOSFET, and servo per the Fritzing schematic, then mounted everything with hot glue and double-sided tape.

## Engineering Details // Optimization

After building the case, I tested the clapper — it worked, but didn't last long on a single 9V battery, so I took it apart again to figure out how to make it more energy-efficient.

A stock Arduino with no connections draws about 20mA. The SG90 servo draws only 6mA idle, up to 250mA when moving. The KY-030 sensor draws about 20mA. On a normal 9V 550mAh battery, the circuit would only last about 12.5 hours on idle.

Adding a MOSFET between the servo and the 9V battery removes the servo's idle draw (saving ~6mA), pushing battery life to around 14 hours. Removing the LEDs on the Arduino and KY-030 sensor (3 LEDs × 8mA each) drops total draw from 40mA to 15mA — up to 36.5 hours — and also stops the red glow inside the case. Using the **Low-Power** library by RocketScream saves another ~5mA on the Arduino, pushing the battery life to 55 hours. Swapping the microcontroller for an **ATtiny85** (not something I did, but worth noting) could bring consumption down to 5mA and battery life up to 110 hours. The most energy-efficient combination (low-power microcontroller, microphone, and servo) could draw as little as 3mA, for up to 183 hours. The easiest overall win is switching to a lithium 9V battery — up to 260 hours with an ATtiny85, or 130 hours with an Arduino.

Compared to the starting battery life of 12.5 hours, the most efficient configuration reaches up to 433 hours — a **3,500% increase**.

| Configuration | Current draw | Life on 550mAh 9V | Life on 1300mAh 9V |
|---|---|---|---|
| Standard | 46mA | 12.5 hrs | 28 hrs |
| No servo idle draw | 40mA | 14 hrs | 32.5 hrs |
| No LEDs | 15mA | 36.5 hrs | 86.5 hrs |
| Low-Power library | 10mA | 55 hrs | 130 hrs |
| ATtiny85 | 5mA | 110 hrs | 260 hrs |
| Stripped down (all of the above) | 5mA | 183 hrs | 433 hrs |