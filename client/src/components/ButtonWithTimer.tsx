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
            className={`w-full my-4 py-8 rounded-lg text-3xl font-bold disabled:font-normal bg-slate-600 disabled:bg-slate-700 hover:bg-slate-500 disabled:hover:bg-inherit text-white disabled:text-slate-600`}>
            {seconds === undefined ? `Refresh` : `Waiting...${seconds}s`}
        </button>
    );
}

export default ButtonWithTimer;