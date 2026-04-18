"use client";

import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const updates = [
  '처음 방문하는 사용자를 위해 서비스 이용을 돕는 온보딩 툴팁(가이드) 시스템을 도입했습니다',
  '예기치 않은 오류 발생 시 전체 화면이 멈추지 않도록 앱 안정성(Error Boundary)을 대폭 강화했습니다',
  '북톡 작성 시 글자 수 제한 안내 및 직관적인 토스트(Toast) 알림 기능을 추가했습니다',
  '검색창에서 도서 및 저자 검색을 더 쉽게 할 수 있도록 안내 문구(Placeholder)를 개선했습니다',
  '추천 북톡을 불러올 때 화면이 덜컹거리는 현상을 막기 위해 초기 뼈대(Skeleton) UI를 개선했습니다',
  '네이버 로그인 혹은 회원가입 완료 시, 홈으로 튕기지 않고 보던 페이지로 바로 돌아가도록 UX를 개선했습니다',
];

const UpdateLog: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        최근 업데이트 내용
      </Typography>
      <List dense>
        {updates.map((text, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={`- ${text}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default UpdateLog;
