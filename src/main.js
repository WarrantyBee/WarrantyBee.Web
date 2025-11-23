import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import telemetry from "./services/telemetry";
import ElementPlus from "element-plus";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./style.css";
import "./fonts.css";
import "element-plus/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(ElementPlus);
app.use(router);
app.use(telemetry);
app.use(pinia);
app.mount("#app");

library.add(fas, fab);
