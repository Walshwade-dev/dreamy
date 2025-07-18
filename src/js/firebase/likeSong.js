import { doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from '../firebase-init.js';

export async function likeSong(songId) {
  const ref = doc(db, "songs", songId);
  await updateDoc(ref, { likes: increment(1) });
}
