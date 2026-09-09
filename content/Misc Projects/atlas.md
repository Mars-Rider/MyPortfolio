# Atlas Map

This is a showcase of my Atlas map that points at any location you tell it. Atlas is a small-scale robotic arm that uses a laser to point at places on a custom map. All you have to do is ask Siri where any city is, and the laser points to the city location on the 2D world map, and a display reports the current time. This is where I first had to use Inverse Kinematics, a system that finds the angles of each arm joint via the end position, to control the robotic arm. My goal was to make it a pretty small form factor, and as a consequence, the stepper motors I was using for the arm had a massive deadzone. I had to compensate by integrating small potentiometers from 9g servos to make a closed-loop that would account for the deadzone. In addition, I also had to mess around with power draw, as the current of the motors would shut down the Real Time Clock and the 7-segment display, leading me to decide to just shut down the motors once they reached the end point. Since then, I have upgraded to pancake stepper motors and an esp32 with a custom protoboard. I also made a fully wooden enclosure for the map. However, I have ran into problems with the strength of the motors so for the moment, the project is in a prototype phase.


> **Note:** All units are in millimeters (mm) unless specifically stated otherwise.
> **Origin:** $(0,0)$ is where the arm connects to the robot.

<div class="embed-wrap">
<iframe src="https://www.desmos.com/calculator/7npksw0c1m?embed" height="480" allowfullscreen></iframe>
</div>

---
## Config Variables

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

## Control Variables

* **`X`**: Horizontal control of the end point (Left is `-`, Right is `+`).
* **`Y`**: Vertical control of the end point (Down is `-`, Up is `+`).
* **`PhiOff`**: The offset angle of the wrist from level.

---

## Modes

* **Forward Kinematics:** Getting the coordinates/points from set angles.
* **Inverse Kinematics:** Getting the required angles from set coordinates/points.