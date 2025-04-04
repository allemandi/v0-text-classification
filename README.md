# v0-text-classification
text classification proof of concept from v0.dev

## Purpose
This repo is an experiment to show v0.dev can build a text classification applciation from scratch.

The original prompt specified naive bayes classifier packages such as [wink-naive-bayes-text-classifier](https://www.npmjs.com/package/wink-naive-bayes-text-classifier), but v0 failed to implement such packages correctly.
By version 6 of requests to fix functionality, v0 decided to remove external algorithm package dependencies and created a custom implementation of a simple naive bayes classifier algorithm.

## Prompt
Therefore, an adjusted v0.dev working prompt can be something similar to the below:

```
Implement a text classification app with a custom Naive Bayes Classifier algorithm, displaying one table and one large free text field. Ensure full functionality based on the below:
- The table is a training table, where the user can input text in one column and the category in the second column. There should be a save button to train and understand the probable category based on the Naive Bayes Classifier algorithm.
- In the free text field, the user should be able to input free text and click Submit. When the user clicks submit, a predicted category should be displayed based on the training table.
```

## Executing the Application
- Clone repo into local directory
- Run `yarn install` to download dependencies
- Run `yarn dev`
- Open `http://localhost:3000` on your local browser

## Getting Started with Text Classification
- In the training table, enter text examples and the category, then click Add Example
- Once there are enough samples, click Train Model
- In the Prediction field, enter text and click Predict Category

## Potential Contributions / Improvements
Ideas that can further improve upon this concept include:
- Better algorithm
  - If retaining the original Naive Bayes Classifier methods, then obvious improvements needed towards tokenization, text cleaning/processing
- Better training data management for input / upload
- Better deployment
