#!/bin/bash
# 利用 tensorflow/serving 镜像来构建 handwriting-serving 镜像，部署手写体识别服务。

function pull_tensorflow_serving() {
    docker pull tensorflow/serving:latest
}

function build_handwriting_serving() {
    docker run -d --rm --name base-serving tensorflow/serving &&
    docker cp ../models/handwriting base-serving:/models/handwriting &&
    docker commit --change "ENV MODEL_NAME handwriting" base-serving handwriting-serving
    if [ $? -eq 0 ]; then
        echo -e "\033[32mbuild success\033[0m"
        echo -e "\033[36mstop base-serving ...\033[0m"
        docker stop base-serving
    else
        echo -e "\033[31mbuild failed\033[0m"
    fi
}

# pull image tensorflow/serving
docker images | grep tensorflow/serving &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mtensorflow/serving image already exist\033[0m"
else
    echo -e "\033[31mtensorflow/serving image not exist, pulling ......\033[0m"
    pull_tensorflow_serving
fi

# build image handwriting-serving
docker images | grep handwriting-serving &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mhandwriting-serving image already exist\033[0m"
else
    echo -e "\033[31mhandwriting-serving image not exist, building ......\033[0m"
    build_handwriting_serving
fi
