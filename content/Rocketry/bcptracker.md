# BCP Tracker

BCP Tracker is a custom all in one flight computer that can handle primary flight control, real-time telemetry, and do both dual deployment for parachutes or multi-stage rockets via pyro channels for the rocketry club at Brophy. For our custom rockets at brophy, we wanted to be able to both set off pyros and track a rocket with on flight computer. No featherweight altimeter has this option and we thought it would be a better idea to just make our own circuit board than buy and assemble one from Eggtimer. This was my first custom circuit board that used surface-mount components (SMD) to get it to a small package flight computer. It was built to fly on the initial launch of the **Bronc II** rocket. You can see the schematic, firmware, and 3D Model on the github pagelinked at the bottom of the page.

![BCP Tracker Pinout](src/assets/Tracker.png)

---

## Key Features & Hardware

- **Microcontroller:** Powered by an ESP32 microcontroller that manages all core operations, processing, and wireless communications.
- **Dual Pyro Channels:** Features two dedicated pyrotechnic channels to reliably ignite parachute deployment charges or motor igniters during flight.
- **6-Axis Inertial Measurement Unit (IMU):** Tracks spatial orientation, acceleration, and motion dynamics.
- **Barometer:** Provides precise altitude and atmospheric pressure tracking.
- **GPS Module:** Enables accurate real-time coordinates and location tracking.
- **Long-Range Telemetry:** Includes a built-in LoRa module to stream live telemetry and location data back to the ground station during flight and recovery.

## All Documents
### BOM

Manufactured by PCBWay

| Qty | Manufacturer | Mfg Part #          | Description / Value             | Unit Price |
| --- | ------------ | ------------------- | ------------------------------- | ---------- |
| 4   | -            | TCC0805X7R104K500DT | 0.1uF『 』Unpolarized capacitor | $0.032     |
| 3 | - | TCC0805X7R105K250DTS | 1uF『 』Unpolarized capacitor | $0.073|
| 2 | - | TCC0805X5R106M250FT | 10uF『 』Unpolarized capacitor | $0.143|
| 3 | onsemi | MBR1020VL | MBR1020VL『 』20V, 1A, 340 mV, Schottky Diode Rectifier, SOD-123F | $0.146|
| 1 | - | XL-TD2012UGC | GENERIC GREEN『 』Light emitting diode | $0.675|
| 1 | - | SML-M13DTT86 | GENERIC ORANGE『 』Light emitting diode | $0.702|
| 1 | - | 132289 | Conn_Coaxial『 』coaxial connector (BNC, SMA, SMB, SMC, Cinch/RCA, LEMO, ...) | $11.319|
| 1 | - | USB4105-GF-A | USB_C_Plug_USB2.0『 』USB 2.0-only Type-C Plug connector | $2.616|
| 2 | - | NDT3055L | NDT3055L『 』4A Id, 60V Vds, N-Channel Logic Level Enhancement Mode MOSFET, SOT-223 | $1.208|
| 1 | nexperia | MMBT2222A | MMBT2222A『 』600mA Ic, 40V Vce, NPN Transistor, SOT-23 | $0.408|
| 2 | - | RC0805FR-07120RL | 120『 』Resistor, US symbol | $0.035|
| 7 | - | 0805W8F1002T5E | 10k『 』Resistor, US symbol | $0.009|
| 2 | - | 0805W8F4701T5E | 4.7k『 』Resistor, US symbol | $0.031|
| 2 | - | 0805W8F1002T5E | 10K『 』Resistor, US symbol | $0.029|
| 2 | - | SKRKAGE020 | SW_Push『 』Push button switch, generic, two pins | $0.830|
| 1 | bosch | BMI270 | BMI270『 』BMI270 | $3.220|
| 1 | hoperf | RFM96W-433S2 | RFM96W-433S2『 』Low power long range transceiver module, SPI and parallel interface, 433 MHz, spreading factor 6 to12, bandwidth 7.8 to 500kHz, -111 to -148 dBm, SMD-16, DIP-16 | $29.974|
| 1 | - | TPS73733DCQR | TPS73733DCQR | $0.515|
| 1 | - | SAM-M8Q-0 | SAM-M8Q『 』GPS ublox M8 variant | $47.233|
| 1 | - | ESP32-C3-MINI-1-N4 | ESP32-C3-MINI-1『 』ESP32-C3-MINI-1 family is an ultra-low-power MCU-based SoC solution that supports 2.4 GHz Wi-Fi and Bluetooth®Low Energy (Bluetooth LE). | $2.818|
| 1 | bosch | BMP388 | BMP388 | $3.220|

- **Component Cost:** $108.10
- **Assembly Cost:** $29.00
- **PCB Cost:** $5.00
- **Total For 1 Set:** $142.10

#### For comparison with other commerial products
- A FeatherWeight Blue Raven, which is an altimeter+pyro only, costs $175.
- A FeatherWeight Tracker, which is only a tracker, costs $175
- A EggTimer Quasar, which has 3 pryos and is a tracker, costs $100 though you have to do the assembly and it has less accurate sensors, a slower radio, and a slower microcontroller.

### GitHub Repo

You can find the schematic, firmware, and 3D Model on the github of this project, link.

[button: Check out the GitHub Repo <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--text)" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path>
</svg>](https://cad.onshape.com/documents/6b75cda9b93e269c471f7242/w/fe2d0b81590c5fe9662d7b48/e/0e40e4d0e3f0f20d89780360?configuration=List_KbUpsgoELi9LxG%3DDefault%3BList_MQA9VFZgfj6kXO%3DDefault&renderMode=0&uiState=6ab7eb92fcb6bdafdf06ad4c)


### 3D Model + Case
We also have a case for this pcb to keep it safe from the dust at the launch site.

[button: Check out the case here](https://cad.onshape.com/documents/6b75cda9b93e269c471f7242/w/fe2d0b81590c5fe9662d7b48/e/0e40e4d0e3f0f20d89780360?configuration=List_KbUpsgoELi9LxG%3DDefault%3BList_MQA9VFZgfj6kXO%3DDefault&renderMode=0&uiState=6ab7eb92fcb6bdafdf06ad4c)
