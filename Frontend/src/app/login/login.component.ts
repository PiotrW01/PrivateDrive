import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  viewLoginForm: boolean = true;
  username = '';
  password = '';

  constructor(
    private router: Router
  )
  {}

  onLogin(): void
  {
    this.router.navigate(['dashboard']);
    console.log(`trying to log in! ${this.username} ${this.password}`);
  }

  ngOnInit(): void {
    this.router.navigate(['dashboard']);    
  }
}
