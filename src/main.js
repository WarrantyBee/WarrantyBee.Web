import { createApp } from "vue";
import "./style.css";
import "./fonts.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas, fab);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
