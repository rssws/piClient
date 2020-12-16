import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  today: number = Date.now();

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.today = Date.now();
    }, 1000);
  }
}
