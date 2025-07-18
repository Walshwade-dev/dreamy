// src/js/firebase/saveComment.js
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from '../firebase-init.js';

export async function saveComment(comment) {
    const docRef = await addDoc(collection(db, "comments"), comment);
    return { ...comment, id: docRef.id }; // return full comment with generated id
}
