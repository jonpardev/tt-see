import { useEffect, useState, CSSProperties } from "react";
import IRoute from "../../models/route.model";
import * as officialAlert from "../../services/officialAlert.services";
import SelfExpandable from "../SelfExpandable";
import DotWithTitle from "./DotWithTitle";

type DisplayRouteProps = {
    route: IRoute
}

export const DisplayRoute = ({ route }: DisplayRouteProps) => {
    const [hasOfficialAlert, setHasOfficialAlert] = useState<boolean>(false);
    const [officialMessages, setOfficialMessages] = useState<string[]>();
    const [details, setDetails] = useState<JSX.Element>();

    useEffect(() => {
        if (route.officialNoService.length > 0) setHasOfficialAlert(true);
        if (route.officialDelays.length > 0) setHasOfficialAlert(true);
    }, []);

    const detailsButtonOnClick = () => {
        const hydrateOfficialMessage = async () => {
            const messages = await officialAlert.getAllMessagesOnLine(route.line.number);
            setOfficialMessages(messages);
        }

        if (officialMessages === undefined) {
            setDetails(
                <div className="pb-4">
                    <div className="w-full rounded-lg animate-pulse bg-slate-500 min-h-[2em]"></div>
                </div>
            );
            hydrateOfficialMessage().then();
        }
    };

    useEffect(() => {
        setDetails(
        <div className="divide-y divide-slate-500">
            {officialMessages?.map((message, index) => (<div className="text-black dark:text-white pt-2 first:pt-0 pb-2 last:pb-4" key={index}>{message}</div>))}
        </div>);
    }, [officialMessages]);

    return (
        <>
            <div className={`flex flex-row gap-2 flex-wrap justify-between items-center rounded-lg bg-slate-500 bg-opacity-10 dark:bg-opacity-40 ring-1 ring-slate-500 ring-opacity-20 dark:ring-opacity-60 px-4 ${hasOfficialAlert ? "pt-4" : "py-4"}`}>
                <div className="rounded-md overflow-clip leading-none flex flex-row font-bold cursor-default select-none">
                    <div style={{backgroundColor: `#${route.line.bgColor}`, color: `#${route.line.textColor}`} as CSSProperties}
                        className="w-[1.5em] relative">
                        <div className="font-black absolute text-[0.8em] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">{route.line.number}</div>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 px-[0.5em] py-[0.25em]">{route.line.name.split(" ")[2].replace("(","").replace(")","")}</div>
                </div>
                <div>
                    <div className="leading-none font-semibold text-xs">
                        {
                        ((route.officialNoService.length > 0) && (<DotWithTitle bgColor="bg-rose-700" textClassName="font-bold text-rose-700" title="No Service" isDotPing={true} />)) ||
                        ((route.officialDelays.length > 0) && (<DotWithTitle bgColor="bg-amber-600" textClassName="font-bold text-amber-600" title="Delayed" isDotPing={true} />)) ||
                        ((route.presumedNoService.length > 0) && (`Need-to-check`)) ||
                        ((route.presumedDelays.length > 0) && (`Need-to-check`)) ||
                        (<DotWithTitle bgColor="bg-green-600" />)
                        }
                    </div>
                </div>
                {hasOfficialAlert && (<SelfExpandable jsxElement={details} onClick={detailsButtonOnClick} isHandleBounce={true} />)}
            </div>
        </>
    )
}