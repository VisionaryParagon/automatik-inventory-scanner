export class Contact {
  _id?: string;
  first_name: string;
  last_name: string;
  image: string;
}

export class User {
  _id?: string;
  name: string;
  checked: string;
  items: Array<any>;
  date: Date;
}

export class Admin {
  _id?: string;
  username: string;
  password: string;
}
