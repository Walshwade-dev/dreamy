import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from '../firebase-init.js';

export async function saveComment(comment) {
  await addDoc(collection(db, "comments"), comment);
}
