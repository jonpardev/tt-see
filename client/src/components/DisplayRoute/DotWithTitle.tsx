type DotWithTitleProps = {
    bgColor: string,
    isDotPing?: boolean,
    title?: string,
}

const DotWithTitle = ({ bgColor, title, isDotPing }: DotWithTitleProps) => {
    console.log(`this was called for: ${bgColor}`)
    return (
        <div className="flex flex-row gap-2 items-center">
            <div className="relative">
                <div className={`w-[1em] h-[1em] rounded-full absolute ${bgColor} ${isDotPing && "animate-ping"}`}></div>
                <div className={`w-[1em] h-[1em] rounded-full ${bgColor}`}></div>
            </div>
            {title && (<div className={`h-[1.3em] rounded-full flex items-center px-2 ${bgColor}`}>{title}</div>)}
        </div>
    );
}

export default DotWithTitle;