#!/usr/bin/env python3
"""
Demonstration of a cubic Bézier curve.
"""
from matplotlib import pyplot
from matplotlib.animation import FuncAnimation
from numpy import linspace
import sys

# 4 control points define the curve:
p0 = [-0.1,  0.5]   # [x, y]
p1 = [4.2,  4.3]
p2 = [4.8, 1.2]
p3 = [8.3, 3.4]

# number of points on the curve to draw:
N = 96

# output file name:
gifname = 'cubic.gif'

# store coordinates of the points on the curve as we calculate them:
x = []
y = []

# set up animation in matplotlib
pyplot.rc('text', usetex=True)
fig, axis = pyplot.subplots()
axis.set_axis_off()

# control points:
p, = pyplot.plot([p0[0], p1[0], p2[0], p3[0]], [p0[1], p1[1], p2[1], p3[1]], 
        'o-', c='#999999', animated=True, alpha=0.5)
axis.text(p0[0] - 0.25, p0[1] - 0.25, "$P_0$")
axis.text(p1[0], p1[1] + 0.1, "$P_1$")
axis.text(p2[0], p2[1] - 0.2, "$P_2$")
axis.text(p3[0] + 0.1, p3[1], "$P_3$")
#axis.text(-0.5, max((p0[1], p1[1], p2[1])) + 0.25,
axis.text(0, 1,
        "\\begin{eqnarray*}"
        "\mathbf{B}(t) &=& (1-t)^3\mathbf{P}_0 + 3(1-t)^2t\mathbf{P}_1+"
        "3(1-t)t^2\mathbf{P}_2+t^3\mathbf{P}_3\\\\"
        "&=& (1-t)^2\mathbf{Q}_0 +"
        "2(1-t)t\mathbf{Q}_1+ t^2\mathbf{Q}_2 \\\\"
        "&=& (1-t)\mathbf{R}_0+ t\mathbf{R}_1 "
        "\\end{eqnarray*}",
        transform=axis.transAxes
        )

# other lines 
q0, = pyplot.plot([], [], 'o-', c='cyan', animated=True, alpha=0.33)
q1, = pyplot.plot([], [], 'o-', c='cyan', animated=True, alpha=0.33)

q0text = axis.text(0, 0, '', animated=True)
q1text = axis.text(0, 0, '', animated=True)
q2text = axis.text(0, 0, '', animated=True)

r, = pyplot.plot([], [], 'o-', c='gold', animated=True, alpha=.6)
r0text = axis.text(0, 0, '', animated=True)
r1text = axis.text(0, 0, '', animated=True)

# bézier curve:
b, = pyplot.plot([], [], '-', c='magenta', animated=True)
# current point on curve:
b_pt, = pyplot.plot([], [], 'o', c='magenta', animated=True)
btext = axis.text(0, 0, '', animated=True)

# time point text:
ttext = axis.text(0, 0, '', animated=True)

def bezier(t):
    """
    Calculate one frame of the animation
    t should vary from 0 to 1
    """
    # q0 lies t steps along line from p0 to p1
    q0x = p0[0] + t * (p1[0] - p0[0])
    q0y = p0[1] + t * (p1[1] - p0[1])
    
    # q1 lies t steps along line from p1 to p2
    q1x = p1[0] + t * (p2[0] - p1[0])
    q1y = p1[1] + t * (p2[1] - p1[1])
    
    # q1 lies t steps along line from p2 to p3
    q2x = p2[0] + t * (p3[0] - p2[0])
    q2y = p2[1] + t * (p3[1] - p2[1])

    # interpolate between q0 and q1 to find point r0
    r0x =  t * q1x + (1 - t) * q0x
    r0y =  t * q1y + (1 - t) * q0y
    
    # interpolate between q1 and q2 to find point r1
    r1x =  t * q2x + (1 - t) * q1x
    r1y =  t * q2y + (1 - t) * q1y
    
    # interpolate between q1 and q2 to find point r1
    bx =  t * r1x + (1 - t) * r0x
    by =  t * r1y + (1 - t) * r0y

    x.append(bx)
    y.append(by)

    # update labels:
    ttext.set_position((0, 0))
    ttext.set_text("t="+str(t.round(2)))

    btext.set_position((bx, by + 0.1))
    btext.set_text("$B$")

    q0text.set_position((q0x - 0.35, q0y))
    q0text.set_text("$Q_0$")

    q1text.set_position((q1x + 0.1, q1y))
    q1text.set_text("$Q_1$")

    q2text.set_position((q2x + 0.1, q2y))
    q2text.set_text("$Q_2$")
    
    r0text.set_position((r0x - 0.35, r0y))
    r0text.set_text("$R_0$")

    r1text.set_position((r1x + 0.1, r1y))
    r1text.set_text("$R_1$")

    # update animation:
    b.set_data(x, y)
    b_pt.set_data(bx, by)
    q0.set_data([q0x, q1x], [q0y, q1y])
    q1.set_data([q1x, q2x], [q1y, q2y])
    r.set_data([r0x, r1x], [r0y, r1y])
    return (p, q0, q1, r, b, b_pt, btext,
            q0text, q1text, q2text, r0text, r1text)

# Save a GIF:
gif = FuncAnimation(fig, bezier, frames=linspace(0, 1, num=N),
        blit=True, repeat=False)
sys.stderr.write('Writing to "{}"...\n'.format(gifname))
gif.save(gifname, writer='imagemagick', fps=24)
