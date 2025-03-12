import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

//must be attatched to route that need to secure in app.routes.ts

export const authGuard: CanActivateFn = (route, state) => {
  //write logic here
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();


  //check for jwt token
  let token = cookieService.get('Authorization');
  if(token && user){
    token = token.replace('Bearer', ''); //remove bearer from token
    const decodedToken: any = jwtDecode(token); 
    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime(); //in milliseconds

    if(currentTime > expirationDate){
      authService.logout()                     //we save the url as returnUrl to redirect them back when they logged in
      return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}}) //this method handle return with navigation to url
    }
    else{
      //token is still valid
      if(user.roles.includes('Admin') || user.roles.includes('Writer')){
        return true
      }else{
        alert('unAuthorized')
        return false;
      }
    }

  }
  else{
    authService.logout()                     //we save the url as returnUrl to redirect them back when they logged in
    return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}}); //this method handle return with navigation to url
  }
};
