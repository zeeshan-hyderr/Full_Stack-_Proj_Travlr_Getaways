import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrls: ['./edit-trip.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';
  loading = true;
  tripCode!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Couldn't find tripCode");
      this.router.navigate(['']);
      return;
    }

    this.tripCode = tripCode;
    this.loadTrip();
  }

  loadTrip(): void {
    this.loading = true;
    this.tripDataService.getTrip(this.tripCode).subscribe({
      next: (res: any) => {
        console.log('raw trip response', res);

        // support both array response and single object
        const record = Array.isArray(res) ? res[0] : res;

        if (!record) {
          console.warn('No trip record returned from API');
          this.loading = false;
          this.cd?.detectChanges();
          return;
        }

        // normalize date for input[type=date]
        if (record.start) {
          try {
            record.start = new Date(record.start).toISOString().slice(0, 10);
          } catch (e) {
            console.warn('Failed to normalize date', e);
          }
        }

        // patch the form
        try {
          this.editForm.patchValue(record);
          console.log('Trip patched into form', record);
        } catch (err) {
          console.error('Error patching form', err);
        }

        // update UI state
        this.loading = false;
        this.message = `Trip: ${this.tripCode} retrieved`;
        // if view still doesn't update, force change detection
        this.cd?.detectChanges();
      },
      error: (err) => {
        console.error('Error loading trip:', err);
        this.loading = false;
        this.cd?.detectChanges();
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['']);
  }

  // quick access to form fields
  get f() { return this.editForm.controls; }
}