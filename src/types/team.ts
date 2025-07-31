export interface Team {
  id: string;
  name: string;
  team_key: string;
  members?: any[];
  role?: string;
  created_at?: string;
  updated_at?: string;
  workspace_id?: string;
}

export interface CreateTeamForm {
  name: string;
  team_key: string;
  description?: string;
}
