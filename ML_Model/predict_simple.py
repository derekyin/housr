import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"   # see issue #152
os.environ["CUDA_VISIBLE_DEVICES"] = '-1'

import numpy as np
import h5py
import sys
import urllib.request
from cv2 import imdecode,resize,INTER_CUBIC, IMREAD_GRAYSCALE

def url_to_img(url):
	resp = urllib.request.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype='uint8')
	image = imdecode(image, IMREAD_GRAYSCALE)
	image = resize(image, dsize=(50, 50), interpolation=INTER_CUBIC)
	return image

def main():
	#receive data from node backend
	url_string = sys.argv[1].replace('[', '').replace(']', '').replace("\"", '')
	#json_urls should be a list of lists
	urls = url_string.split(',')
	print(urls)
	predictions = list()
	# for url in urls:
	# 	image = url_to_img(url)
	# 	predictions.append(image)
	predictions.append(url_to_img(urls[0]))

	print(np.mean(predictions)/255.0)
	#print(urls[0])
	#print(sys.argv[1])
	sys.stdout.flush()

if __name__ == '__main__':
	main()