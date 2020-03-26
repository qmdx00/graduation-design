FROM python:3.7-slim

WORKDIR /app

COPY . /app

RUN sed -i "s@http://.*.debian.org@https://mirrors.aliyun.com@g" /etc/apt/sources.list && \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y libglib2.0-0 libsm6 libxext6 libxrender-dev

RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python", "app.py"]