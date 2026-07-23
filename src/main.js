/* Set up using Vue 3 */
import { createApp } from "vue";
import { inject } from "@vercel/analytics";
import App from "./App.vue";
import "./assets/main.css";

inject();

createApp(App).mount("#app");
