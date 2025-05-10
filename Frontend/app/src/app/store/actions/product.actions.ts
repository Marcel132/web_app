import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductModel } from '../../../models/product.model';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ data: ProductModel[] }>(),
    'Load Products Failure': props<{ error: unknown }>(),
  }
});
