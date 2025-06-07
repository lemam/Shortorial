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
  shortsChallengers: number | undefined;
  shortsLink: string;
  shortsDate: string;
  musicName: string;
  singerName: string;
}

export interface PaginationShorts {
  contents: Shorts[];
  isLastPage: boolean;
}

export interface RecomShorts {
  musicNo: number;
  shortsChallengers: number;
  shortsDate: string;
  shortsDirector: string;
  shortsLink: string;
  shortsNo: number;
  shortsTime: number;
  shortsTitle: string;
  shortsUrl: string;
  singerName: string;
  musicName: string;
}

export interface MotionButton {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
