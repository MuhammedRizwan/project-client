"use client";
import { logout } from "@/store/reducer/userReducer";
import { RootState } from "@/store/store";
import { Image } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const Router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const sidebarItems = [
    {
      name: "Profile",
      active: pathname == "/profile-edit",
      onClick: () => Router.push("/profile-edit"),
    },
    {
      name: "Travel History",
      active: pathname == "/travel-history",
      onClick: () => Router.push("/travel-history"),
    },
    {
      name: "Booked",
      active: pathname == "/booked",
      onClick: () => Router.push("/booked"),
    },
    {
      name: "Wallets",
      active: pathname == "/wallets",
      onClick: () => Router.push("/wallets"),
    },
    {
      name: "Notification",
      active: pathname == "/notification",
      onClick: () => Router.push("/notification"),
    },
    {
      name: "Chat",
      active: pathname == "/chat",
      onClick: () => Router.push("/chat"),
    },
    {
      name: "Posts",
      active: pathname == "/user-post",
      onClick: () => Router.push("/user-post"),
    },
    {
      name: "Create Post",
      active: pathname == "/user-post/add-post",
      onClick: () => Router.push("/user-post/add-post"),
    },
    {
      name: "Logout",
      onClick: () => {
        dispatch(logout());
        Router.push("/login");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Sidebar - Hidden on smaller screens */}
        <aside className="hidden lg:block lg:w-1/4 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              {user && typeof user?.profile_picture === "string" ? (
                <Image
                  src={user.profile_picture}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
              ) : (
                <Image
                  src=""
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
              )}
              <h2 className="text-xl font-semibold">{user?.username}</h2>
            </div>
            <nav>
              <ul>
                {sidebarItems.map((item, index) => (
                  <li key={index} className="mb-2 cursor-pointer">
                    <p
                      onClick={item.onClick}
                      className={`block py-2 px-4 rounded ${
                        item.active
                          ? "bg-yellow-100 text-yellow-800"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </p>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <div className="w-full lg:w-3/4">{children}</div>
      </div>
    </div>
  );
}
