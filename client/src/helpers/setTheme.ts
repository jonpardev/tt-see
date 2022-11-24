import { setThemeDark, setThemeLight } from "../store/globalThemeSlice";
import { store } from "../store/store";

const setTheme = {
    light: () => {
        store.dispatch(setThemeLight()); // to use dispatch in the outside of component, import store
        document.querySelector("meta[name='theme-color']")!.setAttribute("content", "#e2e8f0");
        document.querySelector("html")!.removeAttribute("class");
    },
    dark: () => {
        store.dispatch(setThemeDark()); // to use dispatch in the outside of component, import store
        document.querySelector("meta[name='theme-color']")!.setAttribute("content", "#1E293B");
        document.querySelector("html")!.setAttribute("class", "dark");
    },
}

export default setTheme;