# FRC Rebuilt

This is a showcase of the math that is used by FRC991 in REBUILT to help the turret aim past the net no matter where it is on the field. There also is an short explination of the localization system I used to make zones on the field that could activate certain commands when entered or exited. 

> **Note:** All units are in meters (m) unless specifically stated otherwise.
> **Origin:** $(0,0)$ is where the turret is located

<div class="embed-wrap">
<iframe src="https://www.desmos.com/calculator/esdfkraxzr?embed" height="480" allowfullscreen></iframe>
</div>

---
## Config Variables

* **`Rw`**: Robot Width.
* **`Rl`**: Robot Length.
* **`Tx`**: Turret distance on x axis (left and right) from center of robot.
* **`Ty`**: Turret distance on y axis (front and back) from center of robot.
* **`Tw`**: Length of the sides of the turret (Assumed to be a square).
* **`Hw`**: Hub width.
* **`Nb`**: Net Length.
* **`Nw`**: Net width.

---

## Control Variables

* **`Rr`**: Rotation of the robot.
* **`a`**: Alliance side.
* **`T`**: Offset for the turret to aim at.