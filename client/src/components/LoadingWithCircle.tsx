const LoadingWithCircle = () => {
    
    return(
        <div className="inline-flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" className="stroke-slate-200" strokeWidth="4" strokeDasharray="40" strokeDashoffset="40"></circle>
            <circle cx="12" cy="12" r="10" className="stroke-slate-200 opacity-25" strokeWidth="4"></circle>
            </svg>
            Loading...
        </div>
    );
}

export default LoadingWithCircle;