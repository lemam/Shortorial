export interface VideoSection {
  id: number;
  start: number;
  end: number;
  acc: number;
  maxAcc: number;
}

export default interface Member {
  memberId: string;
  memberEmail: string;
  memberNickname: string;
  memberPassword: string;
  memberProfile: string;
}
export interface Shorts {
  shortsNo: number;
  shortsUrl: string;
  shortsTitle: string;
  shortsDirector: string;
  shortsTime: number;
  shortsChallengers: number;
  shortsLink: string;
  shortsDate: string;
  musicName: string;
  singerName: string;
}
