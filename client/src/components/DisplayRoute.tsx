import { Fragment, useEffect, useState, CSSProperties, useCallback } from "react";
import IRoute from "../models/route.model";
import * as officialAlert from "../services/officialAlert.services";

type DisplayRouteProps = {
    route: IRoute
}

export const DisplayRoute = ({ route }: DisplayRouteProps) => {
    const [hasOfficialAlert, setHasOfficialAlert] = useState<boolean>(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [officialMessages, setOfficialMessages] = useState<string[]>();

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
            hydrateOfficialMessage().then();
        }
        setIsDetailsOpen(!isDetailsOpen);
    };

    return (
        <Fragment>
            <div className="flex flex-row justify-between items-center mb-4 last:mb-0 p-4 rounded-lg bg-slate-500 bg-opacity-25 ring-1 ring-slate-500 ring-opacity-40">
                <div className="text-xl rounded-md overflow-clip leading-none flex flex-row font-bold">
                    <div style={{backgroundColor: `#${route.line.bgColor}`, color: `#${route.line.textColor}`} as CSSProperties}
                        className="w-[1.5em] relative">
                        <div className="font-black absolute text-[0.8em] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">{route.line.number}</div>
                    </div>
                    <div className="bg-white text-slate-900 px-[0.5em] py-[0.25em]">
                        {
                        ((route.officialNoService.length > 0) && (`Down`)) ||
                        ((route.officialDelays.length > 0) && (`Delayed`)) ||
                        ((route.presumedNoService.length > 0) && (`Need-to-check`)) ||
                        ((route.presumedDelays.length > 0) && (`Need-to-check`)) ||
                        (`Normal`)
                        }
                    </div>
                </div>
                <div>
                    <div className="leading-none rounded-full overflow-clip font-semibold text-xs">
                        {
                        ((route.officialNoService.length > 0) && (
                        <div className="flex flex-row items-center divide-x divide-opacity-50 bg-rose-700">
                            <div className="">Down</div>
                            <div>Open</div>
                        </div>
                        )) ||
                        ((route.officialDelays.length > 0) && (<div className="bg-amber-600 px-[1em] py-[0.5em]">Delayed</div>)) ||
                        ((route.presumedNoService.length > 0) && (`Need-to-check`)) ||
                        ((route.presumedDelays.length > 0) && (`Need-to-check`)) ||
                        (<div className="bg-green-700 px-[1em] py-[0.5em]">Normal</div>)
                        }
                    </div>
                </div>
                {/* <div className="flex flex-row items-center">
                    <div style={{backgroundColor: `#${route.line.bgColor}`, color: `#${route.line.textColor}`} as CSSProperties}
                        className="h-0 pb-[1em] w-[1em] text-lg font-black rounded-lg rounded-r-none flex justify-center items-center leading-none">
                        <div>{route.line.number}</div>
                    </div>
                </div> */}
                {/* <div className="font-bold rounded-lg rounded-l-none bg-white text-slate-900 px-3">
                    {
                    ((route.officialNoService.length > 0) && (`Down <span></span>`)) ||
                    ((route.officialDelays.length > 0) && (`Delayed`)) ||
                    ((route.presumedNoService.length > 0) && (`Need-to-check`)) ||
                    ((route.presumedDelays.length > 0) && (`Need-to-check`)) ||
                    (`Normal`)
                    }
                </div> */}
                {/* {hasOfficialAlert && (
                <div className="ml-auto cursor-pointer" onClick={detailsButtonOnClick}>{isDetailsOpen ? `❌` : `⚠️`}</div>
                )}
                {isDetailsOpen && (
                <div className="bg-slate-800 basis-full rounded-xl my-2 p-4 leading-tight text-sm">
                    <ul className="divide-y divide-slate-500">
                        {officialMessages?.map((message, index) => (<li className="py-4 first:pt-0 last:pb-0" key={index}>{message}</li>))}
                    </ul>
                </div>
                )} */}
            </div>
        </Fragment>
    )
}