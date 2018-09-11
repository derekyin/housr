# housr - PennApps

housr is a web application that helps you find better housing. Using postings scraped from Kijiji, we applied machine learning on posting images to assign ratings to every posting. Then, the application would sort the postings by the rating, cost, and location to show the user the best posting.

We rated 600 images of apartments to create our training dataset, and used image augmentation to create even more. The first model was trained using a deep convolutional network, but was unable to create accurate ratings due to a small training dataset. The second method used GoogleNet Inception v2 model, pretrained on the ImageNet dataset problem. We took the classification results and ran it through another neural net to finally display a rating, with much better results that the first model.

The backend server was created in node.js/express.js, featured a Firebase database for login as well as Google Cloud Platform Maps API to determine location distances. The frontend used Bootstrap, jQuery for responsive design, and also enabled easy location searching with Google Maps Place API.

housr also allows quick and secure lease signed via Docusign.
