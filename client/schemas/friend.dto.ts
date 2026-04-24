export type friendUserType = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  img?: string;
  isActive: boolean;
  lastSeen?: Date | string;
};

export type friendRequestType = {
  id: number;
  sender: friendUserType;
  receiver: friendUserType;
  status: 'pending' | 'accepted';
  createdAt: Date | string;
  updatedAt: Date | string;
};
