import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDeyQSSOAw7m7O1n3wPkrvn7bwV76ZXd5s",
    authDomain: "receitas-f1798.firebaseapp.com",
    databaseURL: "https://receitas-f1798-default-rtdb.firebaseio.com",
    projectId: "receitas-f1798",
    storageBucket: "receitas-f1798.appspot.com",
    messagingSenderId: "407697899233",
    appId: "1:407697899233:web:c9e2e489f1fae1279ac1a0"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);