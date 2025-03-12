import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../../components/categories/models/Category';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http:HttpClient,
    private cookieService: CookieService
  ) { }

  //because we are using interceptor to add authorization header
  //we will add query parameter to urls that require authorization
  //to prevent interceptor from adding header to every api call
  //then in interceptor add logic to send header to only url that has this parameter
  getAllCategories(filter? : string, isAsc: boolean = true): Observable<Category[]>{
    //query Parameters must added to HttpParams
    let params = new HttpParams();
    if(filter){
      params = params.set('filter', filter);
    }
    params = params.set('sortDirection', isAsc? "asc" : "des")
    return this.http.get<Category[]>(this.apiUrl, {params: params})
  }

  getCategoryById(id: string): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
  }
  
  AddCategory(category:Category): Observable<Category>{
    return this.http.post<Category>(`${this.apiUrl}?addAuth=true`, category)
  }

  deleteCategory(id: string) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}?addAuth=true`)
  }

  editCategory(category: Category): Observable<Category> {
    // const token = this.cookieService.get('Authorization');
    
    // const headers = {
    //   Authorization: token,
    // };
  
    return this.http.put<Category>(`${this.apiUrl}/${category.id}?addAuth=true`, category);
  }
  

}
