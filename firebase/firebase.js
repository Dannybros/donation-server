import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAS01bFSGW--5z2GPDwgMl0ErWYum_JmEA",
    authDomain: "donationimagebucket.firebaseapp.com",
    projectId: "donationimagebucket",
    storageBucket: "donationimagebucket.appspot.com",
    messagingSenderId: "731808584661",
    appId: "1:731808584661:web:6230e56b768edd2485a35c",
    measurementId: "G-YJFERKNDWD"
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
