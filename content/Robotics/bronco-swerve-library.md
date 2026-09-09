# Exploration into Swerve Math

As a part of Brophy Broncobotics, our club had a habit of making swerve drive robots and other robots with werid drivetrains. Junior year, I was tasked with coding a ball drive robot with only two balls near the front of the robot. As we used pedro pathing, we needed to be able to strafe so I had to find a way to mathematically counter act the torque when trying to strafe. Below is the math that I had done, but sadly our ball drive never passed the prototype phase, so this math hasn't been tested with a robot. Below is the culmination of my work.

<div class="embed-wrap">
<iframe src="https://www.desmos.com/calculator/tnzah38cg4?embed
" height="480" allowfullscreen></iframe>
</div>

> **Note:** The basic swerve math in this section was taken from this excellent article on FRC Swerve math: https://dominik.win/blog/programming-swerve-drive/. 

## The basic equation

At its core, the math for swerve can most easily be shown through vectors. The output of a swerve module can be found by adding the translational and the rotational components, as shown in the equation `o(m) = t(m) \+ w(m)`.

## The inputs - [Desmos](https://www.desmos.com/calculator/ptlks4ecdv)

For our math, there are two inputs: the control inputs and the module inputs

### Control Inputs - [Desmos](https://www.desmos.com/calculator/vlwukezuw9)

Like most drive trains, inputs are a velocity vector (typically m/s) and an angular velocity (rad/sec). 

```
Velocity Vector (By its x and y components): 
X = 0
Y = 0
Angular velocity:
R = 0
```
The code blocks (like above) in this section are meant to be lines in Desmos. If you insert everything, by the end, you can find the individual outputs for each module. 

### Module Inputs - [Desmos](https://www.desmos.com/calculator/l8xyv2hodd)

As the basic swerve function states the output for individual modules, we need to store the module locations.

```
Modules:
m1 = (2,2)
m2 = (-2,2)
m3 = (-2,-2)
m4 = (2,-2)
```
The units for our module's location should be the same as the units of our velocity vector input (typically meters). That also means that the locations of the modules are unrealistic (unless your robot is 4 meters by 4 meters), so a smaller unit might be more realistic.

The units don’t really matter in the final version, but it does if you were to only use the math up to where the adjustment is

## Translational component - [Desmos](https://www.desmos.com/calculator/ssrxecwf2m)

The translational component is the velocity vector from our input. `t(w) = (X,Y)` 

```
t(w) = (X,Y)
```
## Rotational component - [Desmos](https://www.desmos.com/calculator/xmafflyzp0)

The rotational component is a bit more complex. 

```
Perpendicular Vector:
p(m) = (-m.y, m.x)
w(m)= R \* p(m)
```
It is made up of a vector pointing perpendicular to the module's location and the center of rotation, with a magnitude of the angular velocity (rad/sec). Because it is based on angular velocity, the strength of this component increases with its distance from the center of rotation. We are essentially just getting the length of the lever arm (the distance of the module from the center of rotation), rotating it by 90 degrees, and applying our angular velocity to get the torque vector that will make the robot spin at that angular velocity.

## Output - [Desmos](https://www.desmos.com/calculator/sklqbjp8ed)

Bringing this all together, we add the translational component and the rotational component to get our output.

```
o(m) = t(m) \+ w(m)
```
As swerve relies on rotating a wheel powered by a motor, we have to get the polar components of the output vector. The magnitude of the output vector is the power of the motor, and the angle of the output vector is the angle of the swerve module from horizontal.

## Clamping - [Desmos](https://www.desmos.com/calculator/p2cqmsxate)

But as you notice, when we get the magnitude of the output vector, its max magnitude at certain angles is bigger than at other angles. This isn’t realistic to true swerve pods, where the max magnitude is constant (the max power of the motor, typically 1)

The most common way to do this is to divide all the output magnitudes by the biggest magnitude, unless they are all below the maximum wanted output (1), where 1 would be the max

```
oc(m) = o(m)/co
co = max(1,|o(m1)|, |o(m2)|, |o(m3)|, |o(m4)|)
```
We can also use this same method with clamping the translational and rotational components, but it isn’t strictly necessary.

