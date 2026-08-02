/** 닉네임 아바타 이니셜 */
export function nicknameInitial(nickname: string) {
  const trimmed = nickname.trim();
  return trimmed ? trimmed.slice(0, 1) : "?";
}
