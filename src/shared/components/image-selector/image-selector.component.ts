import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageService } from '../image-Service/image.service';
import { BlogImage } from './models/BlogImage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css'
})
export class ImageSelectorComponent implements OnInit{
  private file?: File;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>

        //Name we give to Form After #      //variable Name   //type that written after #...= in html page
  @ViewChild('ImageForm', {static: false}) imageUploadForm? : NgForm; // do this to make variable that can be used to rest form
  constructor(private imageService: ImageService) {

  }

  ngOnInit(): void {
    this.GetImages()
  }

  private GetImages(){
    this.images$ = this.imageService.GetAllImages();
  }

  OnFileUploadImage(event: Event) : void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0]; //in case files is not null get index 0
  }

  UploadImage() : void{
    if(this.file && this.fileName !== '' && this.title !== ''){
      this.imageService.UploadImage(this.file, this.fileName, this.title).subscribe({
        next: () => {
          this.GetImages();
          this.imageUploadForm?.resetForm();
        },
        error: (err) => {
          alert(`Error Has Occured ${err.name}`)
        }
      })
    }
  }

  SelectImage(blogImage: BlogImage){
    //to Select image from here and pass it to the parent component we will use imageService
    // and store the image inside BehaviorSubject in the image service class
    this.imageService.SelectImage(blogImage);
  }

  DeleteImage(id: Number){
    this.imageService.DeleteImage(id).subscribe({
      next: () => this.GetImages(),
      error: (err) => alert(`Error Has Occured ${err.name}`)
    })
  }
}
