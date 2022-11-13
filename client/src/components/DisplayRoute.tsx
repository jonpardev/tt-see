import { Fragment, useEffect, useState } from "react";
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
            <div className="flex flex-wrap mb-6 last:mb-0">
                <div className={`text-sm font-bold rounded-xl px-2 py-0.1 mr-2`} style={{backgroundColor: `#${route.line.bgColor}`, color: `#${route.line.textColor}`} as React.CSSProperties}>Line {route.line.number}</div>
                <div>
                    {
                    ((route.officialNoService.length > 0) && (`🔴 Down`)) ||
                    ((route.officialDelays.length > 0) && (`🟡 Delayed`)) ||
                    ((route.presumedNoService.length > 0) && (`🟣 Need-to-check`)) ||
                    ((route.presumedDelays.length > 0) && (`🟣 Need-to-check`)) ||
                    (`🟢 Normal`)
                    }
                </div>
                {hasOfficialAlert && (
                <div className="ml-auto cursor-pointer" onClick={detailsButtonOnClick}>{isDetailsOpen ? `❌` : `⚠️`}</div>
                )}
                {isDetailsOpen && (
                <div className="bg-slate-800 basis-full rounded-xl my-2 p-4 leading-tight text-sm">
                    <ul className="divide-y divide-slate-500">
                        {officialMessages?.map((message, index) => (<li className="py-4 first:pt-0 last:pb-0" key={index}>{message}</li>))}
                    </ul>
                </div>
                )}
                
            </div>
        </Fragment>
    )
}