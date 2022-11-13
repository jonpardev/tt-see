
export enum AnnouncementType {
    Information,
    Warning,
    Alert,
}

type AnnouncementProps = {
    type?: AnnouncementType,
    message: string,
}

export const Announcement = ({ type, message }: AnnouncementProps) => {
    const informationBanner = (<div className="bg-sky-200 text-sky-600 px-4 py-3 rounded-lg mb-2">{message}</div>);
    const warningBanner = (<div className="bg-yellow-200 text-yellow-600 px-4 py-3 rounded-lg mb-2">{message}</div>);
    const alertBanner = (<div className="bg-rose-300 text-rose-600 px-4 py-3 rounded-lg mb-2">{message}</div>);
    const defaultBanner = (<div className="bg-slate-300 text-slate-800 px-4 py-3 rounded-lg mb-2">{message}</div>);

    if (type === undefined) return defaultBanner;
    switch (type) {
        case AnnouncementType.Information:
            return informationBanner;
        case AnnouncementType.Warning:
            return warningBanner;
        case AnnouncementType.Alert:
            return alertBanner;
        default:
            return defaultBanner;
    }
}