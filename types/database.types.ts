export interface AppMetadata {
  provider: string;
  providers: string[];
}

export interface UserMetadata {
  avatar_url?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  preferred_username?: string;
  provider_id?: string;
  sub?: string;
  user_name?: string;
}

export interface IdentityData {
  avatar_url?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  preferred_username?: string;
  provider_id?: string;
  sub?: string;
  user_name?: string;
}

export interface Identity {
  identity_id?: string;
  id?: string;
  user_id?: string;
  identity_data?: IdentityData;
  provider?: string;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
  email?: string;
}

export interface User {
  getFullName: any;
  id?: string;
  aud?: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: AppMetadata;
  user_metadata?: UserMetadata;
  identities?: Identity[];
  created_at?: string;
  updated_at?: string;
  is_anonymous?: boolean;
}

[
  {
    "raw_user_meta_data": {
      "iss": "https://api.github.com",
      "sub": "159754157",
      "name": "Sujit Dwivedi",
      "email": "dwiwedisv@rknec.edu",
      "full_name": "Sujit Dwivedi",
      "user_name": "sujiiiiit",
      "avatar_url": "https://avatars.githubusercontent.com/u/159754157?v=4",
      "provider_id": "159754157",
      "email_verified": true,
      "phone_verified": false,
      "preferred_username": "sujiiiiit"
    }
  }
]