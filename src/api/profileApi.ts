import { baseApi } from "./baseApi";

// Types for Profile operations
export type ProfileResponse = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username: string;
  // balance and credit not in spec UserProfileDto
};

// Profile update payload - restricted to firstName and lastName only
export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
};

// Password update payload
export type UpdatePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

// Profile API using RTK Query
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/api/profile",
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    // Update profile - restricted to firstName and lastName only
    updateProfile: builder.mutation<ProfileResponse, UpdateProfilePayload>({
      query: (payload) => ({
        url: "/api/profile",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    // Update password
    updatePassword: builder.mutation<void, UpdatePasswordPayload>({
      query: (payload) => ({
        url: "/api/profile/password",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLazyGetProfileQuery,
  useUpdatePasswordMutation,
} = profileApi;

