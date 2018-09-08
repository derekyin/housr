import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img

#constants
batch_size = 1

train_datagen = keras.preprocessing.image.ImageDataGenerator(
	rotation_range=30.,
	width_shift_range=0.2,
	height_shift_range=0.2,
	rescale=1./255,
	shear_range=0.2,
	zoom_range=0.2,
	horizontal_flip=True,
	fill_mode='nearest'
	)

test_datagen = keras.preprocessing.image.ImageDataGenerator(
	rescale=1./255,
	)

train_generator = train_datagen.flow_from_directory('train', target_size=(200,150), batch_size=batch_size)

test_generator = test_datagen.flow_from_directory('validation', target_size=(200,150), batch_size=1)

#x_train, x_test = x_train/255.0, x_test/255.0
#y_train, y_test = keras.utils.to_categorical(y_train), keras.utils.to_categorical(y_test)

model = keras.models.Sequential()

model.add(keras.layers.Conv2D(64,(4,4), padding='same', activation='relu', input_shape=(200,150,3)))
model.add(keras.layers.Conv2D(64,(4,4), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
#model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Conv2D(128,(4,4), padding='same', activation='relu'))
model.add(keras.layers.Conv2D(128,(4,4), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
#model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Conv2D(256,(4,4), padding='same', activation='relu'))
model.add(keras.layers.Conv2D(256,(4,4), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
#model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Flatten())
model.add(keras.layers.Dense(1024, activation='relu'))
#model.add(keras.layers.Dropout(0.5))
model.add(keras.layers.Dense(3, activation='softmax'))

print(model.summary())

model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=['accuracy'])

save_model = keras.callbacks.ModelCheckpoint(".\\ModelWeights\\weights.{epoch:02d}-{val_loss:.2f}.hdf5")
earlyStop = keras.callbacks.EarlyStopping(min_delta=0.001, patience=2)

# history = model.fit(x_train, y_train, epochs=5, batch_size=256, validation_data=(x_test, y_test))
# history = model.fit_generator(datagen.flow(x_train, y_train, batch_size=batch_size),
# 								steps_per_epoch = int(np.ceil(10/float(2)))
# 								epochs=10, validation_data=(x_test, y_test))

history = model.fit_generator(train_generator, steps_per_epoch=int(np.ceil(10/float(batch_size))), epochs=100, validation_data=test_generator, validation_steps=1)

model.save_weights('weights1.h5')

plt.figure(figsize=[8,6])
plt.plot(history.history['loss'],'r',linewidth=3.0)
plt.plot(history.history['val_loss'],'b',linewidth=3.0)
plt.legend(['Training loss', 'Validation Loss'],fontsize=18)
plt.xlabel('Epochs ',fontsize=16)
plt.ylabel('Loss',fontsize=16)
plt.title('Loss Curves',fontsize=16)
plt.show()
 
# Accuracy Curves
plt.figure(figsize=[8,6])
plt.plot(history.history['acc'],'r',linewidth=3.0)
plt.plot(history.history['val_acc'],'b',linewidth=3.0)
plt.legend(['Training Accuracy', 'Validation Accuracy'],fontsize=18)
plt.xlabel('Epochs ',fontsize=16)
plt.ylabel('Accuracy',fontsize=16)
plt.title('Accuracy Curves',fontsize=16)
plt.show()