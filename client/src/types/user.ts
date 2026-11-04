export type User = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserProfileInput = {
  name?: string | null;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
};
