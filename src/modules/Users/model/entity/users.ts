export interface IUsersDTO {
    id?: string;
    name: string;
    password: string;
    createdAt?: Date;
}

export class Users {

  public set id(id: string) {
    this.id = id;
  }

  public get id() {
    return this.id;
  }

  public set name(name: string) {
    this.name = name;
  }

  public get name() {
    return this.name;
  }

  public set password(password: string) {
    this.password = password;
  }

  public get password() {
    return this.password;
  }

  public set createdAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  public get createdAt() {
    return this.createdAt;
  }

  public set admin(admin: string) {
    this.admin = admin;
  }

  public get admin() {
    return this.admin;
  }
  
}