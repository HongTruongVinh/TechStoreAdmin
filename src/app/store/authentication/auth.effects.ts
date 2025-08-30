import { inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

export const loginEffect = createEffect(() => {
  const actions$ = inject(Actions);
  const authService = inject(AuthenticationService);

  return actions$.pipe(
    ofType(AuthActions.login),
    switchMap((LoginRequestModel) =>
      authService.loginNormalAccount(LoginRequestModel).pipe(
        map(res => AuthActions.loginSuccess({ response: res.data! })),
        catchError(err => of(AuthActions.loginFailure({ error: err.message || 'Login failed' })))
      )
    )
  );
}, { functional: true });
