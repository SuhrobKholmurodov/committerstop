export interface Committer {
  rank: number;
  username: string;
  realname?: string;
  profile: string;
  commits: number;
  avatar: string;
}
export type Mode = "commits" | "contributions" | "all";
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}