import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";
import { IconTrees } from "@tabler/icons-react";
import Link from "next/link";

export default function Header() {
  const routes = [
    { name: "Adopt", href: "adopt" },
    { name: "Donate", href: "donate" },
  ];

  const ngoProfileOptions = [{ name: "Add Tree", href: "/add-tree" }];

  const { user, logOutUser } = useUserContext();
  const { userStore } = useUserStore();

  return (
    <header className="sticky top-0 z-50 shadow-lg navbar bg-base-100">
      <div className="flex-1">
        <a className="gap-2 text-xl normal-case btn btn-ghost">
          <IconTrees className="text-emerald-500" /> Tree Transparency
        </a>
      </div>
      <div className="flex-none">
        <ul className="px-1 menu menu-horizontal">
          {routes.map((route) => (
            <li key={route.href}>
              <Link href={route.href}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      {!user ? (
        <>
          <div>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </>
      ) : (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={user?.photoURL} alt="user" />
            </div>
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
    </header>
  );
}
