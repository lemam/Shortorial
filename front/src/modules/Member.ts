import { getDuplicateCheck } from "../apis/member";

// 아이디 유효성 검사
export async function check(
  cate: string,
  inputValue: string,
  getCheckRslt: (value: string) => void,
  inputValueSub: string = ""
) {
  switch (cate) {
    case "id":
      return checkId(inputValue, getCheckRslt);
    case "pass":
      return checkPass(inputValue, getCheckRslt);
    case "passConfirm":
      return passConfirm(inputValue, inputValueSub, getCheckRslt);
    case "nickname":
      return checkNickname(inputValue, getCheckRslt);
  }
  return false;
}

async function checkId(id: string, getCheckRslt: (value: string) => void) {
  // 입력값이 없을 경우
  if (!id) {
    getCheckRslt("아이디를 입력해주세요");
    return false;
  }

  // 조건에 맞지 않은 경우
  // 공백 없이 영어, 숫자만 입력, 4글자 이상, 13글자 이하
  const idRegex = /^[a-z\d]{4,13}$/;
  if (!idRegex.test(id)) {
    getCheckRslt("아이디는 4 ~ 13자의 영소문자, 숫자만 입력 가능합니다.");
    return false;
  }

  // 중복된 아이디인 경우
  const isDuplicate = await getDuplicateCheck("id", id);
  if (isDuplicate) {
    getCheckRslt("이미 사용 중인 아이디입니다.");
    return false;
  }

  // 모든 검사 통과!
  getCheckRslt("사용 가능한 아이디입니다.");
  return true;
}

async function checkPass(
  password: string,
  getCheckRslt: (value: string) => void
) {
  // 입력값이 없을 경우
  if (!password) {
    getCheckRslt("비밀번호를 입력해주세요.");
    return false;
  }

  // 조건에 맞지 않는 경우
  // 공백 없이 영어, 숫자, 특수문자만 입력, 6글자 이상, 16글자 이하
  const pwRegex = /^[a-zA-Z0-9!@*&-_]{6,16}$/;
  if (!pwRegex.test(password)) {
    getCheckRslt(
      "비밀번호는 6 ~ 16자의 영문, 숫자, 특수문자(!@*&-_)만 입력 가능합니다."
    );
    return false;
  }

  // 비밀번호 확인을 입력한 적이 있다면 비밀번호 확인도 같이 검사한다.
  // if (get().passwordConfirm) get().checkPasswordConfirm();

  // 모든 검사 통과!
  getCheckRslt("사용 가능한 비밀번호입니다.");
  return true;
}

async function passConfirm(
  passwordConfirm: string,
  passwordOrigin: string,
  getCheckRslt: (value: string) => void
) {
  // 입력값이 없을 경우
  if (!passwordConfirm) {
    getCheckRslt("비밀번호를 다시 한 번 입력해주세요.");
    return false;
  }

  // 비밀번호가 다른 경우
  if (passwordConfirm !== passwordOrigin) {
    getCheckRslt("비밀번호가 일치하지 않습니다.");
    return false;
  }

  // 모든 검사 통과!
  getCheckRslt("비밀번호가 일치합니다.");
  return true;
}

async function checkNickname(
  nickname: string,
  getCheckRslt: (value: string) => void
) {
  // 입력값이 없을 경우
  if (!nickname) {
    getCheckRslt("닉네임을 입력해주세요.");

    return false;
  }

  // 조건에 맞지 않은 경우
  // 공백 없이 영어, 한글, 숫자만 입력, 2글자 이상, 10글자 이하
  const nickNameRegex = /^[가-힣a-zA-Z\d]{2,10}$/;
  if (!nickNameRegex.test(nickname)) {
    getCheckRslt("닉네임은 2 ~ 10자의 한글, 영문, 숫자만 입력 가능합니다.");

    return false;
  }

  // 중복된 닉네임인 경우
  const isDuplicate = await getDuplicateCheck("nickname", nickname);
  if (isDuplicate) {
    getCheckRslt("이미 사용 중인 닉네임입니다.");
    return false;
  }

  // 모든 검사 통과!
  getCheckRslt("사용 가능한 닉네임입니다.");
  return true;
}
