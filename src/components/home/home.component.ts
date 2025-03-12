import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BlogpostResponse } from '../blogposts/models/BlogpostResponse copy';
import { BlogpostService } from '../../services/blogpostService/blogpost.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, provideRouter, RouterLink } from '@angular/router';
import { routes } from '../../app/app.routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  blogs$?: Observable<BlogpostResponse[]>;
  filterSubscription?: Subscription;
  constructor(
    private blogService: BlogpostService,
    private activatedRoute: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    // Check if there is a query param for the search phrase
    this.filterSubscription = this.activatedRoute.queryParamMap.subscribe((param) => {
      const filter = param.get('filter');
      if (filter) {
        this.blogs$ = this.blogService.GetAllBlogPosts(filter);
      } else {
        this.blogs$ = this.blogService.GetAllBlogPosts();
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe()
  }
}
