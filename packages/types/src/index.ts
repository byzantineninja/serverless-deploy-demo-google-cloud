export interface Merit {
  _id: string;
  uid: string;
  displayName: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

/** 排行榜上的一筆功德紀錄（不含內部欄位）。 */
export type MeritEntry = Pick<Merit, 'uid' | 'displayName' | 'count'>;

export interface User {
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}
