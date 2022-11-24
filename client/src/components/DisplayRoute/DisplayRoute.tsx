import { useEffect, useState, CSSProperties, MouseEvent } from "react";
import IRoute from "../../models/route.model";
import SelfExpandable from "../SelfExpandable";
import DotWithTitle from "./DotWithTitle";

type DisplayRouteProps = {
    route: IRoute
}

export const DisplayRoute = ({ route }: DisplayRouteProps) => {
    const [hasOfficialAlert, setHasOfficialAlert] = useState(false);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    useEffect(() => {
        if (route.officialNoService.length > 0) setHasOfficialAlert(true);
        if (route.officialDelays.length > 0) setHasOfficialAlert(true);
    }, []);

    const displayRouteOnClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (hasOfficialAlert) {
            switch (isDetailsExpanded) {
                case true:
                    setIsDetailsExpanded(false);
                    return;
                case false:
                    setIsDetailsExpanded(true);
                    return;
            }
        }
    }

    return (
        <>
            <div onClick={displayRouteOnClick}
                className={`flex flex-row flex-wrap justify-between items-center rounded-lg bg-slate-500 bg-opacity-10 dark:bg-opacity-40 ring-1 ring-slate-500 ring-opacity-20 dark:ring-opacity-60 gap-2 px-4 ${hasOfficialAlert ? "cursor-pointer pt-4" : "py-4"} ${isDetailsExpanded && "pb-4"}`}>
                <div className="basis-full">
                    <div className="rounded-md overflow-clip leading-none flex flex-row font-bold cursor-default select-none max-w-fit">
                        <div style={{backgroundColor: `#${route.line.bgColor}`, color: `#${route.line.textColor}`} as CSSProperties}
                            className="w-[1.5em] relative">
                            <div className="font-black absolute text-[0.8em] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">{route.line.number}</div>
                        </div>
                        <div className="bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 px-[0.5em] py-[0.25em]">{route.line.name}</div>
                    </div>
                </div>
                <div className="leading-none font-semibold text-xs">
                    {
                    ((route.officialNoService.length > 0) && (<DotWithTitle bgColor="bg-rose-700" textClassName="font-bold text-rose-700" title="No Service" isDotPing={true} />)) ||
                    ((route.officialDelays.length > 0) && (<DotWithTitle bgColor="bg-amber-600" textClassName="font-bold text-amber-600" title="Delayed" isDotPing={true} />)) ||
                    ((route.needToCheck.length > 0) && (<DotWithTitle bgColor="bg-purple-600" textClassName="font-bold text-purple-600" title="Need to check" />)) ||
                    (<DotWithTitle bgColor="bg-green-600" textClassName="font-bold text-green-600" title="Normal" />)
                    }
                </div>
                {hasOfficialAlert && (<>
                <div className={`text-black dark:text-white text-xl text-center align-middle leading-none select-none`}><span className={`inline-block font-MaterialSymbols mt-2 ${isDetailsExpanded ? "rotate-180" : "animate-bounce"}`}>expand_more</span></div>
                <SelfExpandable jsxElement={(
                    <div className="divide-y divide-slate-500">
                        {route.messages?.map((message, index) => (<div className="text-black dark:text-white pt-2 first:pt-0 pb-2 last:pb-0" key={index}>{message}</div>))}
                    </div>
                )} isExpanded={isDetailsExpanded} />
                </>)}
            </div>
        </>
    )
}