#!/usr/bin/env python3
"""
Demonstration of a quadratic Bézier curve.
"""
from matplotlib import pyplot
from matplotlib.animation import FuncAnimation
from numpy import linspace
import sys

# 3 points define the curve:
p0 = [0,  0.5]   # [x, y]
p1 = [4.2,  4.3]
p2 = [7.3, 1.4]

# number of points on the curve to draw:
N = 96

# output file name:
gifname = 'quadratic.gif'

# store coordinates of the points on the curve as we calculate them:
x = []
y = []

# set up animation in matplotlib
pyplot.rc('text', usetex=True)
fig, axis = pyplot.subplots()
axis.set_axis_off()

# control points:
p, = pyplot.plot([p0[0], p1[0], p2[0]], [p0[1], p1[1], p2[1]], 'o-', 
        c='#999999', animated=True, alpha=.5)
# 
q, = pyplot.plot([], [], 'o-', c='cyan', animated=True, alpha=.33)
# bézier curve:
b, = pyplot.plot([], [], '-', c='magenta', animated=True, alpha=1)
# current point on curve:
b_pt, = pyplot.plot([], [], 'o', c='magenta', animated=True, alpha=1)

axis.text(p0[0] - 0.25, p0[1] - 0.25, "$P_0$")
axis.text(p1[0], p1[1] + 0.1, "$P_1$")
axis.text(p2[0] + 0.1, p2[1] - 0.1, "$P_2$")
axis.text(0, 1,
        "\\begin{eqnarray*}"
        "\mathbf{B}(t) &=& (1-t)^2\mathbf{P}_0 +"
        "2(1-t)t\mathbf{P}_1+ t^2\mathbf{P}_2 \\\\"
        "&=& (1-t)\mathbf{Q}_0+ t\mathbf{Q}_1 "
        "\\end{eqnarray*}",
        transform=axis.transAxes
        )

btext = axis.text(0, 0, '', animated=True)
q0text = axis.text(0, 0, '', animated=True)
q1text = axis.text(0, 0, '', animated=True)
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

    # interpolate between q0 and q1 to find point b (next point on curve)
    bx =  t * q1x + (1 - t) * q0x
    by =  t * q1y + (1 - t) * q0y
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

    # update animation:
    b_pt.set_data(bx, by)
    q.set_data([q0x, q1x], [q0y, q1y])
    b.set_data(x, y)
    return (b_pt, b, q, p, btext, q0text, q1text)


gif = FuncAnimation(fig, bezier, frames=linspace(0, 1, num=N),
        blit=False, repeat=False)
sys.stderr.write('Writing to "{}"...\n'.format(gifname))
gif.save(gifname, writer='imagemagick', fps=24)
