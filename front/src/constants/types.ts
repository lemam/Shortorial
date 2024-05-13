export interface VideoSection {
  id: number;
  start: number;
  end: number;
}

export default interface Member {
  memberId: string;
  memberEmail: string;
  memberNickname: string;
  memberPassword: string;
  memberProfile: string;
}
