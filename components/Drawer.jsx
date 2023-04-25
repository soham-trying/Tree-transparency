import { IconMenu } from "@tabler/icons-react";
import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";
import { IconTrees, IconUserCircle } from "@tabler/icons-react";

import Link from "next/link";

export default function Drawer({ children }) {
  const navBreakpoint = "md";

  const routes = [
    { name: "Adopt", href: "adopt" },
    { name: "Donate", href: "donate" },
  ];

  const ngoProfileOptions = [{ name: "Add Tree", href: "/add-tree" }];

  const { user, logOutUser } = useUserContext();
  const { userStore } = useUserStore();

  return (
    <div className="drawer">
      <input id="drawer" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="flex flex-col drawer-content">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          {/* Toggle Button */}
          <div className={`flex-none ${navBreakpoint}:hidden`}>
            <label htmlFor="drawer" className="btn btn-square btn-ghost">
              <IconMenu />
            </label>
          </div>

          <div className="flex-1">
            <Link href="/" className="gap-2 text-xl normal-case btn btn-ghost">
              <IconTrees className="text-emerald-500" /> Tree Transparency
            </Link>
          </div>

          <div className="flex-none rounded-box">
            <ul
              className={`menu menu-horizontal hidden ${navBreakpoint}:block`}
            >
              {routes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href}>{route.name}</Link>
                </li>
              ))}
            </ul>
            {!user ? (
              <div>
                <button className="btn btn-primary">
                  <Link href="/login">Sign In</Link>
                </button>
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="gap-2 btn btn-ghost">
                  <div className="avatar">
                    {user.photoURL ? (
                      <div className="w-10 rounded-full">
                        <img src={user?.photoURL} alt="user" />
                      </div>
                    ) : (
                      <IconUserCircle size={30} />
                    )}
                  </div>
                  {user?.displayName}
                </label>
                <ul
                  tabIndex={0}
                  className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                >
                  {userStore.type === "NGOs" &&
                    ngoProfileOptions.map((e) => (
                      <li href={e.href}>
                        <Link href={e.href}>{e.name}</Link>
                      </li>
                    ))}

                  <li>
                    <Link href="/adopted-trees">Adopted Trees</Link>
                  </li>

                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={() => logOutUser()} className="user">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <ul className="gap-2 p-4 menu w-80 bg-base-100">
          {routes.map((route) => (
            <li key={route.href}>
              <Link href={route.href}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
