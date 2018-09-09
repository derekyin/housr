import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"   # see issue #152
os.environ["CUDA_VISIBLE_DEVICES"] = '-1'

import numpy as np
import h5py
import sys
import json
import urllib.request
import cv2

def url_to_img(url):
	resp = urllib.request.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype='uint8')
	image = cv2.imdecode(image, cv2.IMREAD_GRAYSCALE)
	image = cv2.resize(image, dsize=(50, 50), interpolation=cv2.INTER_CUBIC)
	return image

def main():
	#receive data from node backend
	url_string = sys.argv[1].replace('[', '').replace(']', '').replace("\"", '')
	#json_urls should be a list of lists
	urls = url_string.split(',')

	predictions = list()
	for url in urls:
		image = url_to_img(url)
		predictions.append(image)

	mean = np.mean(predictions)/255.0
	if mean > 0.25 and mean < 0.5:
		mean = 1-(mean*2)
	elif mean > 0.5 and mean < 0.75:
		mean = ((mean-0.5) * 2) + 0.5
	print(mean)
	#print(urls[0])
	#print(sys.argv[1])
	sys.stdout.flush()

if __name__ == '__main__':
	main()