import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddBlogPost } from '../models/AddBlogPost';
import { BlogpostService } from '../../../services/blogpostService/blogpost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../categories/models/Category';
import { CategoryServiceService } from '../../../services/categoryService/category-service.service';
import { UpdateBlogPost } from '../models/UpdateBlogPost';
import { ImageSelectorComponent } from '../../../shared/components/image-selector/image-selector.component';
import { ImageService } from '../../../shared/components/image-Service/image.service';

@Component({
  selector: 'app-blogpost-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule, ImageSelectorComponent],
  templateUrl: './blogpost-form.component.html',
  styleUrl: './blogpost-form.component.css'
})


export class BlogpostFormComponent implements OnInit, OnDestroy{

  errorMessage: string = "";
  isEditing: boolean = false;
  isImageSelectorVisible = false;

  model: AddBlogPost;
  categories$? : Observable<Category[]>; 
  selectedCategoriesId: string[]=[];

  activatedRouteSubscribtion?: Subscription
  GetBlogPostSubscription?: Subscription
  UpdateBlogPostSubscription?: Subscription
  CreateBlogPostSubscription?: Subscription
  ImageSelectSubscription?: Subscription


  constructor(
    private blogpostService : BlogpostService,
    private router: Router,
    private categoryService: CategoryServiceService,
    private activatedRoute: ActivatedRoute,
    private imageService: ImageService)
  {
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featureImageUrl: '',
      urlHandle: '',
      dateCreated: new Date(),
      author: '',
      isVisible: true,
      categories: []
    }
  }



  ngOnInit(): void {

    this.activatedRouteSubscribtion = this.activatedRoute.paramMap.subscribe(result=> {
      const id = result.get('id')  
      if(id){
       this.GetBlogPostSubscription = this.blogpostService.GetBlogPostById(id).subscribe({
          next: (response) => {
            this.model.author = response.author,
            this.model.content = response.content,
            this.model.dateCreated = response.dateCreated,
            this.model.featureImageUrl = response.featureImageUrl,
            this.model.isVisible = response.isVisible,
            this.model.shortDescription = response.shortDescription,
            this.model.title = response.title,
            this.model.urlHandle = response.urlHandle,
            this.model.categories = response.categories.map(c => c.id)
            
            this.selectedCategoriesId = this.model.categories;
          },
          error: (err) => this.errorMessage = err.status
        })

        this.isEditing = true
      }
    })
    this.categories$ = this.categoryService.getAllCategories(); //bcs variable is of type observable i don't need to subscribe to it 
                                                                //will do it automatically when calling it in ng-container as async
    
    this.ImageSelectSubscription = this.imageService.OnSelectImage().subscribe({
      next: (response) => {
        this.model.featureImageUrl = response.url
        this.isImageSelectorVisible = false
      }
    })
    
}



  OnSubmit(){
    if(this.isEditing === false) //Adding
    {
      this.selectedCategoriesId.forEach(catId => { this.model.categories.push(catId)})

      this.CreateBlogPostSubscription = this.blogpostService.CreateBlogPost(this.model).subscribe({
        next: Response => this.router.navigate(['admin/blogposts']),
        error: (err) => this.errorMessage = `Error Occured (${err.status})`
      });
    }
    else{

      //                        edit mode
      this.UpdateBlogPostSubscription = this.activatedRoute.paramMap.subscribe(result => {
        const id = result.get('id')
        if(id){
          
            var UpdateBlogPost: UpdateBlogPost = {
            author: this.model.author,
            content: this.model.content,
            shortDescription: this.model.shortDescription,
            title: this.model.title,
            featureImageUrl: this.model.featureImageUrl,
            urlHandle: this.model.urlHandle,
            dateCreated: this.model.dateCreated,
            isVisible: this.model.isVisible,
            categories: this.selectedCategoriesId
          }

          this.blogpostService.UpdateBlogPost(UpdateBlogPost, id).subscribe({
            next: (response) => this.router.navigate(['admin/blogposts']),
            error: (err) => this.errorMessage = `Error Occured (${err.status})`
          })
        }
      })
    }
  }

 OpenImageSelector() : void{
  this.isImageSelectorVisible = true
 }

 CloseImageSelector() : void {
  this.isImageSelectorVisible = false
 }

  ngOnDestroy(): void {
    this.GetBlogPostSubscription?.unsubscribe()
    this.UpdateBlogPostSubscription?.unsubscribe()
    this.activatedRouteSubscribtion?.unsubscribe()
    this.CreateBlogPostSubscription?.unsubscribe()
    this.ImageSelectSubscription?.unsubscribe()
  }

}



