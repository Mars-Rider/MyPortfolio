# Pavo 20 Pro Analog

A DJI O3/O4 Analog Alternative

![Pavo](src/assets/AssemblyLower.png){300px,-50px}

## But Why?

If you are looking for a pre-built sub-drone to get cinematic shots while being sub-250g and small enough to fit through gaps — all while being analog and costing less than the DJI system — you are in for a challenge. This is similar to the problem I had: I couldn't fly my 5-inch drone everywhere, and my tiny whoop couldn't record video, so I decided to try my luck at making such a drone. My goals were to make it as small and light as an O3 unit, have a pretty good range, be able to adjust settings to get a really cinematic look, and have the power to do some freestyle maneuvers. This page maps my journey through this project.
---
## Choosing a Drone

The type of drone I'm looking for is the size of a cinewhoop — sub 250g so I don't need to register it — with enough power to do some freestyle tricks, like a power loop. Essentially a bigger and stronger tiny whoop, aka a micro quad.

### Flylens85

![Flylens85](https://rcdrone.top/cdn/shop/articles/85-ana-04_2160x_bb031cab-4111-4ec6-942c-8ea8bdd287af.webp?v=1699105738&width=1920){150px}<big-card>

- Can't easily attach/detach the new stack
- Not very powerful, especially outside
- Only two props?

### Pavo 20 Pro

![Pavo 20 Pro](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXdjO68nrQf0K_uh8hD96FNJGDd-2tt27nb79KoqcbPzUgt9Dg3Muml4x3&s=10){150px}<big-card>

- Extremely powerful — 3S
- Canopy system offers more than enough room

### Mobula 8

![Mobula 8](https://www.rotorama.com/assets/images/db21eaf3446afc309f971ec2b97f6ce7/30574-806_807.jpg){150px}<big-card>

- Powerful for the size and small — 2S
- Only needs a DVR added (cheap)
- Not quite the range/speed I want

> The Mobula 8 is a more budget alternative that can achieve the same thing more easily. See [this example](https://www.reddit.com/r/TinyWhoop/comments/1mn7e8m/mobula8_with_an_identity_crisis/).

In the end I chose the **Pavo 20 Pro**. It's very powerful for the size, can easily do freestyle moves, and the canopy offers lots of room to build off of. The Mobula 8 was a close second — you only need to buy the camera to use it — but I thought being limited to 2S wouldn't give me the speed and range I wanted. Honestly, the Mobula 8 is also a great choice, since you can (almost) achieve everything I did for the same price or cheaper — I'd highly recommend it if you plan to fly in a more compact area. The only downsides are that you can't really use ND filters with it and it has less power, but it's better for filming in small areas. You can also use a normal Pavo 20 if you don't want as much power.
---
## The Video & Radio System

### [Runcam Split 4 V2](https://shop.runcam.com/runcam-split-4-v2/)

Records the video on the drone and can change settings from the flight controller.

### [AKK FX3 Ultimate](https://www.akktek.com/akk-fx3-ultimate.html)

Up to 600mW, offers SmartAudio control, and works with any analog goggles.

### [Radiomaster Pocket](https://radiomasterrc.com/products/pocket-radio-controller-m2)

Any EdgeTX transmitter will work, but this is what I use and it's recommended for camera control.

### MinimOSD Micro

Overlays text on the video showing data from the flight controller during flight, via a UART port.

### [Flywoo ND Filters](https://www.getfpv.com/flywoo-nd-filter-set-for-dji-o4-air-unit-nd4-8-16.html)

Help keep the shutter speed at 1/60 when it's bright out — I made the holders specifically for these.

### [Eachine EV800D Goggles](https://www.amazon.com/EV800D-FPV-Goggles-DVR-Transmitter/dp/B0CDLG441L)

What I use, and pretty budget — but any analog goggles work.

### JST 2.0 Connectors

2-pin and 4-pin.

### Heat Shrink

Should be small.

![Build photo](https://lh3.googleusercontent.com/sitesv/AG8ngQVYcLIQWf7GlLlByYijPm9NA_G9BOKKyshzyUBjPeuBaJpGL6WuzWqoYnjk4q5OxOl-VIVO-blJ_CKonYE-fqxpWfQijPoajekwnZq8Vd66qIQwm6IxjgIESvDwOi4rjtLxt80eumLpfhbCNNBFBhx8BMjo5c2DL6CwhqiWMOe9x1amWbFkFjwoE0PMUaQomK3ZfjWYrevz5Ff0hRZ__fph3wBNtqaMwQemU0rD_hU=w1280)
![Build photo](https://lh3.googleusercontent.com/sitesv/AG8ngQV1yKHGBwBJxyRqVQJmMOoe6zgqsL0Ovxguor8Gmipw8hi_hEj3MX-3oeFB-lMZ6UCt6LMytfwX9PEsnlujpMDf4yYC9FonrZ3jLsRhDQxiF3Xktk7Gr6ZXV7pQXYsJSQhfucCdyQOHv_nA5bL-CfltdzXXZpyBRif96xS5avhzKPowampJ5-gqbwzS0kqXQfAfypdZS9VkMPOX0WWgki_gK5Q=w1280)

## Building Materials & Tools

### FTDI Programmer

To program the MinimOSD (an Arduino doesn't work for this).

### 90A TPU

Blue, to match the LEDs.

![TPU spool](https://lh3.googleusercontent.com/sitesv/AG8ngQXrpNqfMZLVThBknnSRqU1cc-73G2L_KZdSTDke3yDVP3Qoh7nsO6IFHWvVRd6aj5q4VKV_Vg8WEH2AQ_sXNp-IX8zrxRmYS3CEcDjwvQwDDgtXeiAUBW0RpEatIpLAY7j6ddaaJX_XJ5bReC8tAHe3dhKLStv7jkddEJ3Arv-Uqr0fTwXQIYUpvWHA=w1280)

### M4 Screws

8mm and 12mm.

![M4 screws](https://lh3.googleusercontent.com/sitesv/AG8ngQVbaWNqqwkjX72knw7bMJRS8ZZrzR2Z5ZWZlRqCfsXUsMWKxR5OVzpFmaY-uwyj14b8vviTy-dtIr28I0uXPJo1DeSMyNaL-AsLv4bbatppSkLSP1-HSohUtZfBExsGrTrGD0gYhnR-igENplKIoHBWQy2G-tKHXxhTOl5Ag7UAEm9tof65TA-1p_wTDQHLC41fdhHojENQVlnld5Xbeykzx0VKNZnVaVFsnXLJacM=w1280)

## CAD

[button: Open the Onshape document](https://cad.onshape.com/documents/562c4f46c1262753f81229e8/w/0135f23875e5a2c1f0848c8f/e/ae34238f71d35bfd14b4e765)

Like always, I used Onshape. I started by importing pictures of the O3 canopy's dimensions, then modeled my canopy to match the O3's overall dimensions — but with inserts for the JST 2.0 female connectors in the back, and more material in the stressed parts of the model. The stack consists of the Runcam Split 4 on the bottom, the FX3 on top (rotated 45° due to the different mounting holes on each board), and the MinimOSD Micro holder on top of that. I made two different stack designs: one connecting directly to the Pavo 20 Pro carbon frame, and one connecting to the canopy.

## Schematic

- BetaFPV F4 Digital 9V Out → 4-pin connector → Runcam Split 4 VCC → FX3 VCC
- BetaFPV F4 Digital GND → 4-pin connector → Runcam Split 4 GND → FX3 GND → MinimOSD GND
- BetaFPV F4 Digital TX → 4-pin connector → MinimOSD RX
- BetaFPV F4 Digital RX → 4-pin connector → MinimOSD TX
- Move the LED yellow wire from BetaFPV F4 UART6 TX to the BetaFPV F4 UART6 RX pad
- BetaFPV F4 UART1 TX → 2-pin connector → Runcam Split 4 RX
- BetaFPV F4 UART1 RX → 2-pin connector → Runcam Split 4 TX
- BetaFPV F4 UART6 TX → TBS SmartAudio
- MinimOSD 5V → FX3 5V
- MinimOSD Video Out → FX3 Video In
- MinimOSD Video In → Runcam Split 4 Video Out

![Schematic](https://lh3.googleusercontent.com/sitesv/AG8ngQX-At-fg_-zpxsHaQLyVxuXBpJrMV7ZvFZ46TddIcLmJGTVlbCCxqnIus4G5EjFaivj3V_3L7xgU5SJE0sRhi8V_6rOtz_oovGWJ_49ja1IVkmkcFcmP6K_jHhi_NXuAQNWpjNwyc3IrVSLGUrPxR8ghmr2_MdlzqPcZqKwTGUSFHnnnZqGeiBwImxMgsaU8_qkz3BhOLhYAqzgbc20Jrjvay9ymfHcb_IaMHPe=w1280)
---
## Controller Layout

![Controller Layout](src/assets/OSDOnOff.png)

### Logic Switches

| # | Function |
|---|---|
| L01 | a=x G2 1 |
| L02 | a=x G2 2, SD/\\ |
| L03 | EdgeSE\\/ [0.0:0.6], SD/\\ (Duration: 0.4) |
| L04 | EdgeSD/\\ [0.0:--] (Duration: 0.4) |
| L05 | EdgeSD\\/ [0.0:--] (Duration: 0.4) |
| L06 | OR L04 L05 |
| L07 | OR SA\\/ SD\\/ |
| L08 | OR L01 L03 |
| L09 | EdgeSE\\/ [0.0:0.6] SD\\/ (Duration: 0.4) |
| L10 | EdgeSE\\/ [0.7:--] SD/\\ (Duration: 0.4) |
| L11 | EdgeSE\\/ [0.7:--] SD\\/ (Duration: 0.4) |
| L12 | OR L09 L10 |

### Special Functions

| # | Function | Trigger |
|---|---|---|
| L03 | Adjust G2 +=1 | ✓ |
| L02 | Adjust G2 0 | ✓ |
| L10 | Play Sound BP1 | – |
| L11 | Play Sound BP1 | – |

### Mixes

| Channel | Weight | Source |
|---|---|---|
| CH1 | 100 | Ail |
| CH2 | 100 | Ele |
| CH3 | 100 | Thr |
| CH4 | 100 | Rud |
| CH5 | 100 | L08 |
| CH6 | 100 | SB |
| CH7 | 100 | SC |
| CH8 | 100 | L06 (Weight: 75, Offset: -25) |
| CH9 | 100 | L08 |
| CH10 | 100 | SF |
| CH11 | 100 | L12 (Weight: 75, Offset: -25) |
| CH12 | 100 | L11 |

## Problems During the Project

- mwOSD 1.6 didn't work
- Couldn't use an Arduino to program it
- Wouldn't connect to the flight controller (Runcam) — had to change the CLI settings
- To turn the lights on and off, you have to move the yellow wire to Tx1-A09, Tx3-B10, A08, B06, or B05 (still figuring out exactly which)
- A loose canopy connector caused the camera to turn off in crashes and led to bad range

## Videos & Photos

Camera control and flight footage clips live in the [Photography](#/photography) gallery.

## Future Upgrades/Changes

- Connect the VTX's SmartAudio to a free UART TX on the F4 board to control power, channel, and band from Betaflight or the OSD (TX1)
- Optimize the camera mounts to hold the ND filters with nothing in frame
- RGB LED strip from the scroll wheel
- Add a linear servo to change the camera angle from the scroll wheel
- Upgrade antennas
- Add GPS for return-to-home
- Make the inside of the ND filters black to avoid reflections
- Switch to [MWOSD Displayport mode](https://betaflight.com/docs/wiki/guides/current/External-OSD-MWOSD-CMS#non-typical-displayport-installation-and-configuration) to use the Betaflight OSD instead of the MW config (slower, but looks better)
- Find the throttle MSP output

## File Downloads

- [All 3D Files](https://drive.google.com/uc?export=download&id=1wpzrLeJwFT-4UZf9gfJeuS0wbawHuQmA)
- [CLI Dump](https://drive.google.com/uc?export=download&id=1BE_aYouX-iEtxDdmrR_7dQ-PItbfBzWv)
- OSD Settings and Radio Settings — coming soon

## Upgrades So Far

Finished the canopy for the Pavo 20 with the linear servo and the canopy for the SmartAudio. Still need to CAD the GPS mount. Also added the LED strip with an on/off switch.
