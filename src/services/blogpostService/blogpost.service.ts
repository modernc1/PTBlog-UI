import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AddBlogPost } from '../../components/blogposts/models/AddBlogPost';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BlogpostResponse } from '../../components/blogposts/models/BlogpostResponse copy';
import { UpdateBlogPost } from '../../components/blogposts/models/UpdateBlogPost';
@Injectable({
  providedIn: 'root'
})
export class BlogpostService {

  private apiUrl = `${environment.apiUrl}/BlogPosts`;

  constructor(private http: HttpClient,

  ) 
  {

  }

    //because we are using interceptor to add authorization header
  //we will add query parameter to urls that require authorization
  //to prevent interceptor from adding header to every api call
  //then in interceptor add logic to send header to only url that has this parameter

  GetAllBlogPosts(filter?: string, sortBy : string = 'DateCreated', 
    sortDirection : string = 'dec', pageNumber : number = 1,
    pageSize : number = 10) : Observable<BlogpostResponse[]>{
      let param = new HttpParams();

      if(filter){
        param = param.set('filter', filter)
      }

      param = param.set('sortBy', sortBy)
      param = param.set('sortDirection', sortDirection)
      param = param.set('pageNumber', pageNumber)
      param = param.set('pageSize', pageSize)
      console.log('they call me')

      return this.http.get<BlogpostResponse[]>(this.apiUrl, {params: param});
  }

  GetBlogPostsCount(filter?: string) : Observable<number>{
    let param = new HttpParams();
    
    if(filter){
      param = param.set('filter', filter);  
    }
    return this.http.get<number>(`${this.apiUrl}/Count`, {params: param})
  }
  GetBlogPostById(id: string) : Observable<BlogpostResponse>{
    return this.http.get<BlogpostResponse>(`${this.apiUrl}/${id}`)
  }
  GetBlogPostByUrlHandle(urlHandle: string) : Observable<BlogpostResponse>{
    return this.http.get<BlogpostResponse>(`${this.apiUrl}/${urlHandle}`)
  }
  CreateBlogPost(blogpost : AddBlogPost) : Observable<BlogpostResponse>{
    return this.http.post<BlogpostResponse>(`${this.apiUrl}?addAuth=true`, blogpost)
  }
  UpdateBlogPost(post: UpdateBlogPost, id: string) : Observable<BlogpostResponse>{
    return this.http.put<BlogpostResponse>(`${this.apiUrl}/${id}?addAuth=true`, post)
  }
  DeleteBlogPost(id: string) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}?addAuth=true`)
  }
}
