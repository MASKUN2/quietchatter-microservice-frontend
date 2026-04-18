export const ABOUT_INTRO = `
"너는 이곳에 어울려 (You Belong Here)"

Quiet Chatter는 수줍음이 많은 사람들을 위한 조용한 독서 공간입니다.

우리는 누구나 마음 한켠에 '나만 이곳에 어울리지 않는 것은 아닐까' 하는 작은 속삭임을 품고 산다는 것을 알고 있습니다. 타인의 시선이 두려워 진솔한 생각을 삼켰던 분들, 자신의 글이 인터넷에 영원히 박제될까 망설였던 분들을 위해 이 서비스를 시작했습니다.

어느 동네 독립 서점의 책장 위, 누군가 남겨둔 따뜻한 메모에서 느꼈던 그 다정한 연결감을 디지털 세상에서도 구현하고자 합니다.
`;

export const SERVICE_PHILOSOPHY = [
    {
        title: '심리적 안전거리',
        content: '익명 뒤에 숨는 것이 아니라, 익명이라는 보호막 안에서 가장 나다운 이야기를 할 수 있는 안전한 환경을 지향합니다.',
    },
    {
        title: '휘발되는 기록, 남는 여운',
        content: '영원히 남는 기록이 주는 압박감에서 벗어나세요. 일정 시간이 지나면 사라지는 북톡은 지금 이 순간의 진심에만 집중하게 해줍니다.',
    },
    {
        title: '다정한 연결',
        content: '화려한 프로필이나 수치화된 지표 대신, 책 한 권을 매개로 한 따뜻한 감상과 공감으로 서로를 연결합니다.',
    },
];

export interface ServiceFeature {
    title: string;
    description: string;
    icon: string;
}

export const ABOUT_FEATURES: ServiceFeature[] = [
    {
        title: '완전한 익명성',
        description: '프로필이나 본명을 공개할 필요가 없습니다. 오직 당신의 생각만으로 충분합니다.',
        icon: 'Security',
    },
    {
        title: '휘발성 북톡',
        description: '작성한 글은 일정 시간이 지나면 자동으로 숨겨집니다. 가벼운 호흡으로 소통하세요.',
        icon: 'Timer',
    },
    {
        title: '따뜻한 리액션',
        description: '복잡한 댓글 대신 따뜻한 공감과 좋아요로 마음을 전할 수 있습니다.',
        icon: 'AutoAwesome',
    },
    {
        title: '독립 서점의 감성',
        description: '정형화된 알고리즘이 아닌, 누군가의 진심이 담긴 추천사를 발견하는 기쁨을 누리세요.',
        icon: 'MenuBook',
    },
];

export interface HistoryEvent {
    date: string;
    items: string[];
}

export const HISTORY_TIMELINE: HistoryEvent[] = [
    {
        date: '2026년 2월',
        items: [
            '완전한 익명성을 보장하는 네이버 간편 로그인(OAuth2) 도입',
            '홈 화면 대시보드 개편 및 실시간 업데이트 연동',
            '전체적인 타이포그래피 및 UI 여백 최적화 적용',
        ],
    },
    {
        date: '2026년 1월',
        items: [
            '빠르고 매끄러운 사용자 경험을 위한 프론트엔드 분리 론칭',
            '내가 작성한 북톡(독후감) 수정 및 삭제 기능 오픈',
            '무한 스크롤(Infinite-Scrolling) 적용으로 끊김 없는 탐색 지원',
        ],
    },
    {
        date: '2025년 11월',
        items: [
            'Quiet Chatter 첫 서비스 공식 론칭',
            '사용자가 책을 공유하고 공감할 수 있는 익명 북톡 작성 기능',
            '즉각적인 반응형 "좋아요/공감해요" 기능 신설',
            '우연한 발견을 돕는 추천 북톡 알고리즘 최초 적용',
        ],
    },
    {
        date: '2025년 10월',
        items: [
            '"Quiet Chatter: You Belong Here" 컨셉 기획',
            '나를 숨기고 진솔한 생각을 말할 수 있는 안전한 책 공간 구상',
        ],
    },
];
