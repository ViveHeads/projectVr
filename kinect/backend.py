# -*- coding: utf-8 -*-
from os import path
from werkzeug.routing import Map, Rule
from werkzeug.wrappers import Request, Response
from werkzeug.wsgi import ClosingIterator, SharedDataMiddleware
from werkzeug.exceptions import HTTPException, NotFound
from gevent.pywsgi import WSGIServer
from io import BytesIO
import logging
import numpy as np
import sqlite3
import cv2, os
#: path to shared data
# SHARED_DATA = path.join(path.dirname(__file__), 'shared')

from werkzeug.wsgi import SharedDataMiddleware
from werkzeug.contrib.fixers import HeaderRewriterFix

class WebApp(object):

    def __init__(self):
        self.log = logging.getLogger(__name__)
        self.log.info('webapp initialized')

    def __call__(self, environ, start_response):
        return self.wsgi_app(environ, start_response)

    def wsgi_app(self, environ, start_response):
        request = Request(environ)
        response = self.dispatch_request(request)
        return response(environ, start_response)

    def dispatch_request(self, request):
        adapter = self.url_map.bind_to_environ(request.environ)
        try:
            endpoint, values = adapter.match()
            method = getattr(self, 'endpoint_{}'.format(endpoint))
            return method(adapter, request, **values)
        except HTTPException as e:
                return e

    url_map = Map([])

conn = sqlite3.connect('test.db')
c = conn.cursor()

from PIL import Image
from itertools import cycle
alright = cycle(xrange(1, 31))
spheres = cycle(['../assets/' + x for x in os.listdir('../assets') if 'JPG' in x])

class SnapShots(WebApp):

    def endpoint_get_image(self, adapter, request, **values):
        (rgb, ) = c.execute('select rgb from snapshot where id={}'.format(next(alright)))
        # rgb = np.fromstring(rgb[0], dtype=np.uint8)
        with open(rgb[0], 'rb') as f:
            return Response(f.read(), status=200)

    def endpoint_get_sphere(self, adapter, request, **values):
        s = next(spheres)
        with open(s, 'rb') as f:
            return Response(f.read(), status=200)

    url_map = Map([
            Rule('/get_image', endpoint='get_image', methods=['GET']),
            Rule('/get_sphere', endpoint='get_sphere', methods=['GET'])
        ])

app = SharedDataMiddleware(SnapShots(), {
        '/': '../assets'
    }, cache=True)
app = HeaderRewriterFix(app, add_headers=[('Access-Control-Allow-Origin', '*'), ('Content-Security-Policy', '*')])

http = WSGIServer(('0.0.0.0', 8080), app)
http.serve_forever()


