interface Follow {
  _id: string;
  requester: string;
  recipient: string;
  status:string;
  timestamp?: Date;
}

export default Follow;