The article on the FRC Swerve offers other ways to clamp and additional tips. Everything before this was all part of that article, but everything after was made by Marco Fissore from 30596 to make it compatible with more robot designs

## The Problem - [Desmos](https://www.desmos.com/calculator/kbouaxkk0j)

The problem with the math is shown through the rotational component. Assuming a module is very, very far away from the origin, the motor needs to spin extremely fast in order to keep the input angular velocity. As motors have an upper limit, this speed will never be reached, making the robot not spin at the input angular velocity. It is also a problem if the max speed of the motor can’t even reach the max speed of the input translation vector. This is due to the units of the speed, which typically isn’t a problem, as the motors in FTC are more than powerful enough for the size constraints. However, if the battery voltage drops too much, the motors suddenly can’t reach these speeds due to not having enough battery power. On the coding side, it also required using the DcMotorEx library in order to run the motors at these speeds (Setting motor speed directly, not the power)

### Other Drivetrains

Other drivetrains counteract this by opting to make the inputs in terms of max motor power. So the translation input vector would go from being in m/s to the maximum power of the motor. The rotational input would go from angular velocity to translational velocity (Max power perpendicular to the origin to apply a torque to spin the robot). We can look at mecanum as an example. Going all the way forward is running all the motors at their maximum power. Turning one way all the way just makes the motors run at full in that rotation. This doesn’t actually change our math that much, as the translational vector just uses the same units as the input vector. But the rotational component’s magnitude comes from the module's distance from the origin. We would fix this by dividing the whole rotation function by the distance of the module from the origin.

```
w(m) = (R \* p(m))/|m|
```
 This essentially allows us to place our modules at any distance from the center of rotation, as long as all the modules share the same distance. 

## Arbitrary shapes - [Desmos](https://www.desmos.com/calculator/zjrudsfgri)

If there was a certain design that required us to have modules at different distances from the center of rotation, the standard math up to this point wouldn’t work. There are also some shapes that will disrupt this math. Triangles are one example. When the triangle drivetrain strafes, it begins to spin. This is because one side has more torque than the other, causing it to spin. The easiest way to tell if your robot will spin during translation movement due to the math is to draw lines between two opposite swerve modules. If the midpoints of all the lines align on the center of rotation, you are good.

From this point on, the Desmos will now swap between the 4 module rectangular swerve and the triangle swerve.

### Finding the Torque for each module - [Desmos](https://www.desmos.com/calculator/vglg1pmgsh)

To find the torque for each module, we need to first understand how this torque is made. When a module is offset from the center of rotation, every translation movement makes the robot rotate due to the module essentially becoming the end of a lever arm. If we look at the physics torque equation, `𝜏 = r \* F \* sin(θ)`, when a force (the module's translational movement) acts on a lever arm of length r (the module's distance from the origin) and the perpendicular component of the force (All of the force if it is perpendicular to the lever arm, 0% of force when it is parallel - take form in the `sin(θ)`function)

