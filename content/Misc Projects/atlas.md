# Atlas Map

Atlas is an interactive world map, powered buy a dual motor SCARA Robotic arm that points at any location you tell it. It is in its prototype phase and has gone through two major design revision, each improving apon the last. In each, you could control it through Siri, an app on your phone, and a website.

## The Map

I choose to use a rectangular projection of earth, which maps every coordinate as a square, so the earth is shown in a nice grid. While this is makes the maht easier on the code side as I don't have to account for a projection, it does make the tops of the world seem a bit more squished than what we are used to with the mercator projection. To make the graphic, I found a SVG of this projection on wikimedia and recolored it. I then overlayed a texture map to let a bit of the natural color of certain areas show and give it a greater variation. I also overlayed a photo of earth at night, so that city lights can shine brighter when the laser points at a certain location. This is what the final map looks like below

![Pavo](src/assets/Custo.png)


Side note: the photo of earth at night came from nasa and its how I learned that nasa keeps extremely high quality photos of earth in all the most common projections. By exteme high quality, I mean like 14K.

## First Design
My first design used an Arduino Nano IOT 33 on a bread board. I reused a majority of the parts in my second design and gave a full list of what I used in that section. This design used a laser cut box made of 0.2in plywood with the scara arm mounted in the middle. The scara arm used two 28BYJ motors which had just enough torque to move its own weight.

On the first major code version, it would pull any new data from firebase, use a geolocation API to get the coordinates, then calculate the angles for each arm and move each arm to that location. It would also get the current time of that certain location and match the 7-segment display to that time. It saves the time to the realtime clock and saves the motor positions to the EEPROM of the arduino nano. the major problem I had with this design was that the motors didn't have builtin encoders so I didn't know exacty where the motor was as it spun. Combine that with the bad backlast of the motors, and the final position would be at most a centimeter off of the target. To fix this, I took apart a SG90 9 gram servo motor to use the potentiometer to track the position of the arm.I could only fit one, so I added a accelerometer to the other arm to track its rotation with the gyro. I then made a PID loop to make the arm get to its exact position. However, as the potentiometer only had a range of 270, after some point it would give back random data, which upset the PID. 

## Second Design
In my second design, I aimed to improve apon the first by giving it a btter build quality. Instead of being fully plywood, I used the wood in my schools workshop to make a picutre frame with the exact dimensions that I needed. I also made a siding out of the same oak wood. The base is still plywood, but uses screws to connect to the siding and top picture frame piece. 

As for actual engineering changes, I am using a more powerful ESP32 Microcontroller with 20mm Nema14 pancake motors and dedicated stepper drivers with the same real time clock and led display as the last iteration. I also soldered everything onto one prototype board, instead of using a breadboard and having a mess of wires. For my motor, I found the thinest stepper motor with more rated torque than the 28BYJs I was using in the past. These motors are direct drive to the arms and don't suffer from any backlash

### Problems

While the motors were rated for the same torque, to power them at that torque would heat them up quite a bit and stress the stepper drivers. Also as it was direct drive without a gearbox, while it didnt have backlash, it would need to hold that torque to hold the position of the arm, which makes it over heat quick. While I didn't have to worry about backlash anymore, I still didnt have encoders to see what position the arms were, so it has to save what angle the arms are at when the device powers up, which is fine as long as the arms don't move while its powered down.

### Improvements

Despite these problems, the new stepper drivers were great. They are incredibly efficent, small, and very quite. The whole experiance of using the map was much better, especially considering the nicer eye pleasing design.

### BoM

A basic Bill of Materials is listed below. I will fully flesh it out at some point in the future.

### How I will fix the existing problems

In my opinion I have 3 options to fix my motor problems
Option 1 is to add a gearbox or belt system to the motors, which while it may introduce some backlash, I can adjust the tension to reduce it.
Option 2 is to put bach on the 28BYJ and use them with the new driver, keeping the benefits of the new driver but adding back in backlash. But if I got encoders for the motors, I could just use a PID to mitigate this problem
Option 3 is to buy another motor like a 360 degree servo or a stronger stepper motor with an encoder.

## Whats Next

Hopefully, I will find a more power full motor configuration that will fit in the same size. I also want to integrate the microphone into the board to let you talk directly to the map instead of using your phone. I plan to use an AI model to detect a wake up term, then have the ESP32 stream 4 seconds of audio to google's speech to text api and then identify locations with google's natural language processing api. I also want to take advantage of apis that track planes to try to track a plane while it flies. I also want to make another version that uses the mercator projection, which is more common.

## Math Showcase
This is a showcase of my Atlas map that points at any location you tell it. Atlas is a small-scale robotic arm that uses a laser to point at places on a custom map. All you have to do is ask Siri where any city is, and the laser points to the city location on the 2D world map, and a display reports the current time. This is where I first had to use Inverse Kinematics, a system that finds the angles of each arm joint via the end position, to control the robotic arm. My goal was to make it a pretty small form factor, and as a consequence, the stepper motors I was using for the arm had a massive deadzone. I had to compensate by integrating small potentiometers from 9g servos to make a closed-loop that would account for the deadzone. In addition, I also had to mess around with power draw, as the current of the motors would shut down the Real Time Clock and the 7-segment display, leading me to decide to just shut down the motors once they reached the end point. Since then, I have upgraded to pancake stepper motors and an esp32 with a custom protoboard. I also made a fully wooden enclosure for the map. However, I have ran into problems with the strength of the motors so for the moment, the project is in a prototype phase.


> **Note:** All units are in millimeters (mm) unless specifically stated otherwise.
> **Origin:** $(0,0)$ is where the arm connects to the robot.

<div class="embed-wrap">
<iframe src="https://www.desmos.com/calculator/7npksw0c1m?embed" height="480" allowfullscreen></iframe>
</div>

---
### Config Variables

* **`L1Off`**: Length of the offset supporting arm (needed if using a design like 202).
* **`L1`**: Length of the first arm segment.
* **`L2`**: Length of the second arm segment.
* **`Lr`**: Length of the robot (used so the arm cannot move inside the robot; can be disabled if necessary).
* **`Theta1Off`**: The angle the offset supporting arm is offset by (needed if using a design like 202).
* **`WL`**: Length of the wrist and claw.
* **`F`**: Distance of the floor below $(0,0)$ (how low the floor is).
* **`Ein`**: FTC Rules Max Extension (in inches).
* **`Emax`**: Max extension of the arm forward.
* **`Emin`**: Max extension the arm can move back and still remain within the extension limit.
* **`Emin_wrist`**: Max extension the arm can move back WITH the wrist pointing backwards and still remain within the extension limit.

---

### Control Variables

* **`X`**: Horizontal control of the end point (Left is `-`, Right is `+`).
* **`Y`**: Vertical control of the end point (Down is `-`, Up is `+`).
* **`PhiOff`**: The offset angle of the wrist from level.

---

### Modes

* **Forward Kinematics:** Getting the coordinates/points from set angles.
* **Inverse Kinematics:** Getting the required angles from set coordinates/points.