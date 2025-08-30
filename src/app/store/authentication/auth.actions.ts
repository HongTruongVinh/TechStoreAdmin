import { createAction, props } from '@ngrx/store';
import { User, LoginResponeModel } from './auth.models';
import { RepositoryModel } from '../../models/models/repository_base';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponeModel }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
