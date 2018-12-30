#!/usr/bin/env python3
"""
Demonstration of a linear Bézier curve.
"""
from matplotlib import pyplot
from matplotlib.animation import FuncAnimation
from numpy import linspace
import sys

# 3 points define the curve:
p0 = [0,  0]   # [x, y]
p1 = [3,  4]

# number of points on the curve to draw:
N = 96

# output file name:
gifname = 'linear.gif'

# store coordinates of the points on the curve as we calculate them:
x = []
y = []

# set up animation in matplotlib
pyplot.rc('text', usetex=True)
fig, axis = pyplot.subplots()
axis.set_axis_off()

# control points:
p, = pyplot.plot([p0[0], p1[0]], [p0[1], p1[1]], 'o-', 
        c='#999999', animated=True, alpha=.5)
# bézier curve:
b, = pyplot.plot([], [], '-', c='magenta', animated=True, alpha=1)
# current point on curve:
b_pt, = pyplot.plot([], [], 'o', c='magenta', animated=True, alpha=1)

axis.text(p0[0] - 0.25, p0[1] - 0.25, "$P_0$")
axis.text(p1[0], p1[1] + 0.1, "$P_1$")
axis.text(0, 1,
        "$\\mathbf{B}(t) = (1 - t)\\mathbf{P}_0 + t\\mathbf{P}_1$",
        transform=axis.transAxes
        )

btext = axis.text(0, 0, '', animated=True)
ttext = axis.text(0, 0, '', animated=True)

def bezier(t):
    """
    Calculate one frame of the animation
    t should vary from 0 to 1
    """
    # interpolate between p0 and p1 to find point b (next point on curve)
    bx =  (1- t) * p0[0] + t * p1[0]
    by =  (1 -t) * p0[0] + t * p1[1]
    x.append(bx)
    y.append(by)

    # update labels:
    ttext.set_position((3, 0))
    ttext.set_text("t="+str(t.round(2)))

    btext.set_position((bx, by + 0.1))
    btext.set_text("$B$")

    # update animation:
    b_pt.set_data(bx, by)
    b.set_data(x, y)
    return (b_pt, b, p, btext)


gif = FuncAnimation(fig, bezier, frames=linspace(0, 1, num=N),
        blit=False, repeat=False)
sys.stderr.write('Writing to "{}"...\n'.format(gifname))
gif.save(gifname, writer='imagemagick', fps=24)
