import ThemeButton from "./ThemeButton";

const Header = () => {
    return (
        <header className="w-full text-left text-black dark:text-white flex flex-row justify-between">
            <div>
                <h1 className="text-3xl font-bold leading-none">TT-See</h1>
                <h2 className="text-sm">Toronto Subway Watcher</h2>
            </div>
            <ThemeButton />
        </header>
    );
}

export default Header;