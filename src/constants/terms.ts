export interface TermSection {
    title: string;
    content: string;
    isImportant?: boolean;
}

export interface TermsVersion {
    version: string;
    date: string;
    sections: TermSection[];
}

export const TERMS_VERSIONS: TermsVersion[] = [
    {
        version: '1.0',
        date: '2026-02-21',
        sections: [
            {
                title: '1. 목적',
                content: '본 약관은 회원이 서비스(Quiet Chatter)를 이용함에 있어 필요한 조건 및 절차에 관한 사항 등을 규정함을 목적으로 합니다.',
            },
            {
                title: '2. 무수집 원칙 및 네이버 로그인 사용',
                content: '본 서비스는 별도의 전통적인 회원가입 폼을 운영하지 않으며, 네이버(Naver) 로그인을 통한 소셜 인증만을 지원합니다.',
            },
            {
                title: '중요 고지',
                content: '본 서비스는 사용자 식별을 위한 최소한의 고유 식별자(Naver User ID)만을 수집합니다. 수집된 네이버 식별자는 중복 가입 계정 유무를 검사하는 용도로만 사용되며, 서비스 내에서는 자체 대체 식별자로 변환되어 사용되므로 원본 식별자는 외부나 다른 회원에게 절대 노출되지 않습니다. (이름, 이메일, 전화번호 등 민감한 개인정보는 일체 수집, 요구 또는 저장하지 않습니다.)',
                isImportant: true,
            },
            {
                title: '3. 정보의 이용 및 파기',
                content: '수집된 식별자는 오직 회원의 북톡 작성 및 반응(좋아요 등) 내역을 본인과 연결하기 위한 시스템 내부 용도로만 사용됩니다. 회원이 서비스 탈퇴를 요청하거나 일정 기간 이상 미사용 시, 해당 식별데이터 및 작성 기록은 파기될 수 있습니다.',
            },
            {
                title: '4. 게시물의 권리와 책임',
                content: '회원이 본 서비스 내에 게시한 톡(Talk) 등의 게시물에 대한 책임은 전적으로 작성자 본인에게 있습니다. 타인을 비방하거나 불법적인 내용을 포함하는 게시물은 사전 통보 없이 삭제되거나 숨겨질 수 있습니다.',
            }
        ]
    }
];

// The latest terms will always be the first item in the array (assuming we unshift new ones)
export const LATEST_TERMS = TERMS_VERSIONS[0];
