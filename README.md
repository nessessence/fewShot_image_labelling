# fewShot_image_labelling

(..intro about the project..) image_labelling platform using few-shot learning approach

## Contents
1. [Model](#model)
2. [Features](#features)
3. [Installation](#installation)
4. [Citation](#citation)
5. [License](#license)

## Model

(..brief information about the model..)

visit this [repository](https://github.com/nessessence/SSL-FEW-SHOT) to see code and model details

## Features

(..platform features..)

## Installation

We're using AWS EC2 Deep Learning AMI (Ubuntu 18.04) Version 43.0 Image

model weight is in this [URL](https://drive.google.com/file/d/13uXdGpwJCPgu4ECg5cy_MVxRR5tPZIWC/view?usp=sharing)

Demo dataset "LHIAnimalFace_Endangered" is in this [URL](https://drive.google.com/file/d/1puEjfSZrkx3IB3BRIIbCgirnk-4Ba3tA/view?usp=sharing)

Install docker-compose from this [documentation](https://docs.docker.com/compose/install/)

1. Clone this repository
2. move model weight file to fewShot_image_labelling/back-end/
3. move demo dataset directory to fewshot_image_labelling/back-end/dataroot/
4. in case you're not running this application on localhost, edit fewshot_image_labelling/front-end/src/services/index.tsx to the IP of your instance
5. docker-compose build
6. docker-compose -d

### Requirement

1. Linux
2. CUDA 11.0
3. Docker
4. Docker-compose
5. Pytorch 1.8.1

### Option 1) running locally

(....)

### Option 2) running on docker container

(....)

## Citation

    @article{chen2019selfsupervised,
      title={Self-Supervised Learning For Few-Shot Image Classification},
      author={Da Chen and Yuefeng Chen and Yuhong Li and Feng Mao and Yuan He and Hui Xue}
      Journal={arXiv preprint arXiv:1911.06045},
      year={2019}
    }

## License

(....)
