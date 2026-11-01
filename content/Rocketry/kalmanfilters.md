# Kalman Filter: Complete Concept & 1D Tracking Numerical Walkthrough

This document provides a comprehensive breakdown of the Kalman filter's theory, core matrix elements, and a complete step-by-step mathematical walkthrough for a 1D vehicle tracking application.

---

## 1. Core Framework & Overview
The Kalman filter is an optimal estimator that tracks the hidden state of a linear system over time. It operates recursively using a two-phase loop: **Prediction** and **Update**.

```
    +--------------------------------------------------------+
    |                                                        |
    |                      INITIALIZATION                    |
    |             Set initial state x0 and error P0          |
    |                                                        |
    +---------------------------+----------------------------+
                                |
                                v
    +---------------------------+----------------------------+
    |                                                        |
    |                    PHASE 1: PREDICT                    |
    |          Project state and uncertainty forward          |
    |          x_minus = F*x + B*u                           |
    |          P_minus = F*P*F^T + Q                         |
    |                                                        |
    +---------------------------+----------------------------+
                                |
                                | (New Measurement z arrived)
                                v
    +---------------------------+----------------------------+
    |                                                        |
    |                     PHASE 2: UPDATE                    |
    |          Balance model prediction and sensor data      |
    |          K = P_minus*H^T * (H*P_minus*H^T + R)^(-1)    |
    |          x = x_minus + K*(z - H*x_minus)               |
    |          P = (I - K*H)*P_minus                         |
    |                                                        |
    +--------------------------------------------------------+
```

### The Matrix Dictionary
*   **$\mathbf{x}$ (State Vector):** The true physical parameters tracked (e.g., position, velocity).
*   **$\mathbf{F}$ (State Transition Matrix):** The physical kinematic equations mapping the old state to the new state.
*   **$\mathbf{B}$ (Control Matrix) & $\mathbf{u}$ (Control Input):** Maps known external actions (like acceleration or throttle inputs) into the state.
*   **$\mathbf{Q}$ (Process Noise Covariance):** Represents unmodeled physical variations (wind gusts, friction, bumpy roads).
*   **$\mathbf{P}$ (Error Covariance Matrix):** Tracks the filter's estimation uncertainty. Diagonal elements represent variances ($Var(x_i)$); off-diagonals denote correlations.
*   **$\mathbf{H}$ (Measurement Matrix):** Transforms the internal system states into the format observed by physical sensors.
*   **$\mathbf{R}$ (Measurement Noise Covariance):** The inherent noise or variance profile of the sensing instruments.
*   **$\mathbf{K}$ (Kalman Gain):** A dynamic matrix multiplier that weighs the trusted authority of the physical model predictions against incoming sensor readings.

---

## 2. Problem Setup (1D Vehicle Tracking)
We are tracking a vehicle moving along a straight line. We track its **position** ($p$) and **velocity** ($v$) with updates occurring every **1 second ($\Delta t = 1$)**.

### Initialized Matrix Configurations

*   **Initial State Vector ($\mathbf{x}_0$):**
    $$\mathbf{x}_0 = \begin{bmatrix} 0 \\ 5 \end{bmatrix}$$
    *(Starts at position 0 meters, moving at 5 m/s)*

*   **State Transition Matrix ($\mathbf{F}$):**
    From $p_t = p_{t-1} + v_{t-1}\Delta t$ and $v_t = v_{t-1}$:
    $$\mathbf{F} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$

*   **Control Input ($\mathbf{u}$) & Control Matrix ($\mathbf{B}$):**
    The driver delivers a known, constant acceleration input of $2 \text{ m/s}^2$:
    $$\mathbf{u} = \begin{bmatrix} 2 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} \frac{1}{2}\Delta t^2 \\ \Delta t \end{bmatrix} = \begin{bmatrix} 0.5 \\ 1 \end{bmatrix}$$

*   **Process Noise Covariance ($\mathbf{Q}$):**
    $$\mathbf{Q} = \begin{bmatrix} 0.05 & 0.1 \\ 0.1 & 0.2 \end{bmatrix}$$

*   **Initial Error Covariance ($\mathbf{P}_0$):**
    $$\mathbf{P}_0 = \begin{bmatrix} 1 & 0 \\ 0 & 10 \end{bmatrix}$$
    *(High confidence in starting position variance = 1; low confidence in velocity variance = 10)*

*   **Measurement Profile ($\mathbf{H}$ and $\mathbf{R}$):**
    The sensor tracks **position only** and carries a variance margin of 4 meters:
    $$\mathbf{H} = \begin{bmatrix} 1 & 0 \end{bmatrix}, \quad \mathbf{R} = \begin{bmatrix} 4 \end{bmatrix}$$

---

## 3. Step-by-Step Mathematical Walkthrough (Iteration 1)

### Phase 1: The Prediction Step

