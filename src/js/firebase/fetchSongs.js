import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from '../firebase-init.js';

export async function fetchSongs() {
  const snapshot = await getDocs(collection(db, "songs"));
  const songs = [];
  snapshot.forEach(doc => {
    songs.push({ id: doc.id, ...doc.data() });
  });
  return songs;
}
