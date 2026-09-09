# PringleTVC

This model rocket is a finless, thrust-vector-controlled (TVC) system constructed entirely from Pringles cans, 3D-printed components, and Arduino-based electronics.

Unlike traditional model rockets that rely on passive fins for stability, this design actively stabilizes itself using thrust vectoring. A pair of servo motors dynamically adjusts the motor’s orientation along two axes, actively counteracting rotational torque caused by wind and asymmetric aerodynamic forces from structural imperfections.

---

### Core Features

* **Finless Design:** Eliminates traditional aerodynamic fins in favor of active thrust vectoring.
* **Closed-Loop PID Control:** Uses real-time sensor feedback from a 6-axis Inertial Measurement Unit (IMU) to continuously maintain pitch and yaw stability.
* **Universal PID Tuning:** Integrates core physics and mathematical modeling, enabling a one-time PID tuning configuration that adapts to any motor size.
* **Custom Hardware:** Built using lightweight cardboard structure (Pringles cans), precision 3D-printed mounting components, and custom Arduino microcontrollers.