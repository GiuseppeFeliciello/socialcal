import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, getDocs
} from "firebase/firestore";

// Generic hook: syncs a Firestore collection to local state
export function useCollection(name) {
  const [data, setData] = useState(null); // null = loading
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, name), snap => {
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setData(docs);
      setReady(true);
    }, err => {
      console.error("Firestore error:", err);
      setReady(true);
    });
    return unsub;
  }, [name]);

  async function save(item) {
    await setDoc(doc(db, name, item.id), item);
  }

  async function remove(id) {
    await deleteDoc(doc(db, name, id));
  }

  async function saveAll(items) {
    for (const item of items) {
      await setDoc(doc(db, name, item.id), item);
    }
  }

  return { data, ready, save, remove, saveAll };
}
