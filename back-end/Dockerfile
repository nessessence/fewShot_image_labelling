FROM pytorch/pytorch:1.7.1-cuda11.0-cudnn8-runtime

RUN apt-get update
RUN apt-get -y install git wget

COPY requirements.txt /back-end/requirements.txt
RUN pip3 install --upgrade pip && pip3 install -r /back-end/requirements.txt

COPY * /back-end/
WORKDIR /back-end

RUN git clone https://github.com/nessessence/SSL-FEW-SHOT.git
RUN mv SSL-FEW-SHOT ssl_fewshot

RUN mkdir ssl_fewshot/logs
RUN mkdir ssl_fewshot/pretrained && wget https://www.dropbox.com/s/801o9e3ocqcq841/imagenet1K_ndf192_rkhs_1536_rd8_ssl_cpt.pth -P ssl_fewshot/pretrained/ -nv


EXPOSE 5001