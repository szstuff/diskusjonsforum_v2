import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"; // Import the User interface or the correct path to your user interface
import { User } from './users';
@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html',
  //styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private _http: HttpClient) { }

  private _listFilter: string = '';
  get listFilter(): string{
    return this._listFilter;
  }
  set listFilter(value: string){
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredUsers = this.performFilter(value);
  }

  getUsers(): void{
    this._http.get<User[]>('api/user').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.users = data;
      this.filteredUsers = this.users;
    });
  }

  filteredUsers: User[] = this.users;
  performFilter(filterBy: string): User[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: User) =>
      user.UserName.toLocaleLowerCase().includes(filterBy));
  }

  ngOnInit(): void {
    console.log('UsersComponent created')
  }

}
