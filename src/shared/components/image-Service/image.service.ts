import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogImage } from '../image-selector/models/BlogImage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  selectedImage: BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
    id: 0,
    title: '',
    fileName: '',
    fileExtension: '',
    url: ''
  });

  private apiUrl = `${environment.apiUrl}/Images`

  constructor(private http: HttpClient) { }



  UploadImage(file: File, fileName: string, title: string) : Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('title', title)

    return this.http.post<BlogImage>(this.apiUrl, formData);
  }

  GetAllImages() : Observable<BlogImage[]> {
    return this.http.get<BlogImage[]>(this.apiUrl);
  }

  DeleteImage(id: Number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  //this function will be called in Child class (image-selector)
  //OnSelectImage() will be used in ngOnInit of parent class which will subscribe and wait for selectedImage variable to change when we select image
  //when calling SelectImage() function
  SelectImage(image: BlogImage){
    this.selectedImage.next(image); // emit a value to be able to reach it when subscribed
  }

  //this function will be called in parent class (BlogPost-Form)
  OnSelectImage() : Observable<BlogImage>{
    return this.selectedImage.asObservable()
  }
}
