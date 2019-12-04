from flask import Blueprint

index_route = Blueprint('index', __name__)


@index_route.route('/')
def func():
    return "hello index"
