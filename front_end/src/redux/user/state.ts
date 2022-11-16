export interface UpdateJwtState {
  jwtKey: string | null,
  id: number | null,
  username: string | null,
  nickname: string | null,
  phone: string | null,
  email: string | null,
  joinedTime: string | null
}

export const initialState: UpdateJwtState = {
  jwtKey: null,
  id: null,
  username: null,
  nickname: null,
  phone: null,
  email: null,
  joinedTime: null
};
