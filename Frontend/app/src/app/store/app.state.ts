import { ActionReducerMap } from '@ngrx/store';
import { ProductState, productReducer } from './reducers/product.reducer';

export interface AppState {
  productState: ProductState;
}

export const reducers: ActionReducerMap<AppState> = {
  productState: productReducer,
};
