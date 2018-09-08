import tensorflow as tf
import numpy as np
import h5py
import sys
import json
import urllib
import cv2

def url_to_img(url):
	resp = urllib.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype='uint8')
	image = cv2.imdecode(image, cv2.IMREAD_COLOR)

	return image

def main():
	#receive data from node backend
	json_data = json_loads(sys.argv[1])
	#json_urls should be a list of lists
	urls = json_data['image_url_list']

	#load saved model
	model_json = open('model.json', 'r')
	loaded_model_json = model_json.read()
	model_json.close()
	loaded_model = keras.models.model_from_json(loaded_model_json)

	loaded_model.load_weights("weights.h5")

	loaded_model.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['accuracy'])

	all_predictions = list()
	for url in urls:
		image = url_to_img(url)
		prediction = loaded_model.predict(image)
		all_predictions.append(prediction)


	print(np.mean(all_predictions))
	sys.stdout.flush()

if __name__ == '__main__':
	main()