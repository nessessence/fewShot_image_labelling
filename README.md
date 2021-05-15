# fewShot_image_labelling

We are making our own labelling platform based on few shot learning. We aim to help everyone speed up their labelling process for image classification task.

With few shot learning, we can use small batch of labelled images (support set) to compute the classes probability of your unlabelled images (query set).

Take a look at our preview here to see if this platform can fill your need. We hope this can help!.

## Contents
1. [Features](#features)
2. [Model](#model)
3. [Installation](#installation)
4. [Citation](#citation)
5. [License](#license)

## Features

We provided both pre-trained model and platform to help you speed up the image labelling process. We will guide you through the application demo.

1. Move your dataset into the /dataroot in project folder (see more in [Installation](#installation)). You should structure your folder as shown below.

        dataset_folder/
        ├── class_name_1
        │   ├── 1.png
        │   └── 2.png
        ├── class_name_2
        │   ├── 3.png
        │   └── 4.png
        └── query
            ├── 5.png
            └── 6.png

![inst2](https://user-images.githubusercontent.com/42630588/118369697-90133380-b5ce-11eb-91ce-8e5eda7f0256.JPG)
![plat_upload](https://user-images.githubusercontent.com/42630588/118367214-2ba2a500-b5cb-11eb-883c-9919c0711781.JPG)

2. The **support set** is the set of labelled images of any number which you can prepare before uploading or manually label and add to the set later. 

![plat_support](https://user-images.githubusercontent.com/42630588/118365579-876b2f00-b5c7-11eb-9dbe-a0ac670bb725.JPG)

3. The **query set** is the set of your unlabelled images.

![plat_query](https://user-images.githubusercontent.com/42630588/118365576-85a16b80-b5c7-11eb-8ea3-808ea34e61a0.JPG)

4. Click on the image to manually label it. If you are labelling the **query set**, the platform load new image for you to label after each labelling to help you speed up. You can label any image again anytime if you want to edit it. Labelled images will move to the **labelled** tab.

![plat_manual](https://user-images.githubusercontent.com/42630588/118365581-8803c580-b5c7-11eb-95a3-32a9c6d7dfd5.JPG)

5. The **recompute** function help compute the probability of image classes from the **support  set** and suggest the image class to you.

![plat_recompute](https://user-images.githubusercontent.com/42630588/118365580-8803c580-b5c7-11eb-967f-429d6b61852d.JPG)
![plat_manual_with_score](https://user-images.githubusercontent.com/42630588/118365582-889c5c00-b5c7-11eb-9570-b85c8e698001.JPG)

6. You can also use **autolabel** function to automatically label every image with suggested score higher than your own threshold

![plat_autolabel](https://user-images.githubusercontent.com/42630588/118365578-86d29880-b5c7-11eb-9112-684294841af6.JPG)

7. The **labelled** set are images you label, separated between manually label by you or using the **autolabel** function. Pressing the **add to support** button will move images of that set to the support set. You can use **recompute** function again to improve the accuracy after the support set grew bigger. The **add to support** button also move your files from /query folder to the labelled class folder.

![plat_labelled](https://user-images.githubusercontent.com/42630588/118365583-889c5c00-b5c7-11eb-8a91-19fe58b08f02.JPG)

## Model

(..brief information about the model..)

visit this [repository](https://github.com/nessessence/SSL-FEW-SHOT) to see code and model details

## Installation

### Requirement

1. Linux
2. CUDA 11.0
3. Docker
4. Docker-compose
5. Pytorch 1.8.1

We're using AWS EC2 Deep Learning AMI (Ubuntu 18.04) Version 43.0 Image

model weight is in this [URL](https://drive.google.com/file/d/13uXdGpwJCPgu4ECg5cy_MVxRR5tPZIWC/view?usp=sharing)

Demo dataset "LHIAnimalFace_Endangered" is in this [URL](https://drive.google.com/file/d/1puEjfSZrkx3IB3BRIIbCgirnk-4Ba3tA/view?usp=sharing)

Install docker-compose from this [documentation](https://docs.docker.com/compose/install/)

1. Clone this repository

        git clone https://github.com/nessessence/fewShot_image_labelling.git

3. move model weight file to fewShot_image_labelling/back-end/
4. move demo dataset directory to fewshot_image_labelling/back-end/dataroot/
5. in case you're not running this application on localhost, edit fewshot_image_labelling/front-end/src/services/index.tsx to the IP of your instance

![inst](https://user-images.githubusercontent.com/42630588/118369606-2b57d900-b5ce-11eb-9457-b731e3c7e410.JPG)

6. run the following command

        docker-compose build
        docker-compose -d

## Citation

    @article{chen2019selfsupervised,
      title={Self-Supervised Learning For Few-Shot Image Classification},
      author={Da Chen and Yuefeng Chen and Yuhong Li and Feng Mao and Yuan He and Hui Xue}
      Journal={arXiv preprint arXiv:1911.06045},
      year={2019}
    }

## License

[MIT](LICENSE)
