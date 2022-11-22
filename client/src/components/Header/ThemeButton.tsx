import { MouseEvent } from "react";
import { useAppSelector } from "../../store/hooks";
import * as localStorageService from '../../services/localStorage.services';
import setTheme from "../../helpers/setTheme";

const ThemeButton = () => {
    const isThemeDark = useAppSelector(state => state.globalTheme.isDark);

    const buttonOnClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isThemeDark) {
            setTheme.light();
            localStorageService.setThemeLight();
        } else {
            setTheme.dark();
            localStorageService.setThemeDark();
        }
    }
    
    return(
        <button onClick={buttonOnClick}
            className="self-center flex gap-2 flex-row items-center rounded-full text-xl relative border-2 border-slate-400 bg-slate-400 dark:border-slate-600 dark:bg-slate-600">
            <div className="flex justify-center items-center w-[1.5em] h-[1.5em] text-[1em] overflow-hidden z-10 font-MaterialSymbols">light_mode</div>
            <div className="flex justify-center items-center w-[1.5em] h-[1.5em] text-[1em] overflow-hidden z-10 font-MaterialSymbols">dark_mode</div>
            <div className={`rounded-full bg-slate-100 dark:bg-slate-900 w-[1.5em] h-[1.5em] absolute transition-all ${isThemeDark ? "left-[100%] -translate-x-[100%]" : "left-0"}`}></div>
        </button>
    );
}

export default ThemeButton;