export interface Auth {
  access_token: string;
  user: {
    name: string;
    email: string;
  };
  session_id: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}
