import { useMemo } from "react"

export enum AnnouncementType {
    Information,
    Warning,
    Alert,
}

type AnnouncementProps = {
    type?: AnnouncementType,
    message: string,
}

type ColorAndSymbol = {
    color: string,
    symbol: string,
}

export const Announcement = ({ type, message }: AnnouncementProps) => {
    const information: ColorAndSymbol = { color: "bg-sky-600", symbol: "notifications" }
    const warning: ColorAndSymbol = { color: "bg-amber-600", symbol: "warning" }
    const alert: ColorAndSymbol = { color: "bg-rose-600", symbol: "error" }

    const returnColorAndSymbol = () => {
        switch (type) {
            case AnnouncementType.Warning:
                return warning;
            case AnnouncementType.Alert:
                return alert;
            default:
                return information;
        }
    }

    const colorAndSymbolMemo = useMemo(() => returnColorAndSymbol(), []);

    return (
        <div className={`text-white px-4 py-1 rounded-lg flex flex-row items-center ${colorAndSymbolMemo.color}`}>
            <div className="font-MaterialSymbols text-[1.5em] mr-2">{colorAndSymbolMemo.symbol}</div>
            <div>{message}</div>
        </div>
    );
}