export interface IAuth {
  accessToken: string;
  refreshToken: string;
}

export interface ICred {
  email: string;
  password: string;
}

export interface ITeam {
  _id: string;
  isActive: boolean;
  name: string;
  numberOfChannels: number;
  channels: Array<Pick<IChannel, "_id" | "name" | "isActive">>;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChannel {
  _id: string;
  isActive: boolean;
  name: string;
  members: Array<ICMember>;
  team: Pick<ITeam, "_id" | "name">;
  createdAt: string;
  updatedAt: string;
}

export interface ICMember {
  _id: string;
  isAdmin: boolean;
  userId: string;
  email: string;
}

export interface IMember {
  _id: string;
  isActive: boolean;
  priviledge: Array<string>;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryConcern {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamChannel {
  _id: string;
  team: string;
  channels: Array<Pick<IChannel, "_id" | "name">>;
}

export interface ListResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  pagingCounter: number;
  prevPage: number;
  totalDocs: number;
  totalPages: number;
}

export interface PageArgs {
  page: number;
  limit: number;
  search: string;
  status: boolean;
}

// for forms
export interface IFormInputMember {
  email: string;
  password: string;
  confirmPassword: string;
  priviledge: Array<string>;
}

export interface IFormInputsLogin {
  email: string;
  password: string;
}

export interface IFormInputTicket {
  teamId: string;
  channelId: string;
  customerId: string;
  categoryId: string;
  userId: string;
  description: string;
  state: "PENDING" | "DONE";
  status: "OPEN" | "CLOSED" | "CANCELLED";
  coworkers: Array<string>;
  startDate: Date;
  targetDate: Date;
  createdBy: string;
}