#### Step 1A: Predict State Estimate ($\hat{\mathbf{x}}_1^-$)
$$\hat{\mathbf{x}}_1^- = \mathbf{F}\mathbf{x}_0 + \mathbf{B}\mathbf{u}$$

1. Matrix multiplication $\mathbf{F}\mathbf{x}_0$:
   $$\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 5 \end{bmatrix} = \begin{bmatrix} (1 \cdot 0 + 1 \cdot 5) \\ (0 \cdot 0 + 1 \cdot 5) \end{bmatrix} = \begin{bmatrix} 5 \\ 5 \end{bmatrix}$$

2. Matrix multiplication $\mathbf{B}\mathbf{u}$:
   $$\begin{bmatrix} 0.5 \\ 1 \end{bmatrix} \begin{bmatrix} 2 \end{bmatrix} = \begin{bmatrix} 0.5 \cdot 2 \\ 1 \cdot 2 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$$

3. Complete summation:
   $$\hat{\mathbf{x}}_1^- = \begin{bmatrix} 5 \\ 5 \end{bmatrix} + \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 6 \\ 7 \end{bmatrix}$$
   *The physical kinematics model projects the vehicle will be at position **6 meters** moving at **7 m/s**.*

#### Step 1B: Predict Error Covariance ($\mathbf{P}_1^-$)
$$\mathbf{P}_1^- = \mathbf{F}\mathbf{P}_0\mathbf{F}^T + \mathbf{Q}$$

1. Transpose matrix $\mathbf{F}$:
   $$\mathbf{F}^T = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$$

2. Inner multiplication $\mathbf{F}\mathbf{P}_0$:
   $$\mathbf{F}\mathbf{P}_0 = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 10 \end{bmatrix} = \begin{bmatrix} (1 \cdot 1 + 1 \cdot 0) & (1 \cdot 0 + 1 \cdot 10) \\ (0 \cdot 1 + 1 \cdot 0) & (0 \cdot 0 + 1 \cdot 10) \end{bmatrix} = \begin{bmatrix} 1 & 10 \\ 0 & 10 \end{bmatrix}$$

3. Post-multiplication $(\mathbf{F}\mathbf{P}_0)\mathbf{F}^T$:
   $$\begin{bmatrix} 1 & 10 \\ 0 & 10 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} (1 \cdot 1 + 10 \cdot 1) & (1 \cdot 0 + 10 \cdot 1) \\ (0 \cdot 1 + 10 \cdot 1) & (0 \cdot 0 + 10 \cdot 1) \end{bmatrix} = \begin{bmatrix} 11 & 10 \\ 10 & 10 \end{bmatrix}$$

4. Add Process Noise Matrix $\mathbf{Q}$:
   $$\mathbf{P}_1^- = \begin{bmatrix} 11 & 10 \\ 10 & 10 \end{bmatrix} + \begin{bmatrix} 0.05 & 0.1 \\ 0.1 & 0.2 \end{bmatrix} = \begin{bmatrix} 11.05 & 10.1 \\ 10.1 & 10.2 \end{bmatrix}$$
   *Uncertainty scales upward across time as unmodeled physical forces inject entropy ($Q$) into predictions.*

---

### Phase 2: The Update Step
*Incoming Sensor Measurement:* $\mathbf{z}_1 = \begin{bmatrix} 7.5 \end{bmatrix}$ (Sensor claims vehicle is at 7.5 meters).

#### Step 2A: Compute Kalman Gain ($\mathbf{K}_1$)
$$\mathbf{K}_1 = \mathbf{P}_1^-\mathbf{H}^T (\mathbf{H}\mathbf{P}_1^-\mathbf{H}^T + \mathbf{R})^{-1}$$

1. Compute product $\mathbf{P}_1^-\mathbf{H}^T$:
   $$\mathbf{H}^T = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
   $$\mathbf{P}_1^-\mathbf{H}^T = \begin{bmatrix} 11.05 & 10.1 \\ 10.1 & 10.2 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} (11.05 \cdot 1 + 10.1 \cdot 0) \\ (10.1 \cdot 1 + 10.2 \cdot 0) \end{bmatrix} = \begin{bmatrix} 11.05 \\ 10.1 \end{bmatrix}$$

2. Compute product $\mathbf{H}\mathbf{P}_1^-\mathbf{H}^T$:
   $$\mathbf{H}(\mathbf{P}_1^-\mathbf{H}^T) = \begin{bmatrix} 1 & 0 \end{bmatrix} \begin{bmatrix} 11.05 \\ 10.1 \end{bmatrix} = \begin{bmatrix} 1 \cdot 11.05 + 0 \cdot 10.1 \end{bmatrix} = \begin{bmatrix} 11.05 \end{bmatrix}$$

3. Complete denominator terms inside inverse function $(\dots + \mathbf{R})$:
   $$\begin{bmatrix} 11.05 \end{bmatrix} + \begin{bmatrix} 4 \end{bmatrix} = \begin{bmatrix} 15.05 \end{bmatrix}$$

