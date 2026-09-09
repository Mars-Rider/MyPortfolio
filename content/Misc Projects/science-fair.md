# Smart House Energy Consumption Project

## Overview & Personal Context

In 2023, I built a small-scale model smart house to analyze the energy consumption of IoT devices powered by solar panels. The project qualified for the State Science Fair after placing 2nd in the district competition.

The primary goal was to answer the question: **How do smart controls and solar panels affect the total energy consumption of a standard house?** Specifically, the project tested whether small solar panels could generate enough energy to completely offset the standby and operational power draw of smart controls.

---

## Authors & Collaborators

* **Marco Fissore**

* **Landon Radden**


---

## Hypothesis & Variables

* **Hypothesis:** Adding solar panels will offset the additional power consumption required by the smart controls of an automated home compared to a non-smart house.


* **Independent Variables:**
* Arduino WiFi Board


* Solar panel angle/season (Summer at $80^\circ$, Winter at $30^\circ$, and Middle of the Year average)


* Applied electrical loads (house appliances)




* **Dependent Variables:**
* Energy consumed by the Arduino WiFi Board


* Energy produced by solar panels in Summer and Winter


* Energy consumed by the active loads





---

## System Hardware & Components

| Category | Components Used |
| --- | --- |
| **Microcontrollers** | Arduino Uno, Arduino Uno WiFi Rev2

 |
| **Power & Solar** | 2× 5V Solar Panels, DC-DC Converter / Battery Charger, 2× 9V Rechargeable Lithium-ion Batteries

 |
| **Loads (4 Rooms)** | • Room 1: DC Motor & LED (Washing Machine)<br>

<br>• Room 2: 1× LED (House Light)<br>

<br>• Room 3: DC Motor (House Fan)<br>

<br>• Room 4: 2-Inch Touch-Screen Mini LCD Screen (TV showing photos via Micro SD Card)

 |
| **Circuitry Components** | NPN Transistors, MOSFETs, Diodes, Resistors ($1\,\Omega$ shunt resistors for current measurement), Capacitors, Switches, Breadboards, Wires

 |
| **Measurement & Tools** | Voltmeter, Ammeter, WiFi Pod, Soldering Iron, Cardboard structure, Hot Glue

 |

---

## IoT Control Architecture & Remote Automation

1. **iOS Shortcuts:** Custom voice and button commands were programmed in the iPhone Shortcuts app.


2. **Cloud Server:** Shortcuts sent POST requests containing JSON commands to an online cloud API (`dweet.io`).


3. **Arduino WiFi:** The Arduino Uno WiFi Rev2 routinely polled `dweet.io` over Wi-Fi to fetch control commands.


4. **Appliance Control:** Upon reading commands (e.g., turning on/off the TV, light, washer, or fan), the Arduino toggled the corresponding MOSFETs/transistors to control each load independently from anywhere in the world.



---

## Methodology & Measurement Protocol

1. **Power Calculation:** Electrical power ($P$) was calculated using $P = V \times I$. Electrical current ($I$) was derived by measuring voltage drops across $1\,\Omega$ known resistors placed in series using $I = \frac{V}{R}$.


2. **Measurement Points:**
* Solar generation: Solar panel output voltage and current entering the batteries across different times of the day.


* Smart Control consumption: Voltage and current between the battery and the Arduino boards when loads were idle/off.


* Load consumption: Current drawn by each individual load when active.




3. **Simulated Daily Usage Profile:**
* **TV:** 4 hours/day


* **Fan:** 9 hours/day


* **Light:** 9 hours/day


* **Washing Machine:** 2 hours/day





---

## Data Summary

### 24-Hour Voltage, Current, and Power Log

| Hour | $V_{\text{Smart}}$ (V) | $I_{\text{Smart}}$ (mA) | $P_{\text{Smart}}$ (W) | $V_{\text{House}}$ (V) | $I_{\text{House}}$ (mA) | $P_{\text{House}}$ (W) | $P_{\text{Total}}$ (W) | $V_{\text{Solar}}$ (V) | $I_{\text{Summer}}$ (mA) | $I_{\text{Winter}}$ (mA) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **1–5** | 7.98 | 74 | 0.591 | 4.97 | 0.0 | 0.000 | 0.591 | 7.99 | 0 | 0 |
| **6–8** | 7.98 | 74 | 0.591 | 4.97 | 7.4 | 0.037 | 0.627 | 7.99 | 0–30 | 0–3 |
| **9–10** | 7.98 | 74 | 0.591 | 4.97 | 102.0 | 0.507 | 1.097 | 8.02–8.03 | 195–290 | 20–60 |
| **11** | 7.98 | 74 | 0.591 | 4.97 | 0.0 | 0.000 | 0.591 | 8.05 | 340 | 120 |
| **12–14** | 7.98 | 74 | 0.591 | 4.97 | 354.0 | 1.759 | 2.350 | 8.06 | 300–385 | 100–175 |
| **15–18** | 7.98 | 74 | 0.591 | 4.97 | 516.4 | 2.567 | 3.157 | 8.02–8.06 | 10–200 | 0–70 |
| **19–20** | 7.98 | 74 | 0.591 | 4.97 | 361.4 | 1.796 | 2.387 | 7.99 | 0 | 0 |
| **21–24** | 7.98 | 74 | 0.591 | 4.97 | 0.0 | 0.000 | 0.591 | 7.99 | 0 | 0 |

---

### Daily Energy Totals (Watt-hours)

* **Solar Generation (Summer):** $18.23\text{ Wh}$

* **Solar Generation (Winter):** $6.01\text{ Wh}$

* **Solar Generation (Yearly Daily Average):** $13.13\text{ Wh}$

* **Smart Controls Standby/Operating Consumption:** $14.17\text{ Wh}$

* **Loads Alone (Standard House Appliances):** $20.26\text{ Wh}$

* **Total House + Smart Controls Consumption:** $34.43\text{ Wh}$


---

## Key Findings & Conclusion

1. **Hypothesis Disproven:** The yearly average energy produced by the solar panels ($13.13\text{ Wh}$) was less than the energy required continuously to run the smart controls ($14.17\text{ Wh}$).


2. **Net Energy Impact:** Because $13.13\text{ Wh} < 14.17\text{ Wh}$, adding smart controls and small solar panels to a conventional home actually increases overall net energy consumption rather than offsetting it.


3. **Future Improvements:**
* **Scale Ratio Correction:** Smart control circuitry draws roughly the same base power regardless of house scale. Scaling down the smart controls' power proportional to the model size would yield more realistic full-scale house data.


* **Standby Optimization:** Implement deep-sleep modes on the microcontroller to cut baseline idle power draw.


* **Solar Panel Positioning:** Adjust roof pitch to optimize sun exposure angles throughout the full day.
[button: Open the Science Project (Slides)](https://docs.google.com/presentation/d/1WD06AGY3mx9Rj4-RZNhtmyKflhh_ngU_b9YNh5YC22Q/present)
