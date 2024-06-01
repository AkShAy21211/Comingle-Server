interface Follow {
  _id?: string;
  requester: string;
  recipient: string;
  timestamp: Date;
}

export default Follow;