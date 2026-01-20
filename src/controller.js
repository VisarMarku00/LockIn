import toDo from "./toDo.js";
import collection from "./collection.js";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "lockin_collections_master";

/* =======================
   COLLECTIONS
======================= */

export function getCollection(collectionId) {
  const all = getAllCollectionsRaw();
  const data = all.find(c => c.id === collectionId);
  if (!data) return null;
  return inflateCollection(data);
}

export function getAllCollections() {
  const all = getAllCollectionsRaw();
  const inflated = all.map(data => inflateCollection(data));
  // Sort by createdAt to ensure chronological order
  inflated.sort((a, b) => a.getData().createdAt - b.getData().createdAt);
  return inflated;
}

function getAllCollectionsRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Storage retrieval error:", e);
    return [];
  }
}

function persistAllCollections(collectionsRaw) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectionsRaw));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

export function createCollection(collectionBody) {
  const id = uuidv4();
  const newCollection = collection(collectionBody.title, id);

  newCollection.addDescription(collectionBody.description || "");
  if (Array.isArray(collectionBody.toDos)) {
    collectionBody.toDos.forEach((todo) => {
      const recreatedToDo = toDo(todo.title, uuidv4());
      recreatedToDo.addDueDate(todo.dueDate);
      recreatedToDo.setPriority(todo.priority);
      newCollection.addToDo(recreatedToDo);
    });
  }

  saveToLocalStorage(newCollection);
  return newCollection;
}

export function editCollection(collectionId, editBody) {
  const col = getCollection(collectionId);
  if (!col) return null;

  if (editBody.title !== undefined) col.addTitle(editBody.title);
  if (editBody.description !== undefined) col.addDescription(editBody.description);

  saveToLocalStorage(col);
  return col;
}

export function deleteCollection(id) {
  const all = getAllCollectionsRaw();
  const filtered = all.filter(c => c.id !== id);
  persistAllCollections(filtered);
}

/* =======================
   TODOS
======================= */

export function createTodo(collectionId, toDoBody) {
  const newToDo = toDo(toDoBody.title, uuidv4());
  newToDo.addDueDate(toDoBody.dueDate || null);
  newToDo.setPriority(toDoBody.priority || "false");

  addToCollection(newToDo, collectionId);
  return newToDo;
}

export function addToCollection(newToDo, collectionId) {
  const col = getCollection(collectionId);
  if (!col) return null;

  col.addToDo(newToDo);
  saveToLocalStorage(col);
}

export function deleteToDo(collectionId, toDoId) {
  const col = getCollection(collectionId);
  if (!col) return;

  col.deleteToDo(toDoId);
  saveToLocalStorage(col);
}

export function editToDo(collectionId, toDoId, editBody) {
  const col = getCollection(collectionId);
  if (!col) return null;

  const t = col.getToDo(toDoId);
  if (!t) return null;

  if (editBody.title !== undefined) t.addTitle(editBody.title);
  if (editBody.dueDate !== undefined) t.addDueDate(editBody.dueDate);
  if (editBody.priority !== undefined) t.setPriority(editBody.priority);

  saveToLocalStorage(col);
  return t;
}

/* =======================
   STORAGE HELPERS
======================= */

function inflateCollection(data) {
  const recreatedCollection = collection(data.title, data.id, data.createdAt);
  recreatedCollection.addDescription(data.description || "");

  data.toDos.forEach((todoData) => {
    const recreatedToDo = toDo(todoData.title, todoData.id);
    recreatedToDo.addDueDate(todoData.dueDate || null);
    recreatedToDo.setPriority(todoData.priority || "false");
    recreatedCollection.addToDo(recreatedToDo);
  });

  return recreatedCollection;
}

export function saveToLocalStorage(colInstance) {
  const all = getAllCollectionsRaw();
  const colData = colInstance.getData();
  const index = all.findIndex(c => c.id === colData.id);

  if (index !== -1) {
    all[index] = colData;
  } else {
    all.push(colData);
  }

  persistAllCollections(all);
}
