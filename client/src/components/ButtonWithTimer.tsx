import { MouseEvent, useEffect, useState } from "react";
import wait from "../helpers/wait";

type ButtonWithTimerProps = {
    timer: number,
    onClick: () => void
}

const ButtonWithTimer = ({ timer, onClick }: ButtonWithTimerProps) => {
    const [seconds, setSeconds] = useState<number>();

    useEffect(() => {
        setSeconds(timer);
    }, []);

    useEffect(() => {
        const timerAsync = async () => {
            if (seconds === undefined) return;
            await wait(1000);
            const newSeconds = seconds - 1;
            if (newSeconds > 0) setSeconds(newSeconds);
            else setSeconds(undefined);
        }
        timerAsync().then();
    }, [seconds]);

    const buttonOnClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onClick();
    }

    return (
        <button onClick={buttonOnClick} disabled={(seconds !== undefined)}
            className="w-full h-20 rounded-lg text-3xl font-black border-2 border-slate-500 hover:border-slate-600 text-white disabled:text-slate-500 bg-slate-500 hover:bg-slate-600 disabled:bg-inherit disabled:hover:bg-inherit disabled:active:scale-95 disabled:cursor-not-allowed">
            {seconds === undefined ? <span className="font-MaterialSymbols">refresh</span> : `${seconds}`}
        </button>
    );
}

export default ButtonWithTimer;