import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageService from '@utils/storage/storageService';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isPending: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isPending: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isPending = false;
      StorageService.setToken(action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isPending = false;
      StorageService.removeToken();
    },
    setPending: (state) => {
      state.isPending = true;
    },
    setInitialState: (state) => {
      state.token = StorageService.getToken() || null;
      state.isAuthenticated = !!StorageService.getToken();
      state.isPending = false;
    },
  },
});

export const { setToken, clearToken, setPending, setInitialState } =
  authSlice.actions;
export default authSlice.reducer;
