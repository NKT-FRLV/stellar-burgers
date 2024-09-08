import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import { getIngredientsApi } from '../utils/burger-api';

export const getAllIngredients = createAsyncThunk(
  'ingredientData/getAllIngredients',
  async () => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error) {
      console.log(error);
      throw new Error('Не удалось загрузить ингредиенты');
    }
  }
);

interface TIngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientSlice = createSlice({
  name: 'ingredientData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllIngredients.fulfilled, (state, action) => {
        state.ingredients = [...action.payload];
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
      });
  }
});
