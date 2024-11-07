import { db } from "../Connection/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Fetch all books
export const fetchBooks = async () => {
  const querySnapshot = await getDocs(collection(db, "books"));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

// Add a new book
export const addBook = async (bookData) => {
  await addDoc(collection(db, "books"), bookData);
};

// Update an existing book
export const updateBook = async (bookId, updatedData) => {
  const bookDoc = doc(db, "books", bookId);
  await updateDoc(bookDoc, updatedData);
};

// Delete a book
export const deleteBook = async (bookId) => {
  const bookDoc = doc(db, "books", bookId);
  await deleteDoc(bookDoc);
};
