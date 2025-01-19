import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageService from '@utils/storage/storageService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: StorageService.getToken() || null,
  isAuthenticated: !!StorageService.getToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      StorageService.setToken(action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      StorageService.removeToken();
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
