import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogpostService } from '../../../services/blogpostService/blogpost.service';
import { Observable, Subscription } from 'rxjs';
import { BlogpostResponse } from '../models/BlogpostResponse copy';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-blogposts-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './blogposts-list.component.html',
  styleUrl: './blogposts-list.component.css'
})

export class BlogpostsListComponent implements OnInit, OnDestroy{
  errorMessage : string = "";
  //blogPosts: BlogpostResponse[] = []; bcs we have no form here it is better to use async pipe ($ sign used to indicate the variable is observable)
  blogPosts$?: Observable<BlogpostResponse[]> // async pipe will automatically subscribe and unsubscribe we just had to asign the return to it
  filter?: string; 
  sortBy : string = 'DateCreated' 
  sortDirection : string = 'dec'
  pageNumber = 1
  pageSize = 1
  totalCount = 0;
  currentSort = "bi bi-sort-alpha-down";
  isAsc : boolean = false
  //pagination
  pagesCount : number[] = [];

  DeleteSubscription?: Subscription
  constructor(
    private blogpostService: BlogpostService,
    private router: Router
    )
  {

  }


  ngOnInit(): void {
    this.blogpostService.GetBlogPostsCount().subscribe({
      next: (response) => {
        
        this.totalCount = response;
        this.pagesCount = new Array(Math.ceil(response / this.pageSize));
        this.blogPosts$ = this.blogpostService.GetAllBlogPosts(undefined,
          'DateCreated',
          'dec',
          this.pageNumber,
          this.pageSize
        );
      }
    })
  }

  onSearch(filter: string = ''){
    this.blogpostService.GetBlogPostsCount(filter).subscribe({
      next: (response) => {
        
        this.totalCount = response;
        
        this.blogPosts$ = this.blogpostService.GetAllBlogPosts(filter);
      }
    });
  }

  onSort(filter? : string){
    this.isAsc = !this.isAsc;
    this.isAsc ? this.currentSort = "bi bi-sort-alpha-down" : this.currentSort = "bi bi-sort-alpha-down-alt";
    
    this.blogPosts$ = this.blogpostService.GetAllBlogPosts(filter,
      this.sortBy,
      this.isAsc? 'asc' : 'dec',
      this.pageNumber,
      this.pageSize)
  }

  OnEdit(id: string) : void{
    this.router.navigate(['admin/blogposts/edit', id])
  }

  modalRef?: BsModalRef;
 
  openModal(template: TemplateRef<void>, id: string) {
    if(confirm("حذف الدونة ؟")){
      this.OnDelete(id);
    }
  }

  OnDelete(id: string) : void {
    this.blogpostService.DeleteBlogPost(id).subscribe({
      next: (response) => this.ngOnInit(), //to reload page
      error: (err) => this.errorMessage = err.status
    })
  }

  getPrevPage(){
    if(this.pageNumber === 1){

    }
    else
    {
      this.pageNumber = this.pageNumber-1;
      this.blogPosts$ = this.blogpostService.GetAllBlogPosts(
        this.filter, 
        this.sortBy, 
        this.sortDirection, 
        this.pageNumber, 
        this.pageSize
      )  
    }
    
  }

  getPage(pageNumber: number):void {
    this.pageNumber = pageNumber
    this.blogPosts$ = this.blogpostService.GetAllBlogPosts(
      this.filter, 
      this.sortBy, 
      this.sortDirection, 
      pageNumber, 
      this.pageSize)
    // this.updateVisiblePages()
  }

  getNextPage(){
    if(this.pageNumber === this.pagesCount.length){

    }
    else
    {
      this.pageNumber = this.pageNumber+1;
      this.blogPosts$ = this.blogpostService.GetAllBlogPosts(
        this.filter, 
        this.sortBy, 
        this.sortDirection, 
        this.pageNumber, 
        this.pageSize)

        // this.updateVisiblePages()
    }
  }

  ngOnDestroy(): void {
    this.DeleteSubscription?.unsubscribe()
  }

}
