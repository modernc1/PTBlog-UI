import { Routes } from '@angular/router';
import { CategoriesListComponent } from '../components/categories/categories-list/categories-list.component';
import { CategoriesAddComponent } from '../components/categories/categories-add/categories-add.component';
import { BlogpostsListComponent } from '../components/blogposts/blogposts-list/blogposts-list.component';
import { BlogpostFormComponent } from '../components/blogposts/blogpost-form/blogpost-form.component';
import { HomeComponent } from '../components/home/home.component';
import { BlogDetailsComponent } from '../components/blog-details/blog-details.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { authGuard } from '../components/auth/guard/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: "login", component: LoginComponent},
    { path: "blog/:url", component: BlogDetailsComponent},
    { path: "admin/categories", component: CategoriesListComponent, canActivate:[authGuard] },
    { path: "admin/categories/add", component: CategoriesAddComponent, canActivate:[authGuard] },
    { path: "admin/categories/edit/:id", component: CategoriesAddComponent, canActivate:[authGuard] },
    { path: "admin/blogposts", component: BlogpostsListComponent, canActivate:[authGuard]},
    { path: "admin/blogposts/add", component: BlogpostFormComponent, canActivate:[authGuard]},
    { path: "admin/blogposts/edit/:id", component: BlogpostFormComponent, canActivate:[authGuard]}
];
