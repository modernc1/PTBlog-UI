import { Component } from '@angular/core';
import { LoginRequest } from './models/login-request.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model: LoginRequest;
  loginSubscription?: Subscription;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ){
    this.model ={
      email: '',
      password: ''
    };
  }

  onFormSubmit(): void{
    this.loginSubscription = this.authService.login(this.model).subscribe({
      next: (response) => {
        //set auth cookie (installed by command=> npm i ngx-cookie-service@18.0.0)
        //                       Name of cookie    Value                 Datetime to expire  
        this.cookieService.set('Authorization', `Bearer ${response.token}`, undefined,
        // Path   Domain     Secure?  Samesite
          '/'  ,  undefined, true   , 'Strict');

        //set RefreshToken in localstorage
        localStorage.setItem('refreshToken', response.refreshToken);
        
        //set the user in local storage
        this.authService.setUser({
          email: response.email,
          roles: response.roles
        });
        
        //redirect to home page
        this.router.navigateByUrl('/');
      }
    })
  }

}
