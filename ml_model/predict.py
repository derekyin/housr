import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"   # see issue #152
os.environ["CUDA_VISIBLE_DEVICES"] = '-1'

import tensorflow as tf
import numpy as np
import h5py
import sys
import json
import urllib.request
import cv2

def url_to_img(url):
	resp = urllib.request.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype='uint8')
	image = cv2.imdecode(image, cv2.IMREAD_COLOR)
	image = cv2.resize(image, dsize=(299, 299), interpolation=cv2.INTER_CUBIC)

	return image

def main():
	#receive data from node backend
	url_string = sys.argv[1].replace('[', '').replace(']', '')
	#json_urls should be a list of lists
	urls = url_string.split(',')

	#load saved model
	#model_json = open('./ML_Model/model.json', 'r')
	model_json = open('model.json', 'r')
	loaded_model_json = model_json.read()
	model_json.close()
	loaded_model = tf.keras.models.model_from_json(loaded_model_json)

	#loaded_model.load_weights("./ML_Model/weights1.h5")
	loaded_model.load_weights("./weights1.h5")

	loaded_model.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['accuracy'])

	all_predictions = list()
	for url in urls:
		print(url)
		image = url_to_img(url)
		image = np.expand_dims(image, axis=0)
		print(image.shape)
		prediction = loaded_model.predict(image)
		print(prediction)
		all_predictions.append(prediction)


	# print(np.mean(all_predictions))
	print('1')
	sys.stdout.flush()

if __name__ == '__main__':
	main()