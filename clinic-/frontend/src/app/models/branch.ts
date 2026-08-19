export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBranchInput {
  name: string;
  address: string;
  phone?: string;
}

export type UpdateBranchInput =
  Partial<CreateBranchInput>;
