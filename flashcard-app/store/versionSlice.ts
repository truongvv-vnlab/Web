import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VersionType } from './type';
import { getVersionFromDB, updateVersionInDB } from './indexedDB';

interface VersionState extends VersionType {}

const initialState: VersionState = {
  version: null,
};

const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<number>) => {
      state.version = action.payload;
    },
    updateVersion: (state, action: PayloadAction<number>) => {
      state.version = action.payload;
      updateVersionInDB(action.payload);
    },
  },
});

export const { setVersion, updateVersion } = versionSlice.actions;
export default versionSlice.reducer;

export const fetchVersion = () => async (dispatch: any) => {
  const versionData = await getVersionFromDB();
  if (versionData) {
    dispatch(setVersion(versionData.version));
  }
};
