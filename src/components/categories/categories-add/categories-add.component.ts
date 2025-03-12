import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryServiceService } from '../../../services/categoryService/category-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../models/Category';

@Component({
  selector: 'app-categories-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categories-add.component.html',
  styleUrl: './categories-add.component.css'
})

export class CategoriesAddComponent implements OnInit{

  category: Category = {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "",
    urlHandle: ""
  };

  isEditing: boolean = false;

  errorMessage: string = "";

  constructor(private categoryService:CategoryServiceService,
              private router: Router,
              private currentRoute: ActivatedRoute ){ //activated route to check if we in edit mode or create mode

  }

  ngOnInit(): void {
    this.currentRoute.paramMap //paramMap get the params inside currentUrl as key : value pairs
    .subscribe((result)=> {
      const id = result.get('id') //get specific param by its name in this case it is id.
      
      if(id){ //in case it is not null then we are in edit mode
        // in Edit Mode
        this.isEditing = true

        this.categoryService.getCategoryById(id).subscribe({
          next: (result) => this.category = result,
          error: (err) => {
            this.errorMessage = `Error Occured ${err.status}`;

          }
        });

      }else{
        //creating Mode

      }
    
    });
  }

  OnSubmit() : void{

    if(this.isEditing){

      this.categoryService.editCategory(this.category).subscribe({
        next: () => this.router.navigate(['/admin/categories']),
        error: (err) => {
          this.errorMessage = `Error Occured (${err.status})`,
          console.log(err)
        }
      })

    }else{
      
      this.categoryService.AddCategory(this.category)
      .subscribe({
        next: (response) =>{ //what happen if function work fine
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => { //what happen if err happen
          this.errorMessage = `Error Occured (${err.status})`;
          
        }
      });
    }

    
  }
  
}
