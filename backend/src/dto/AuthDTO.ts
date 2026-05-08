// # Data Transfer Objects for Authentication and Contact Forms

export class RegisterDTO {
  name!: string;
  email!: string;
  password!: string;
}
export class LoginDTO {
  email!: string;
  password!: string;
}
export class ContactDTO{
  full_name!: string;
  email!: string;
  message!: string;
}