import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../components/auth/services/auth.service';
import { User } from '../../../components/auth/login/models/user.model';
import { CommonModule } from '@angular/common';
import { BlogpostService } from '../../../services/blogpostService/blogpost.service';
import { HomeComponent } from '../../../components/home/home.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  
  user?: User;

  constructor(private authService: AuthService,
    private router: Router){

  }
  
  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (response)=> {
        this.user = response
      }
    })

    //this method to solve problem of reloading page
    this.user = this.authService.getUser();
  }


  onSearch(filter: string) : void{                                //we add it bcs angular queryParamMap and ngOnInit doesn't call when 
                                                                  //add query params to same page url you are in it 
    this.router.navigate(['/'], { queryParams: { filter: filter }, queryParamsHandling: 'merge' });
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
