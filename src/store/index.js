import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import Modules from "./modules";

export default store(function () {
  const Store = createStore({
    modules: { ...Modules },
    // strict: process.env.DEBUGGING,
  });

  return Store;
});
