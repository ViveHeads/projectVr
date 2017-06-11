#!/usr/bin/env python
from freenect import sync_get_depth as get_depth, set_led, set_tilt_degs, runloop
import random
import cv  
import numpy as np
import time
import freenect
import cv2
import frame_convert2
from io import BytesIO
global counter
from uuid import uuid4

import sqlite3, json


conn = sqlite3.connect('test.db')
c = conn.cursor()
# import pdb;pdb.set_trace()
# np.fromstring(img_str, np.uint8)

def create_tables(c):
    t = '''create table snapshot
    (id integer primary key autoincrement, rgb text, depth blob)
    '''
    c.execute(t)

def insert_snapshot(c, rgb, depth):
    c.execute("insert into snapshot (rgb, depth) values (?, ?)", (rgb, json.dumps(depth.tolist()), ))
try:
    c.execute('drop table snapshot')
except:
    pass
create_tables(c)

# def handler(signum, frame):
#     """Sets up the kill handler, catches SIGINT"""
#     global keep_running
#     keep_running = False
# import signal
# print('Press Ctrl-C in terminal to stop')
# signal.signal(signal.SIGINT, handler)

# def body(dev, ctx):
#     global led, tilt
#     while True:
#         led = random.randint(0, 6)
#         tilt = random.randint(0, 30)
#         print(led, tilt)
#         set_led(dev, led)
#         set_tilt_degs(dev, tilt)

# runloop(body=body)



def doloop(c, conn, insert_snapshot):
    global depth, rgb, counter
    counter = 0
    while True:
        # Get a fresh frame
        (depth,_) = get_depth()
        fn = './images/{}.png'.format(uuid4())
        cv2.imwrite(fn, frame_convert2.video_cv(freenect.sync_get_video()[0]))
        # Build a two panel color image
        # d3 = np.dstack((depth,depth,depth)).astype(np.uint8)
        # da = np.hstack((d3,rgb))
        # print(d3, rgb)
        # time.sleep(3)
        counter += 1
        insert_snapshot(c, fn, depth)
        (ok, ) = c.execute('select count(1) from snapshot;')
        print(ok)
        conn.commit()
        time.sleep(1)
        # Simple Downsample
        # cv.ShowImage('both', cv.fromarray(np.array(da[::2,::2,::-1])))
        # cv.WaitKey(5)
        
doloop(c,conn, insert_snapshot)

"""
IPython usage:
 ipython
 [1]: run -i demo_freenect
 #<ctrl -c>  (to interrupt the loop)
 [2]: %timeit -n100 get_depth(), get_rgb() # profile the kinect capture

"""

