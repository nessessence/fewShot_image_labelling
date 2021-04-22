FROM pytorch/pytorch:1.7.1-cuda11.0-cudnn8-runtime

RUN apt-get update
RUN apt-get -y install git wget

COPY requirements.txt /back-end/requirements.txt
RUN pip3 install --upgrade pip && pip3 install -r /back-end/requirements.txt

COPY * /back-end/
WORKDIR /back-end

RUN git clone https://github.com/nessessence/SSL-FEW-SHOT.git
RUN mv SSL-FEW-SHOT ssl_fewshot

RUN mkdir ssl_fewshot/logs && mkdir ssl_fewshot/pretrained
RUN mv ./modelEncoder_Ness_MINI_ProtoNet_MINI_5shot_10way_max_acc.pth ./ssl_fewshot/pretrained/


EXPOSE 5001