import { Collection } from "@/types/collection";
import CollectionModel from "../models/CollectionModel";
import DBConnection from "@/lib/dbConfig";

export const saveCollection = async (collection: Collection) => {
  await DBConnection.connect();
  const newCollection = await CollectionModel.create(collection);
  return newCollection;
};

export const findCollectionById = async (id: string) => {
  await DBConnection.connect();
  const collection = await CollectionModel.findOne({ id }).lean();
  return collection as unknown as Collection;
};

export const getCollections = async (page: number, pageSize: number) => {
  await DBConnection.connect();
  const collections = await CollectionModel.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  const total = await CollectionModel.countDocuments();
  return { collections, total, page, pageSize };
};

export const getUserCollections = async (userId: string) => {
  await DBConnection.connect();
  
  const collections = await CollectionModel.find({ authorId: userId })
    .sort({ updatedAt: -1 })
    .lean();
    
  return collections;
};

export const deleteCollectionById = async (id: string) => {
  await DBConnection.connect();
  return CollectionModel.deleteOne({ id });
};

export const updateCollection = async (collectionId: string, updates: Partial<Collection>) => {
  await DBConnection.connect();
  
  const updatedCollection = await CollectionModel.findOneAndUpdate(
    { id: collectionId },
    { ...updates, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return updatedCollection;
};

export const addQuizToCollection = async (collectionId: string, quizId: string) => {
  await DBConnection.connect();
  
  const collection = await CollectionModel.findOneAndUpdate(
    { id: collectionId },
    { $addToSet: { quizIds: quizId }, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return collection;
};

export const removeQuizFromCollection = async (collectionId: string, quizId: string) => {
  await DBConnection.connect();
  
  const collection = await CollectionModel.findOneAndUpdate(
    { id: collectionId },
    { $pull: { quizIds: quizId }, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  return collection;
};