import { Injectable } from '@angular/core';
import { LoginRequest } from '../login/models/login-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../login/models/log-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../login/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenRequest } from '../login/models/refreshToken.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //behavior subject
  $user = new BehaviorSubject<User | undefined>(undefined)

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(request: LoginRequest) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request);
  }

  setUser(user: User): void{
    this.$user.next(user); //this well send the logedin user to any subscriber to user() method below observable
    
    //set email & roles inside local storage
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }


  //this function listen when the setUser(user) called
  user() : Observable<User | undefined>{
    return this.$user.asObservable();
    //any component can subscribe to this method which return Observable

  }

  getUser() : User | undefined {
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles){
      const user: User = {
        email: email,
        roles: roles.split(',')
      };

      return user;
    }

    return undefined;
  }

  logout() : void{
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }

  isTokenExpired(token: string) : boolean {
    const decoded: any = jwtDecode(token)
    //if expire will return true
    return Date.now() > decoded.exp * 1000
  }

  refreshToken(request: refreshTokenRequest) : Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/RefreshToken`, request);
  }

}
