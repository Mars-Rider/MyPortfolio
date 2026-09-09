# FRC Rebuilt

This is a showcase of the math that is used in the Inverse Kinematic system used on the BroncoBotsToo *Into The Deep* robot. You can change these values and learn how they will affect your restrictions.

> **Note:** All units are in millimeters (mm) unless specifically stated otherwise.
> **Origin:** $(0,0)$ is where the arm connects to the robot.

<div class="embed-wrap">
<iframe src="https://www.desmos.com/calculator/pzaaknonvl?embed" height="480" allowfullscreen></iframe>
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