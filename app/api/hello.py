from flask import Blueprint

hello_route = Blueprint('hello', __name__)


@hello_route.route('/')
def func():
    return "hello world"
