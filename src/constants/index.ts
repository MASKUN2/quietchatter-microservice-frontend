export const API = {
  TIMEOUT: 10000,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  TALK_LIST_SIZE: 6,
} as const;

export const VALIDATION = {
  TALK_MAX_LENGTH: 250,
  NICKNAME_MIN_LENGTH: 1,
  NICKNAME_MAX_LENGTH: 12,
  NICKNAME_REGEX: /^[a-zA-Z0-9가-힣][a-zA-Z0-9가-힣 _-]*[a-zA-Z0-9가-힣]$|^[a-zA-Z0-9가-힣]$/,
} as const;

export const MESSAGES = {
  ERROR: {
    DEFAULT: '알 수 없는 오류가 발생했습니다.',
    API_REQUEST_FAILED: 'API 요청에 실패했습니다.',
    TALK_POST_FAILED: '톡 등록 중 오류가 발생했습니다.',
    TALK_UPDATE_FAILED: '수정에 실패했습니다.',
    TALK_DELETE_FAILED: '삭제에 실패했습니다.',
    REACTION_FAILED: '반응 처리 중 오류가 발생했습니다.',
    VOC_SEND_FAILED: '메시지 전송에 실패했습니다.',
    LOGIN_REQUIRED: '로그인이 필요한 기능입니다.',
    INPUT_REQUIRED: '메시지를 입력해주세요.',
    NICKNAME_REQUIRED: '닉네임을 입력해주세요.',
    NICKNAME_LENGTH: '닉네임은 1~12자 사이여야 합니다.',
    NICKNAME_SPECIAL_CHARS: '닉네임에 특수문자를 포함할 수 없습니다.',
  },
  SUCCESS: {
    VOC_SENT: '소중한 의견 감사합니다!',
    TALK_DELETED: '성공적으로 삭제되었습니다.',
  },
} as const;
