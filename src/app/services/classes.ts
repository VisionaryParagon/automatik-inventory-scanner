export class Contact {
  _id?: string;
  first_name: string;
  last_name: string;
  image: string;
}

export class Item {
  _id?: string;
  item: string;
  checked: number;
  name: string;
  reason: string;
  date: Date;
}

export class User {
  _id?: string;
  name: string;
  items: Array<any>;
  date: Date;
}

export class Admin {
  _id?: string;
  username: string;
  password: string;
}
