import toDo from "./toDo.js";
import collection from "./collection.js";
import { v4 as uuidv4 } from "uuid";

function getCollection(collectionId) {
  let collectionToGet = getItemFromStorage(collectionId);
  return restoreCollection(collectionToGet);
}

function getAllCollections() {
  let allCollections = [];
  for (let i = 0; i < localStorage.length; i++) {
    let id = localStorage.key(i);
    let currentCollection = localStorage.getItem(id);
    currentCollection = restoreCollection(currentCollection);
    allCollections.push(currentCollection);
  }
  return allCollections;
}

function createCollection(collectionBody) {
  let id = uuidv4();
  let newColleciion = collection(title, id);
  newColleciion.addDescription(collectionBody.description);
  newColleciion.addToDos(collectionBody.toDos);

  saveTolocalStorage(newColleciion);
  return newColleciion;
}

function editCollection(collectionId, editBody) {
  let collectionToEdit = restoreCollection(collectionId);
  collectionToEdit.addDescription(editBody.description);
  collectionToEdit.addTitle(editBody.title);
  collectionToEdit.addToDos(editBody.toDos);
  saveTolocalStorage(collectionToEdit);
  return collectionToEdit;
}

function deleteCollection(id) {
  localStorage.removeItem(id);
}

function restoreCollection(id) {
  let collectionFromMemory = getItemFromStorage(id);
  let recreatedCollection = collection(collectionFromMemory.title, id);
  recreatedCollection.addDescription(collectionFromMemory.description);

  collectionFromMemory.toDos.forEach((todoData) => {
    let recreatedToDo = toDo(todoData.title, todoData.id);
    recreatedToDo.addDescription(todoData.description);
    recreatedToDo.addDueDate(todoData.dueDate);
    recreatedToDo.setPriority(todoData.priority);

    recreatedCollection.addToDo(recreatedToDo);
  });

  return collectionFromMemory;
}

function createTodo(toDoBody, collectionId) {
  let newToDo = toDo(title, uuidv4());
  newToDo.addDescription(toDoBody.description);
  newToDo.addDueDate(toDoBody.dueDate);
  newToDo.setPriority(toDoBody.setPriority);

  addToCollection(newToDo, collectionId);
}

function addToCollection(newToDo, collectionId) {
  let parentCollection = restoreCollection(collectionId);
  parentCollection.addToDo(newToDo);
  saveTolocalStorage(parentCollection);
}

function deleteToDo(collectionId, toDoId) {
  let currentCollection = restoreCollection(collectionId);
  currentCollection.deleteToDo(toDoId);
  saveTolocalStorage(currentCollection);
}

function editToDo(collectionId, toDoId, editBody) {
  let currentCollection = restoreCollection(collectionId);
  let toDoToEdit = currentCollection.getToDo(toDoId);
  toDoToEdit.addTitle(editBody.title);
  toDoToEdit.addDescription(editBody.description);
  toDoToEdit.addDueDate(editBody.dueDate);
  toDoToEdit.setPriority(editBody.priority);

  saveTolocalStorage(currentCollection);
}

function getItemFromStorage(id) {
  return JSON.parse(localStorage.getItem(id));
}

function saveTolocalStorage(collection) {
  localStorage.setItem(collection.id, collection);
}
