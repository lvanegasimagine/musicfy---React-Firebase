import firebase from "./Firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export const isUserAdmin = async (uid) => {
  try {
    const response = await getDoc(doc(db, "admins", uid));
    return !response._document ? false : true;
  } catch (error) {
    console.error(error);
  }
};

export const reauthenticate = (password) => {
  const user = auth.currentUser;

  const credentials = EmailAuthProvider.credential(user.email, password);

  return reauthenticateWithCredential(user, credentials);
};