![](https://whimuc.com/F5sVSZKWT4ExNohrJrASR8/B1jvShmowAhEEX.webp)
To start, we first need to get the torque component of the translational vector. If we make a right triangle where the hypotenuse line is the translational vector, and the base is on the perpendicular vector, the height will be the same as the `sin(θ)` part of the torque equation.

![](https://whimuc.com/F5sVSZKWT4ExNohrJrASR8/BER1JZniwcvWL5.webp)
So the height is `= sin(θ)` And we just need to find `θ`. For torque, it will be the angle that the translation vector is from the perpendicular line.  However, since the torque vector is not stationary when we move the module, but keep the same translation, we have to use the angle the perpendicular vector is from the translational vector. We also need to multiply the sin function by the perpendicular vector, as the sin function essentially gives a percentage of the maximum torque, which is in the same direction as the perpendicular vector

```
T(a) = sin(arctan(t(a.y,t(a).x)-arctan(a.y,a.x))\*p(a)
```
The problem with this is that when the rotation is zero, the output is clamped, but the translation vector isn’t. We can’t use the clamped output instead of the translational vector, as when rotation is added, the torque will be messed up. Instead, we have to clamp the translation vector.

```
tc(m) = t(m)/ct
ct = max(1,|t(m1)|, |t(m2)|, |t(m3)|, |t(m4)|)
T(a) = sin(arctan(tc(a).y,tc(a).x)-arctan(a.y,a.x))\*p(a)
```
This now gives us the location of the torque vector in relation to the given module. Messing around with the [Desmos](https://www.desmos.com/calculator/xte2i9s2dj), you will figure out that the torque vector doesn’t scale to the translation vector. All we have to do is scale it down based on the magnitude of the clamped translation vector

```
T(a) = |tc(a)|\*sin(arctan(tc(a).y,tc(a).x)-arctan(a.y,a.x))\*p(a)
```
And voila, we get the torque for each module

### Adding up the Torques - [Desmos](https://www.desmos.com/calculator/cujwa53xtx)

In order to get the total torque acting on the robot, we can literally just add up all the torques. However, as T(a) gives back the torque in relation to the module, we need to make sure that T(a) is multiplied by the sign of the location of the module in both the X and Y axes so that the torques can cancel out if they are applied on different sides of the center of rotation. 

```
Tnet = (T(m1)\*sign(m1))\+(T(m2)\*sign(m2))\+(T(m3)\*sign(m3))\+(T(m4)\*sign(m4))
```
However, this doesn’t work in desmos. The desmos notation is a bit longer as you have to split each point into its x and y components. But you can combine each module into one variable and use the total function as a shortcut.

```
m = \[m1,m2,m3,m4\]
Tnet = total(m\+T(m).x\*sign(m.x),T(m).y\*sign(m.y))
```
This gives us the direction of the rotation of the Torque. On the [Desmos](https://www.desmos.com/calculator/7a8m2oiqdr), the net torque adds up in the direction of the translational movement. When there are perfectly canceled out torques, the net torque stays on the translational vector. In order to get the rotation amount, we can make another triangle, where the hypotenuse is the line between the center of rotation and the net torque, and the base is on the line perpendicular to the translation vector. The point where the base ends (where the height hits the perpendicular line) is the total amount of torque we need to counteract. 

![](https://whimuc.com/F5sVSZKWT4ExNohrJrASR8/2w1QuQnnQwQAHp.webp)
```
Tf(a) = sin(arctan(Tnet.y,Tnet.x))-arctan(Y,X))\*|Tnet|
```
There are multiple ways to stop the rotation from here. We can either make the modules rotate against the torque, or we make the modules making the excess torque slow down. If We slow down the motors, we lose speed, but if we rotate against the torque we can keep a lot more speed. In order to do this, we can divide this torque by the number of modules we have. 

```
Tf(a) = (sin(arctan(Tnet.y,Tnet.x))-arctan(Y,X))\*|Tnet|)/n
```
We then need to apply it to the perpendicular vector for each module

```
Tf(a) = (sin(arctan(Tnet.y,Tnet.x))-arctan(Y,X))\*|Tnet|\*p(a))/n
```
And then we counteract the lever arm distance that the perpendicular function brings in

```
Tf(a) = (sin(arctan(Tnet.y,Tnet.x))-arctan(Y,X))\*|Tnet|\*p(a))/(n\*|a|)
```
Then, we add the torque to the output function

```
o(m) = t(m) \+ w(m) \+ Tf(m)
```
### Scaling by Distance - [Desmos](https://www.desmos.com/calculator/vbltivilvt)

While accounting for the torque, the additions don’t solve the problem of modules being at different distances from the Center of Rotation. Luckily, we can just add another clamping system. Because the closest module has the lowest amount of torque, we want it to be the highest motor output. Because the torque already solves this for translational movement, we just need to apply it to the rotation component. So, in the rotational component, we multiply everything by the smaller module distance divided by the current module's distance

```
w(m)= ((R \* p(m)\*min(|m1|,|m2|,|m3|,|m4|))/(|m|\*|m|)
```
Because we are not clamping off the distance a module is from the center of rotation, when we insert modules, their units should be relative to each other.

## The advantages of this system

Compared to normal swerve libraries, this system, with the torque and clamping, provides greater flexibility when designing, allowing for swerve modules to be placed literally anywhere and still work.

# Building the code - In Development

While the math works for the visualizer, it can become a whole lot more streamlined in code with actual vector manipulation.

