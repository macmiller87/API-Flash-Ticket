export interface IUsersDTO {
    id?: string | undefined;
    name: string;
    password: string;
    createdAt?: Date;
    admin?: string;
    wallet?: {
      user_id?: string;
      balance?: number;
  };
}

export class Users implements IUsersDTO {
  _id?: string;
  _name: string;
  _password: string;
  _createdAt?: Date;
  _admin?: string;
  _wallet?: {
    user_id?: string;
    balance?: number;
  };

  constructor(props: IUsersDTO) {
    this._id = props.id;
    this._name = props.name;
    this._password = props.password;
    this._createdAt = props.createdAt;
    this._admin = props.admin;
    this._wallet = props.wallet;
  }

  public set id(id: string | undefined) {
    this._id = id;
  }

  public get id(): string | undefined {
    return this._id;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set password(password: string) {
    this._password = password;
  }

  public get password() {
    return this._password;
  }

  public set createdAt(createdAt: Date | undefined) {
    this._createdAt = createdAt;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public set admin(admin: string | undefined) {
    this._admin = admin;
  }

  public get admin(): string | undefined {
    return this._admin;
  }

  public set user_id(user_id: string | undefined) {
    if (this._wallet && user_id !== undefined) {
      this._wallet.user_id = user_id;
    }
  }

  public get user_id(): string | undefined {
    return this._wallet?.user_id;
  }

   public set balance(balance: number | undefined) {
    if(this._wallet) {
      this._wallet.balance = balance;
    }
  }

  public get balance(): number | undefined {
    return this._wallet?.balance;
  }
  
}