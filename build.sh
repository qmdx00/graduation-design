#!/bin/bash
# 构建项目依赖并运行项目

function start_project() {
    docker-compose up -d
}

docker images | grep handwriting-serving &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mhandwriting-serving image exist\033[0m"
else
    cd train && bash build.sh && cd ..
fi

docker images | grep flask-server &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "\033[32mflask-server image exist\033[0m"
else
    cd server && bash build.sh && cd ..
fi

echo -e "\033[32mlaunching project ......\033[0m"
start_project
echo -e "\033[32mRunning on http://127.0.0.1:5000\033[0m"