import { NavLink, matchPath, useLocation } from "react-router-dom";

const PATHS = {
    SWAP: "/swap",
};

const menuItems = [
    {
        title: "Swap",
        link: "/swap",
        active: [PATHS.SWAP],
    },
];

const Navigation = () => {
    const { pathname } = useLocation();

    const setNavlinkClasses = (paths: string[]) =>
        paths.some((path) => matchPath(path, pathname)) ? "text-pink-300 bg-pink-600/40 " : "hover:bg-pink-700/80";

    return (
        <nav>
            <ul className="flex justify-center gap-1 rounded-full whitespace-nowrap">
                {menuItems.map((item) => (
                    <NavLink
                        key={`nav-item-${item.link}`}
                        to={item.link}
                        className={`${setNavlinkClasses(item.active)} py-2 px-4 rounded-2xl font-semibold select-none duration-200`}
                    >
                        {item.title}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
