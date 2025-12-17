import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { UserCircleIcon } from "../../icons";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../api/profileApi";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    try {
      await updateProfile({ firstName, lastName }).unwrap();
      setSuccessMessage("Profile updated successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div>
      <PageMeta
        title="Profile | Fast SMS"
        description="Manage your personal profile information"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 sm:px-5 sm:py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
              <UserCircleIcon className="h-8 w-8 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {profile?.name || "User Profile"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Read Only Fields */}
              <div className="sm:col-span-2">
                <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
                  Account Information (Read Only)
                </h3>
              </div>
              
              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  value={profile?.username || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email Not Editable
                </label>
                <input
                  type="text"
                  value={profile?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
                />
              </div>

              {/* Editable Fields */}
              <div className="sm:col-span-2 mt-4">
                <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
                  Personal Details
                </h3>
              </div>

              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center justify-center rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-70"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              
              {successMessage && (
                <span className="text-sm font-medium text-success-600 dark:text-success-400">
                  {successMessage}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
