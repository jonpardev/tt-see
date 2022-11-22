import { MouseEvent, useEffect, useState } from "react";
import { setThemeDark, setThemeLight } from "../../store/globalThemeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import * as localStorageService from '../../services/localStorage.services';

const ThemeButton = () => {
    const dispatch = useAppDispatch();
    const isThemeDark = useAppSelector(state => state.globalTheme.isDark);

    const buttonOnClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isThemeDark) {
            dispatch(setThemeLight());
            document.querySelector("meta[name='theme-color']")!.setAttribute("content", "#e2e8f0");
            localStorageService.setThemeLight();
        } else {
            dispatch(setThemeDark());
            document.querySelector("meta[name='theme-color']")!.setAttribute("content", "#1E293B");
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