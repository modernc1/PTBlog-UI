import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../../../services/categoryService/category-service.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Category } from '../models/Category';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  
  categories$?: Observable<Category[]>;
  isAsc = true;
  currentSort = "bi bi-sort-alpha-down";
  constructor(private categoryService: CategoryServiceService, private router: Router){

  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void{
    this.categories$ = this.categoryService.getAllCategories();
  }
  
  onSearch(filter: string) : void {
    this.categories$ = this.categoryService.getAllCategories(filter);
  }

  onSort(filter?: string) : void {
    //switch icon
    this.isAsc = !this.isAsc;
    this.isAsc ? this.currentSort = "bi bi-sort-alpha-down" : this.currentSort = "bi bi-sort-alpha-down-alt";
    
    this.categories$ = this.categoryService.getAllCategories(filter, this.isAsc)
  }

  onDelete(id: string):void{
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        this.ngOnInit(); //to reload the component
      },
      error: (err) => {
        console.error('error while deleting category', err);
      }
    });
  }

  editCategory(id: string) : void{
    this.router.navigate(['admin/categories/edit', id])
  }
}
