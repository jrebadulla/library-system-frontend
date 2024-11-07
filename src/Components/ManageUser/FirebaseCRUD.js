import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Connection/firebaseConfig";

// Function to add a new user
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("User added with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// Function to retrieve users
export const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

// Function to update a user
export const updateUser = async (userId, updatedData) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, updatedData);
    console.log("User updated");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

// Function to delete a user
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User deleted");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};
