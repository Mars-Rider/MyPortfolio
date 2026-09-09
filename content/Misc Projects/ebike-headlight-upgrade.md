# E-Bike Headlight Upgrade

E-Bike Lights Upgrade — Marco Fissore

## Concept

The concept of this project is to upgrade the light on my e-bike with a headlight I got from an old motorcycle, so I can see better at night, as the current light is barely bright.

> **Note:** Requires access to a 3D Printer or Water Jet/Plasma Cutter.

## Versions

### V1 — Original Idea

The idea is to connect the new headlight straight to the bike battery. The new headlight's operating power is 21–24W at 24V/12V. I thought I could use a DC-DC buck converter to bring the 40–50V from the bike battery down to 12V, increasing the current in the process to the 2A the new headlight needs — 2A after the converter and 500mA before it. To check whether there was enough current from the original circuit, I measured the current already going to the stock light, which turned out to be only 20 milliamps. Using **(Vs/Vo) × Is = Io**, the output current after the buck converter would only be around 1A at 12V — less than the 2A at 12V the headlight needs. That's why I didn't use this version.

### V2 — Upgraded Scope of Work

This version uses an external battery to power the headlight and some LED strips, while also charging my phone. The rest of this page covers how I got this version working.

## Bill of Materials — $104.75

- **[Motorcycle Headlight](https://www.amazon.com/Kucehiup-Motorcycle-Headlight-Brackets-Assembly/dp/B09XL96C7G) — $41** *(got mine for free)*. Has 3 LEDs: stationary (12V 0.5W / 24V 1.1W), high-beam (12V 21W / 24V 20W), low-beam (12V 25W / 24V 16W).
- **[LED Light (5V, 10W)](https://www.amazon.com/KXZM-Daylight-Brightness-6000-6500K-No-Waterproof/dp/B08M65DKZ7) — $11.** 10W/6.6ft (2M) USB LED strip — only using 25 of the 120 LEDs provided.
- **1/8th inch 5052 Aluminum — $0.** Scrap metal from school, used to attach the motorcycle light to the e-bike.
- **2 Mosfets — $1.** FDP5800 N-channel PowerTrench MOSFETs (OnSemi), 60V, 80A, 6mΩ.
- **[2 Resistors](https://www.amazon.com/dp/B08QR72BFW) — $1.** One 10kΩ and one 2.2kΩ, both rated 2W max.
- **[82 Wh Battery](https://www.amazon.com/TalentCell-PB240A1-Rechargeable-22400mAh-82-88Wh/dp/B078T7M9HZ) — $60** *(the one I used)*. TalentCell 24V lithium-ion, 22400mAh, with DC 24V/12V and 5V USB output. Enough to power the lights continuously for 3–5 hours.
  - *Alternative:* [33.3 Wh Battery](https://www.amazon.com/TalentCell-Rechargeable-3000mAh-Lithium-External/dp/B01M7Z9Z1N) — $25, 12V/3000mAh with DC 12V/5V USB dual output, good for a little under 1 hour.
- **2-pin Connector — $9.** To connect to the battery's existing connector.
- **[2M iPhone Cable](https://www.walmart.com/ip/3-pack-2M-6FT-Lightning-Cable-For-iPhone-6s-Plus-6-5s-7-Charger-Data-Sync/421650126) — $2.75**
- **[1m USB 2.0 Male Plug, 2-pin bare wire (12V/3A)](https://www.amazon.com/dp/B0BTXCXZJV) — $5**
- **[1m DC power pigtail, 5.5×2.5mm (12V/15A)](https://www.amazon.com/dp/B09JKNRHBZ) — $5**
- **[MTS-102 SPDT mini toggle switch, ON/ON, 5A 120V](https://www.amazon.com/dp/B07QGDLJ15) — $1**
- **Generic PETG or ABS Filament — $20.** *(PLA isn't recommended — it melts in the sun on the bike.)*

## Electronics

Used Tinkercad and Fritzing for simulations and schematics.

### Electrical Design Explanation

At the start of the circuit is a plug going to the bike's battery and controller. That connection goes to the gate of a MOSFET to turn the headlight on or off. The external battery's ground connects to the source, and the headlight's ground connects to the drain. Since the MOSFET and external battery are rated for 5–24V, a voltage divider is needed at the MOSFET gate. The 10kΩ and 2.2kΩ resistors bring the battery's 50V down to about 9V. Since the gate's ground has to match the source's ground, the external battery's ground is wired to the bike battery's ground. From there, the headlight's positive lead connects straight to the external battery.

The circuit has two batteries with grounds tied together:

- The **main battery** is the 48V e-bike battery — 40V minimum when discharged, 52V when fully charged.
- I wanted to keep using the stock light switch, so the original 48V output that used to go to the stock light now controls a MOSFET instead. Since the MOSFET gate can't exceed 15–18V, a voltage divider reduces the voltage reaching the gate.
- The **second battery** is a portable battery zip-tied to the back of the bike. Its 12V/2A DC jack output (via a stripped male DC5525 connector) powers the new motorcycle headlight, and its 5V/2A output powers the LED strip and charges my phone through a USB splitter.
- A MOSFET controlled from the 48V circuit switches the motorcycle headlight on and off.

### Calculations

**Voltage divider sizing** — MOSFET gate needs 5–15V; main battery fluctuates 40–52V. With R1 = 10kΩ, R2 = 2.2kΩ:

- At V<sub>batt</sub> = 52V → V2 (across R2, powering the gate) = 9.5V
- At V<sub>batt</sub> = 40V → V2 = 7.235V

Both are within the MOSFET's safe V<sub>gs</sub> range.

Max resistor power (at V<sub>batt</sub> = 52V): I = V<sub>batt</sub>/(R1+R2) = 4.26mA → P1 = I²×R1 = 0.18W, P2 = I²×R2 = 0.04W. 2W resistors are plenty.

**LED strip:** 120 LEDs rated 5V/2A. Using 25 LEDs needs 5V/400mA. Since the supply is 5V/2A, a series resistor would drop the voltage — so resistors go in parallel with the LEDs instead. The parallel resistor needs to take 1.6A → 5V/1.6A = 3.125Ω, dissipating 8W. That means 5 parallel 2W resistors, each rated ~15.5Ω (R<sub>eq</sub> = R/5).

**High-beam current control (target 21W):** Battery output is 12V/2A. 21W/12V = 1.75A, so a resistor in parallel with the high beam needs to carry 0.25A → 12V/0.25A = 48Ω, dissipating 0.25²×48 = 3W. That means 2 parallel 2W resistors rated 100Ω each (R<sub>eq</sub> = R/2).
