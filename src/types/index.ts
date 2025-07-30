export interface Committer {
  rank: number;
  username: string;
  profile: string;
  commits: number;
  avatar: string;
}
export type Mode = "commits" | "contributions" | "all";
