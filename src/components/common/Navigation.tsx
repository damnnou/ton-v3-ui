import { NavLink, matchPath, useLocation } from "react-router-dom";

const PATHS = {
    SWAP: "/swap",
    POOLS: "/pools",
    V3: "/v3",
};

const menuItems = [
    {
        title: "Swap",
        link: "/swap",
        active: [PATHS.SWAP],
    },
    {
        title: "Pools",
        link: "/pools",
        active: [PATHS.POOLS],
    },
    {
        title: "V3",
        link: "/v3",
        active: [PATHS.V3],
    },
];

const Navigation = () => {
    const { pathname } = useLocation();

    const setNavlinkClasses = (paths: string[]) =>
        paths.some((path) => matchPath(path, pathname)) ? "bg-primary-red" : "hover:bg-primary-red/50";

    return (
        <nav className="w-1/3">
            <ul className="flex justify-center gap-2 whitespace-nowrap">
                {menuItems.map((item) => (
                    <NavLink
                        key={`nav-item-${item.link}`}
                        to={item.link}
                        className={`${setNavlinkClasses(item.active)} py-2 px-4 rounded-xl font-semibold select-none duration-200`}
                    >
                        {item.title}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
