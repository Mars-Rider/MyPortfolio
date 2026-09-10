# SVdP Charging Desk

[button: Bike Maintenance Guide — Book Order (Slides)](https://docs.google.com/presentation/d/1gKWiWyxWSgN99HcQdM1knnjP64UKGpxeJHGqrXbO2e8/present)

![Bike Desk](https://lh3.googleusercontent.com/sitesv/AG8ngQWLDmd0ZhKjI1Vbm7tnH9yUrPhwiajfjQfJC2OBCFglpj2-xkEwQHyr7-SFmsg7hssBvLuO9HhgRsvYHpk2QjRqquKID_gHhiXU5oDpPqtIzWGSq1g4fPGkPTOqu7G-eOCqJFCMCsBfdNiDKtuyVccoskwczwHl1yfZ7ARWP8n-uEnxfg3AwoeyQk93jplxi4kv0GljndAOKn9Z7GmlUPzQxKgWX09o3X8SrRQBSyA){400px}

This project was also written about in an article on St Vincent de Paul's website. [button: Check it out here](https://www.stvincentdepaul.net/news/cycling-sustainability)

**Table of Contents:** Concept · Notes · Versions (V1, V2) · Bill of Materials · Links · Electronics · Mechanical Design

## Concept

The idea is that while you sit at the desk at work, you can plug in your phone, iPad, or anything else that is controllable from a USB A port. The connected device is charged/powered when you pedal the bike.

> **Note:** Requires access to a 3D Printer and CNC Machine.

## Versions

### V1

I thought that we could use only linear voltage regulators, but I realized the phone would constantly charge at the same rate even if the person was pedaling slowly or quickly. I had also made a schematic that we could use for this version.

### V2

This design is the same as version 1, but instead of using 3 linear voltage regulators, I would only use one standard DC-DC converter (for the non-dimmable LEDs) and use 2 other buck converters for charging at most 2 phones.

## Bill of Materials — $315.10

- **Table Top (1 in. x 24 in. x 36 in.) — $77.** Allwood Island/Counter Table top panels made from grown furniture-grade Nordic wood fiber. Net size 0.95 in x 23-15/16 in x 36 in, solid lamella edge-glued, factory sanded to 100 grit, furniture-grade Nordic pine (not fast-grown plantation pine).
- **Legs (2 in. x 6 in. x 8 ft, 4 ft) — $17.60.** An 8-foot board ($6.25 each) and a 10-foot board ($5.07) from Home Depot.
- **Black Matte PLA Filament — $20.** OVERTURE Matte PLA, 1.75mm, 1kg spool, dimensional accuracy ±0.03mm.
- **Wood Screws (#8 x 1¼ in & #10 x 3½ in) — $18** ($9 each), general purpose screws.
- **3 Dynamos (~12V, ~6W) — $32** ($14 and $18). Only had to buy two — St. Vincent de Paul gave me one for free. Any 12V/6W dynamo works.
- **Scotch Blue Tape — $3.** Used to cover up the metal contacts of the dynamos and the black plastic parts of the bike when painting it.
- **4 in x 4 in Angle Framing Anchor — $12.** Adds extra support to the desk legs.
- **3 Bridge Rectifiers and 3 Capacitors (4700uF) — $18** ($6 each). Input voltage AC 0–35V, output DC 0–50V, 6A max working current, 4700uF/50V capacitors (18mm diameter), 63.4×24.1×37.3mm, 26g.
- **4700uF Capacitors — $9.** 35V rated, 18×30mm.
- **2× DC 8–85V to iPhone-compatible 5V USB converter — $32** ($16 each). XWST DC-DC converter, 8–85V in, 5V/3A/15W out, single USB, 33cm cable, over-current and over-temperature protection, waterproof/dustproof/shockproof potting.
- **1× 80V DC-DC Buck Converter — $5.50.** 10–80V in, 2.1A max output, 100kHz operating frequency, reverse-polarity and over-current protection, −40 to 85°C.
- **18 AWG Solid Core Wire — $23.** UL2464, 50ft, tinned copper, 300V max, 7.5A max, 80°C rated, PVC jacket.
- **6 Black Electronics Boxes — $7.** ABS plastic project boxes, external 2.40 × 1.41 × 0.98 in, internal 2.17 × 1.18 × 0.79 in, 2mm wall thickness, clasp design.
- **3–4 Black Spray Paint Cans — $18–24** ($6 each). Used 3, but 4 would give an extra layer.
- **USB Tester — $12.** Real-time voltage, current, capacity, power, impedance, and temperature readout. Measures 3.7–30V, 0–4A. Supports QC2.0/QC3.0 and iPhone fast-charge identification.
- **LED Light (5V, 10W) — $11.** 10W/6.6ft (2M) USB LED strip.

## Links

| Item | Source |
|---|---|
| Table Top | HomeDepot.com |
| Wood | HomeDepot.com |
| PLA filament | Amazon.com |
| Bridge Rectifiers | Amazon.com |
| 4700uF Capacitors | Amazon.com |
| iPhone DC-DC converter | Amazon.com |
| Standard DC-DC Converter | Amazon.com |
| 18 AWG Solid Core Wire | Amazon.com |
| Electronics Boxes | Amazon.com |
| Spray Paint | HomeDepot.com |
| USB Tester | Amazon.com |
| Screws (#8 x 1¼ in & #10 x 3½ in) | Hardware store |
| Frame Anchor | AceHardware.com |
| LED Lights | Amazon.com |

## Electronics

When researching the circuit I found a video that explained how to convert AC to DC for the electronics. I tried to build it in Tinkercad, but the capacitor made the web app freeze — so instead I used LTSpice for the simulations, with a 20Ω resistor to match the resistance of the lights used in in-person testing. These simulations helped figure out what circuit to use, though values like the capacitor still needed to be worked out.

![Electronics Schematic](src/assets/bikeschema.png)

The circuit is a full-wave rectifier. First, the AC energy passes through a full-wave rectifier made from 4 diodes, turning the negative half of the AC wave positive — but there's still a large jump as the energy fluctuates from 0 to the dynamo's max voltage. A capacitor smooths that ripple. A DC-DC converter or linear regulator then produces the steady DC current the phones charge with. The regulators and converters used have a minimum ripple tolerance of 100mV, so the capacitor (starting at 4700uF) needed to be sized to match.

I used the capacitor filter ripple formula, **C = I<sub>dc</sub> / (2 × f<sub>in</sub> × V<sub>r</sub>)**, where V<sub>r</sub> is the ripple voltage, I<sub>dc</sub> is the DC output current, and f<sub>in</sub> is the input frequency, using measured dynamo current at fast pedaling speed.

| Dynamo | Slow speed | Fast speed |
|---|---|---|
| 1 | 5.8V, 360Hz, 0.32A | 7.8V, 460Hz, 0.37A |
| 2 | 8.5V, 420Hz, 0.4A | 21.4V, 1020Hz, 0.64A |
| 3 | 2.7V, 160Hz, 0.2A | 9.3V, 140Hz, 0.4A |

Required capacitance at fast speed came out to roughly **4,348 µF** (Dynamo 1), **3,137 µF** (Dynamo 2), and **14,286 µF** (Dynamo 3).

After more research I realized hitting the 100mV ripple target exactly wasn't actually necessary — most converters work fine with the ripple already coming out of a 4700uF filter. The real constraint turned out to be the capacitors' voltage rating. The standard 50V cap rating was fine for Dynamo 3, but Dynamos 1 and 2 got close to or exceeded 50V at higher speeds. To fix that, I doubled the voltage headroom by wiring two capacitors in series on the bridge rectifier — which halves the combined capacitance, using **C = 1 / (1/C₁ + 1/C₂)**. The resulting ~2,350 µF was still enough for our purposes, and the maximum voltage from any dynamo never exceeded 65V.

Because of this, the two iPhone-compatible 80V DC-DC converters (for charging phones) connect to Dynamos 2 and 3, and the standard 80V DC-DC converter powering the LEDs connects to Dynamo 1. After final assembly, testing with the USB tester showed the USB current was limited to about 1A because the wire gauge connecting the bridge rectifiers to the DC-DC converters was too small.

## Mechanical Design

I am CADing this in Onshape. You can find the models here: [OnShape Doc](https://cad.onshape.com/documents/562c4f46c1262753f81229e8).
