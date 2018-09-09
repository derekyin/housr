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
	#url_string = sys.argv[1].replace('[', '').replace(']', '').replace("\"", '')
	#json_urls should be a list of lists
	listings = sys.argv[1].replace('[','').replace("\"", '').split(']')
	urls = list()
	for listing in listings:
		listing_urls = listing.split(',')
		for url in listing_urls:
			temp_list = list()
			replace_url = url.replace(' ', '').replace('\'', '')
			if(len(replace_url) != 0):
				temp_list.append(replace_url)
			urls.append(temp_list)

	#load saved model
	model_json = open('../ML_Model/model.json', 'r')
	#model_json = open('model.json', 'r')
	loaded_model_json = model_json.read()
	model_json.close()
	loaded_model = tf.keras.models.model_from_json(loaded_model_json)

	loaded_model.load_weights("../ML_Model/weights1.h5")
	#loaded_model.load_weights("weights1.h5")

	loaded_model.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['accuracy'])

	all_predictions = list()
	for listing in urls:
		predictions = list()
		for url in listing:
			image = url_to_img(url)
			image = np.expand_dims(image, axis=0)
			predictions.append(loaded_model.predict(image))
		all_predictions.append(np.mean(predictions))

	print(json.dumps(all_predictions))
	sys.stdout.flush()

if __name__ == '__main__':
	main()