4. Invert the scalar matrix:
   $$\begin{bmatrix} 15.05 \end{bmatrix}^{-1} = \begin{bmatrix} \frac{1}{15.05} \end{bmatrix} \approx \begin{bmatrix} 0.066445 \end{bmatrix}$$

5. Compute final Kalman Gain vector $\mathbf{K}_1$:
   $$\mathbf{K}_1 = \begin{bmatrix} 11.05 \\ 10.1 \end{bmatrix} \begin{bmatrix} 0.066445 \end{bmatrix} = \begin{bmatrix} 11.05 \cdot 0.066445 \\ 10.1 \cdot 0.066445 \end{bmatrix} \approx \begin{bmatrix} 0.7342 \\ 0.6711 \end{bmatrix}$$

#### Step 2B: Update State Estimate ($\hat{\mathbf{x}}_1$)
$$\hat{\mathbf{x}}_1 = \hat{\mathbf{x}}_1^- + \mathbf{K}_1(\mathbf{z}_1 - \mathbf{H}\hat{\mathbf{x}}_1^-)$$

1. Compute measurement residual error $(\mathbf{z}_1 - \mathbf{H}\hat{\mathbf{x}}_1^-)$:
   $$\mathbf{H}\hat{\mathbf{x}}_1^- = \begin{bmatrix} 1 & 0 \end{bmatrix} \begin{bmatrix} 6 \\ 7 \end{bmatrix} = \begin{bmatrix} 6 \end{bmatrix}$$
   $$\text{Residual} = \begin{bmatrix} 7.5 \end{bmatrix} - \begin{bmatrix} 6 \end{bmatrix} = \begin{bmatrix} 1.5 \end{bmatrix}$$
   *(The tracking model undershot the actual sensor observation by 1.5 meters)*

2. Weight residual via Gain $\mathbf{K}_1$:
   $$\mathbf{K}_1 \times 1.5 = \begin{bmatrix} 0.7342 \cdot 1.5 \\ 0.6711 \cdot 1.5 \end{bmatrix} = \begin{bmatrix} 1.1013 \\ 1.0067 \end{bmatrix}$$

3. Complete summation to correct states:
   $$\hat{\mathbf{x}}_1 = \begin{bmatrix} 6 \\ 7 \end{bmatrix} + \begin{bmatrix} 1.1013 \\ 1.0067 \end{bmatrix} = \begin{bmatrix} 7.1013 \\ 8.0067 \end{bmatrix}$$
   *The filter optimizes state configurations to establish a posteriori metrics: Position = **7.101 meters**, Velocity = **8.007 m/s**.*

#### Step 2C: Update Error Covariance ($\mathbf{P}_1$)
$$\mathbf{P}_1 = (\mathbf{I} - \mathbf{K}_1\mathbf{H})\mathbf{P}_1^-$$

1. Build product $\mathbf{K}_1\mathbf{H}$:
   $$\mathbf{K}_1\mathbf{H} = \begin{bmatrix} 0.7342 \\ 0.6711 \end{bmatrix} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} (0.7342 \cdot 1) & (0.7342 \cdot 0) \\ (0.6711 \cdot 1) & (0.6711 \cdot 0) \end{bmatrix} = \begin{bmatrix} 0.7342 & 0 \\ 0.6711 & 0 \end{bmatrix}$$

2. Subtract from Identity Matrix ($\mathbf{I}$):
   $$\mathbf{I} - \mathbf{K}_1\mathbf{H} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} - \begin{bmatrix} 0.7342 & 0 \\ 0.6711 & 0 \end{bmatrix} = \begin{bmatrix} 0.2658 & 0 \\ -0.6711 & 1 \end{bmatrix}$$

3. Multiply by predicted uncertainty $\mathbf{P}_1^-$:
   $$\mathbf{P}_1 = \begin{bmatrix} 0.2658 & 0 \\ -0.6711 & 1 \end{bmatrix} \begin{bmatrix} 11.05 & 10.1 \\ 10.1 & 10.2 \end{bmatrix}$$
   $$\mathbf{P}_1 = \begin{bmatrix} (0.2658 \cdot 11.05 + 0) & (0.2658 \cdot 10.1 + 0) \\ (-0.6711 \cdot 11.05 + 1 \cdot 10.1) & (-0.6711 \cdot 10.1 + 1 \cdot 10.2) \end{bmatrix}$$
   $$\mathbf{P}_1 \approx \begin{bmatrix} 2.9371 & 2.6846 \\ 2.6843 & 3.4219 \end{bmatrix}$$

### Verification & Check
Look at how the diagonal variance terms dropped significantly:
*   **Position Variance:** Dropped from **11.05** down to **2.94**
*   **Velocity Variance:** Dropped from **10.20** down to **3.42**

Because a real measurement was checked, the filter successfully pruned away unneeded system uncertainties. This updated $\hat{\mathbf{x}}_1$ and $\mathbf{P}_1$ serve as the exact inputs for the next time-step cycle.
