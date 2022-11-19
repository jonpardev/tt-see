const LoadingWithCircle = () => {
    
    return(
        <div className="flex flex-row gap-4 items-center text-2xl font-black">
            <svg className="animate-spin h-[1.5em] w-[1.5em]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" className="stroke-slate-200" strokeWidth="4" strokeDasharray="40" strokeDashoffset="40"></circle>
                <circle cx="12" cy="12" r="10" className="stroke-slate-200 opacity-25" strokeWidth="4"></circle>
            </svg>
            <div className="text-white">Loading...</div>
        </div>
    );
}

export default LoadingWithCircle;