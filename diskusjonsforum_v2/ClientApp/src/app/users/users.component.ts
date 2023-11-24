import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from './users';

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // Initialize as an empty array

  private _listFilter: string = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredUsers = this.performFilter(value);
  }

  constructor(private _http: HttpClient) { }

  getUsers(): void {
    this._http.get<User[]>('api/user').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.users = data;
      this.filteredUsers = this.users;  // Set filteredUsers after fetching users
    });
  }

  performFilter(filterBy: string): User[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: User) =>
      user.UserName.toLocaleLowerCase().includes(filterBy));
  }

  ngOnInit(): void {
    console.log('UsersComponent created');
    this.getUsers(); // Fetch users on component initialization
  }
}
