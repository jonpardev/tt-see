import { useEffect, useRef, useState } from "react";

type SelfExpandableProps = {
    isExpanded?: boolean,
    isHandleBounce?: boolean,
    jsxElement?: JSX.Element,
    onClick?: () => void,
}

const SelfExpandable = ({ isExpanded, jsxElement, onClick, }: SelfExpandableProps) => {
    const detailsRef = useRef<HTMLDivElement>(null);

    const [maxHeight, setMaxHeight] = useState(0);

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
            <div ref={detailsRef} className="w-full overflow-hidden leading-tight text-sm text-white transition-all" style={{ maxHeight: `${isExpanded ? `${maxHeight}px` : "0px"}` }}>
                {jsxElement}
            </div>
        </div>
    );
}

export default SelfExpandable;