import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createFirebaseConfig } from "../src/components/composables/createFireBaseConfig";
import "./assets/app.css";

createApp(App).use(router).mount("#app");

const { firebaseConfig } = createFirebaseConfig();

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
