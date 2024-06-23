
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-3KUkE5uaMWlKpe2ObTqRRzOEi5x-m9E",
  authDomain: "ntwitter-reloaded-8d95c.firebaseapp.com",
  projectId: "ntwitter-reloaded-8d95c",
  storageBucket: "ntwitter-reloaded-8d95c.appspot.com",
  messagingSenderId: "19506617330",
  appId: "1:19506617330:web:17346fb389d13be394e96b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage=getStorage(app);

export const db=getFirestore(app);