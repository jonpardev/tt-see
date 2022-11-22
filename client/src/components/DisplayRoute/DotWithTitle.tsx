type DotWithTitleProps = {
    bgColor: string,
    textClassName?: string,
    isDotPing?: boolean,
    title?: string,
}

const DotWithTitle = ({ bgColor, textClassName, title, isDotPing }: DotWithTitleProps) => {
    return (
        <div className="flex flex-row gap-2 items-center">
            <div className="relative">
                <div className={`w-[1em] h-[1em] rounded-full absolute ${bgColor} ${isDotPing && "animate-ping"}`}></div>
                <div className={`w-[1em] h-[1em] rounded-full ${bgColor}`}></div>
            </div>
            {title && (<div><span className={textClassName}>{title}</span></div>)}
        </div>
    );
}

export default DotWithTitle;