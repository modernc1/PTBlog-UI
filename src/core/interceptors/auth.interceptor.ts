import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    //logic to check if endpoint require auth
    if(req.urlWithParams.indexOf('addAuth=true', 0) > -1){
      //add logic here
      const authRequest = req.clone({
        setHeaders: {
                        //interceptor cann't have constructor so we inject like this
          Authorization: inject(CookieService).get('Authorization')
        }
      })
      
      return next(authRequest);
    }
    return next(req);
};


