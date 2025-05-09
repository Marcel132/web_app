import { createReducer, on } from '@ngrx/store';
import { ProductActions } from '../actions/product.actions';
import { ProductModel } from '../../../models/product.model';

export const productFeatureKey = 'product';

export interface ProductState {
	products: ProductModel[] | null;
	loading: boolean;
	error: string | null;
}

export const initialState: ProductState = {
  products: null,
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { data }) => ({
    ...state,
    products: [...data].sort((a, b) => a.name.localeCompare(b.name)),
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error: String(error),
    loading: false
  }))
);
