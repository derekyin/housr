import tensorflow as tf
import numpy as np
from tensorflow import keras



x_train, x_test = x_train/255.0, x_test/255.0
y_train, y_test = keras.utils.to_categorical(y_train), keras.utils.to_categorical(y_test)

datagen = keras.preprocessing.image.ImageDataGenerator(
	rotation_range=10.,
	width_shift_range=0.1,
	height_shift_range=0.1,
	shear_range=0.,
	horizontal_flip=True
	)

model = keras.models.Sequential()

model.add(keras.layers.Conv2D(32,(3,3), padding='same', activation='relu', input_shape=(32,32,3)))
model.add(keras.layers.Conv2D(32,(3,3), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Conv2D(64,(3,3), padding='same', activation='relu'))
model.add(keras.layers.Conv2D(64,(3,3), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Conv2D(64,(3,3), padding='same', activation='relu'))
model.add(keras.layers.Conv2D(64,(3,3), activation='relu'))
model.add(keras.layers.MaxPooling2D(pool_size=(2,2), strides=(2,2)))
model.add(keras.layers.Dropout(0.25))

model.add(keras.layers.Flatten())
model.add(keras.layers.Dense(512, activation='relu'))
model.add(keras.layers.Dropout(0.5))
model.add(keras.layers.Dense(10, activation='softmax'))

print(model.summary())

model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=['accuracy'])

# history = model.fit(x_train, y_train, epochs=5, batch_size=256, validation_data=(x_test, y_test))
history = model.fit_generator(datagen.flow(x_train, y_train, batch_size=256),
								steps_per_epoch = int(np.ceil(50000/float(256)))
								epochs=10, validation_data=(x_test, y_test))

test_loss, test_acc = model.evaluate(x_test,y_test, batch_size=32)

print('Test accuracy:', test_acc)

keras.models.save('C:')


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