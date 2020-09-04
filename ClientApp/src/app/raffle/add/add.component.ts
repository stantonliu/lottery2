import { ItemAdd } from '../../models/item/item-add.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective, FormGroup } from '@angular/forms';
import { RaffleService } from '../../services/raffle/raffle.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  loading = false;
  addRaffleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private raffleService: RaffleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddComponent>) {}

  ngOnInit(): void {
    this.addRaffleForm = this.fb.group({
      name: [null, Validators.required]
    });
  }

  onSubmit(item: ItemAdd, formDirective: FormGroupDirective): void {
    this.loading = true;
    this.raffleService.createItem(item)
      .subscribe(
        data => {
          this.snackBar.open('新增成功', '關閉', { duration: 5000 });
          formDirective.resetForm();
          this.addRaffleForm.reset();
          this.loading = false;
          this.dialogRef.close();
        },
        error => {
          this.snackBar.open('發生錯誤', '關閉', { duration: 5000 });
          this.loading = false;
        }
      );
  }
}
