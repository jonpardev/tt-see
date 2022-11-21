export const epochToText = (epoch?: number) => {
    const unixTimeDifferenceToText = (behindTime: number, aheadTime: number) => {
        const difference = aheadTime - behindTime;
        if (difference < 0) throw new Error(`Time difference cannot be negative`);
        const asMinutes = Math.floor(difference/60000);
        const asHours = Math.floor(difference/3600000);
        const asDays = Math.floor(difference/86400000);
        if (asDays > 1) return `${asDays} days ago`;
        if (asDays === 1) return `1 day ago`;
        if (asHours > 1) return `${asHours} hours ago`;
        if (asHours === 1) return `1 hours ago`;
        if (asMinutes > 1) return `${asMinutes} minutes ago`;
        if (asMinutes === 1) return `1 minute ago`;
        return `seconds ago`;
    }

    if (epoch === undefined) return "-";
    const nowUnixTime = Date.now();
    return unixTimeDifferenceToText(epoch, nowUnixTime);
}