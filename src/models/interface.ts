export interface IAuth {
  accessToken: string;
  refreshToken: string;
}

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  unitId: string;
  departmentId: string;
  priviledge: string[];
  session: string;
  iat: number;
  exp: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMember {
  _id: string;
  isActive: boolean;
  priviledge: string[];
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICred {
  email: string;
  password: string;
}

export enum STATUS {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum STATE {
  PENDING = "PENDING",
  DONE = "DONE",
}

export enum ACCESS {
  CREATE_TICKET = "CREATE TICKET",
  MEMBERS = "MEMBERS",
  TEAMS = "TEAMS",
  CHANNELS = "CHANNELS",
  CATEGORY = "CATEGORY",
  DEPARTMENT = "DEPARTMENT",
  REQUESTER = "REQUESTER",
  SUPPORT = "SUPPORT"
}

export interface IRequest {
  _id: string;
  concern: string;
  status: boolean;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    department: {
      _id: string;
      name: string;
    }
    unit?: {
      _id: string;
      name: string
    }
  }
  ticket?: {
    _id: string
    ticketNumber: string;
    state: string;
    targetDate: Date;
    assignedSupport: Pick<IUser, "_id" | "email" | "firstName" | "lastName">
  }
  createdAt?: string;
  updatedAt?: string;
}

export interface IDepartment {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUnit {
  _id: string
  department: Pick<IDepartment, "_id" | "name">;
  isActive: boolean
  name: string
  createdAt?: string;
  updatedAt?: string;
}

export interface ITeam {
  _id: string;
  isActive: boolean;
  name: string;
  numberOfChannels: number;
  channels: Pick<IChannel, "_id" | "name" | "isActive">[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IChannel {
  _id: string;
  isActive: boolean;
  name: string;
  members: ICMember[];
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

export interface ISubCategory extends ICategoryConcern {
  category: {
    _id: string;
    name: string;
  }
}

export interface ITeamChannel {
  _id: string;
  team: string;
  channels: Pick<IChannel, "_id" | "name">[];
}

export interface ITicket {
  _id: string;
  requestId: string;
  department: Pick<IDepartment, "_id" | "name">
  requesterName: string;
  ticketNumber: string;
  doneDate: Date;
  solution: string;
  coworkers: [Pick<IMember, "_id" | "email" | "firstName" | "lastName">];
  seen: boolean;
  closeDate: Date;
  comments: [
    {
      userId: string;
      message: string;
      createdAt: Date;
    }
  ];
  tags: Array<string>;
  targetDate: Date;
  startDate: Date;
  description: string;
  state: STATE;
  status: STATUS;
  createdBy: Pick<IMember, "_id" | "email" | "firstName" | "lastName">
  closedBy: Pick<IMember, "_id" | "email" | "firstName" | "lastName">
  createdAt: Date;
  updatedAt: Date;
  team: Pick<ITeam, "_id" | "name">
  channel: Pick<IChannel, "_id" | "name">
  category: Pick<ICategoryConcern, "_id" | "name">
  subCategory: Pick<ISubCategory, "_id" | "name">[]
  user: Pick<IMember, "_id" | "email" | "firstName" | "lastName">
  requestDetails: {
    _id: string
    requester: {
      _id: string
      firstName: string;
      lastName: string;
      email: string;
      department: Pick<IDepartment, "_id" | "name">
    }
  }
  isFiled: Boolean
  DateFiled: Date
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
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  departmentId?: string;
  userId?: string;
  categoryId?: string;
}

export interface TicketArgs extends PageArgs {
  channelId: string;
  departmentId?: string;
  state?: STATE;
  statusTicket: STATUS;
  isFiled?: boolean;

  openDate?: Date;
  closedDate?: Date;
  team?: string;
}

export interface ITransferTicket {
  _id: string;
  ticketId: string;
  ticketNumber: string;
  description: string;
  createdAt: Date;
  from: {
    team: {
      _id: string;
      name: string;
    },
    channel: {
      _id: string;
      name: string
    }
  }
  to: {
    team: {
      _id: string;
      name: string;
    },
    channel: {
      _id: string;
      name: string
    }
  }
  isApproved: boolean;
  dateApproved: Date;
  remarks: string
}

// for forms
export interface IFormInputDepartment {
  name: string;
}

export interface IFormReports {
  openDate: Date
  closedDate: Date
  team: string
  channel: string
  status: STATUS
}

export interface IFormInputMember {
  firstName: string;
  lastName: string;
  departmentId: string;
  unitId: string;
  email: string;
  password: string;
  confirmPassword: string;
  priviledge: string[];
}

export interface IFormInputsLogin {
  email: string;
  password: string;
}

export interface IFormInputTicket {
  requestId: string;
  departmentId: string;
  requestName: string;
  teamId: string;
  channelId: string;
  categoryId: string;
  SubCategoryId: string[];
  userId: string;
  description: string;
  state: STATE;
  status: STATUS;
  coworkers: string[];
  startDate: Date;
  targetDate: Date;
  createdBy: string;
}

export interface IFormInputRequest {
  userId: string;
  concern: string;
}

// used in adding member to a channel
export interface IFormInputChannelMember {
  _id: string;
  mode: string;
  data: {
    userId: string;
    email: string;
    isAdmin: string;
  };
}

export interface IFormInputManageUnit {
  _id?: string;
  mode: string;
  data: {
    _id?: string;
    name: string;
  }
}


export interface IFormInputTransfer {
  ticketId: string;
  ticketNumber: string;
  description: string;
  from: {
    teamId: string;
    channelId: string;
  }
  to: {
    teamId: string;
  }
  remarks: string;
}

//  use to hold the data from request to ticket form
export interface IFormTicketData {
  requestId: string;
  concern: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  }
}