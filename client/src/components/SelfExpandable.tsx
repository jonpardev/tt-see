import { MouseEvent, useEffect, useRef, useState } from "react";

type SelfExpandableProps = {
    initialIsExpanded?: boolean,
    isHandleBounce?: boolean,
    jsxElement?: JSX.Element,
    onClick?: () => void,
}

const SelfExpandable = ({ initialIsExpanded, isHandleBounce, jsxElement, onClick, }: SelfExpandableProps) => {
    const detailsRef = useRef<HTMLDivElement>(null);

    const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
    const [maxHeight, setMaxHeight] = useState(0);

    const buttonOnClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(onClick) onClick();
        const newIsExpanded = !(isExpanded);
        setIsExpanded(newIsExpanded);
    }

    useEffect(() => {
        if (detailsRef.current) {
            const firstTop = detailsRef.current?.firstElementChild?.getBoundingClientRect().top ?? 0;
            const lastBottom = detailsRef.current?.lastElementChild?.getBoundingClientRect().bottom ?? 0;
            setMaxHeight(Math.ceil(lastBottom-firstTop));
            const temp1 = [...detailsRef.current?.children]
            if (temp1.length > 0) {
                const temp2 = temp1.map(t => t.clientHeight);
                const temp3 = temp2.reduce((prev, current) => prev + current);
            }
            return;
        }
        setMaxHeight(1);
    }, [jsxElement]);

    return (
        <div className="basis-full flex flex-col items-center">
            <button onClick={buttonOnClick}
                className={`rounded-lg font-MaterialSymbols text-white text-xl leading-none ${isExpanded && "h-fit"}`}><span className={`inline-block ${isExpanded ? "rotate-180" : (isHandleBounce ? "animate-bounce" : "rotate-0")}`}>expand_more</span></button>
            <div ref={detailsRef} className="w-full overflow-hidden leading-tight text-sm text-white transition-all" style={{ maxHeight: `${isExpanded ? `${maxHeight}px` : "0px"}` }}>
                {jsxElement}
            </div>
        </div>
    );
}

export default SelfExpandable;