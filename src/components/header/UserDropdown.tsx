import { useState } from "react";
import { useNavigate } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { UserCircleIcon } from "../../icons";
import { useKeycloak } from "@react-keycloak/web";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userEmail = keycloak.tokenParsed?.email as string | undefined;

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSignOut = () => {
    closeDropdown();
    keycloak.logout({
      redirectUri: window.location.origin + "/landing",
    });
  };

  const goToProfile = () => {
    closeDropdown();
    navigate("/profile");
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="User Menu"
      >
        <UserCircleIcon className="h-5 w-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[280px] rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            User Account
          </h5>
          <button
            onClick={closeDropdown}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
            <UserCircleIcon className="h-5 w-5 text-brand-500 dark:text-brand-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {userEmail ?? "Unknown User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Logged in
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-1">
          <li>
            <DropdownItem
              onItemClick={goToProfile}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit Profile
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-error-500 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
            >
              Sign Out
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
