#!/bin/bash
# 利用 python:3.7-slim 镜像来构建 flask-serving 镜像，部署web服务

function pull_python_slim() {
    docker pull python:3.7-slim
}

function build_flask_server() {
    docker build -t flask-server .
    if [ $? -eq 0 ]; then
        echo -e "\033[32mbuild flask-server successed\033[0m"
    else
        echo -e "\033[31mbuild flask-server failed\033[0m"
        pull_python_slim
fi
}

# pull image python:3.7-slim
docker images | grep python &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mpython:3.7-slim image already exist\033[0m"
else
    echo -e "\033[31mpython:3.7-slim image not exist, pulling ......\033[0m"
    pull_python_slim
fi

# build image flask-server
docker images | grep flask-server &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mflask-server image exist\033[0m"
else
    echo -e "\033[31mflask-server image not exist, building ......\033[0m"
    build_flask_server
fi