import { Component, OnInit, Input  } from '@angular/core';
import {Dish} from '../shared/dish';
import {Params,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DishService } from '../services/dish.service'
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @Input()
    dish:Dish;
    dishIds: string[];
    prev: string;
    next: string;
    feedbackForm: FormGroup;
    feedback: Feedback;
    


  formErrors = {
    'author': '',
    'comment': '',
    'rating1':'',
   
  };
  validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Last Name is required.',
 
    },
 
  };

  constructor(private dishService:DishService,
    private route : ActivatedRoute,
    private fb: FormBuilder,
    private location:Location) { 
      this.createForm();
    }

  ngOnInit() { 
  //   this.dishService.getDishIds()
  //   .subscribe((dishIds) => this.dishIds=this.dishIds);

  //   this.route.params
  //   .pipe(switchMap((params:Params) => this.dishService.getDish(params['id'])))
  //  .subscribe(dish => {this.dish =dish; this.setPrevNext(dish.id);})
   
  this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }


  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack():void{
    this.location.back();
  }
createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required] ],
      rating1:[''],
     
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      author:'',
      comment :'',
      rating1 :'',
     
    });
    //this.feedbackFormDirective.resetForm();
  }
}
