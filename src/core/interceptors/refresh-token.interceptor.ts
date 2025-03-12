import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../components/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenRequest } from '../../components/auth/login/models/refreshToken.model';
import { from } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';

let isRefreshing = false; // Flag to prevent multiple refresh token requests

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);
  const token = cookieService.get('Authorization')?.replace('Bearer ', '').trim();
  const pufferTime = 300 * 1000; // 300 seconds in milliseconds
  const currentTime = new Date().getTime();

  // If there's no token, just continue with the request
  if (!token) {
    return next(req);
  }

  // Decode the token
  const decodedToken: any = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000;

  // If the token is expired or in the buffer period
  if (currentTime + pufferTime > expirationTime) {
    //token expired => logout
    if (currentTime > expirationTime) {
      console.log('Session expired, logging out...');
      authService.logout();
      return next(req);
    }

    // If a refresh is already in progress, just wait for it to complete
    if (isRefreshing) {
      console.log('Refresh already in progress...');
      return next(req);
    }

    // Token is in the buffer period, try to refresh it
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('No refresh token found, logging out...');
      authService.logout();
      return next(req);
    }

    // Set flag to indicate that a refresh is in progress
    isRefreshing = true;

    const requestPayload: refreshTokenRequest = {
      jwtToken: token,
      refreshToken,
    };

    // Call the refresh token API
    return from(authService.refreshToken(requestPayload)).pipe(
      take(1),
      switchMap((response) => {
        // Token refresh successful, update cookies and local storage
        console.log('Token refreshed successfully');
        cookieService.delete('Authorization');
        cookieService.set('Authorization', `Bearer ${response.token}`);
        localStorage.setItem('refreshToken', response.refreshToken);

        // After refresh, reset the flag
        isRefreshing = false;

        // Clone the original request with the new token and retry the request
        const clonedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${response.token}` },
        });

        return next(clonedRequest);
      }),
      catchError((error) => {
        console.error('Failed to refresh token:', error);
        authService.logout(); // Log out if refresh fails
        isRefreshing = false; // Reset flag on error
        return next(req); // Proceed without a token if logout fails
      })
    );
  }

  // If the token is valid and not expired, proceed with the original request
  return next(req);
};
