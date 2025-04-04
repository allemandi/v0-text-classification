"use server"

import { SimpleNaiveBayes } from './simple-naive-bayes';

export async function getNaiveBayes() {
  return new SimpleNaiveBayes();
}