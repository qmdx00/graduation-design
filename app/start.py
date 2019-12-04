from flask import Flask

from app import *

"""
project start:

    @description: based flask and scrapy graduation design
    @author: yuanweimin
    @data: 2019/12/04
"""
app = Flask(__name__)
app.register_blueprint(hello_route, url_prefix='/hello')
app.register_blueprint(index_route, url_prefix='/')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
