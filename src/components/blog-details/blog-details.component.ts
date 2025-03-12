import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogpostResponse } from '../blogposts/models/BlogpostResponse copy';
import { BlogpostService } from '../../services/blogpostService/blogpost.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MarkdownModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.css'
})
export class BlogDetailsComponent implements OnInit{

  url : string | null = null;
  blogPost$? : Observable<BlogpostResponse>
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private blogpostService: BlogpostService
  ) {
   
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => 
        this.url = param.get('url')
    })

    //get Details

    if(this.url){
      this.blogPost$ = this.blogpostService.GetBlogPostByUrlHandle(this.url);
    }
  }
}
