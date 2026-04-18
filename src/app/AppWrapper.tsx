"use client";

import React from 'react';
import { Box, Container, Stack, useTheme, useMediaQuery } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import GlobalErrorFallback from '@/components/common/GlobalErrorFallback';
import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider, useOnboardingRefsState } from '@/context/OnboardingContext';
import { ToastProvider } from '@/providers/ToastProvider';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const onboardingRefs = useOnboardingRefsState();

  return (
    <OnboardingProvider refs={onboardingRefs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container maxWidth="md" disableGutters={isMobile} sx={{ flexGrow: 1 }}>
          <Stack spacing={{ xs: 2, md: 4 }} sx={{ py: { xs: 0, md: 2 }, height: '100%' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
          </Stack>
        </Container>
        <Footer />
      </Box>
    </OnboardingProvider>
  );
};

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
          <ScrollToTop />
          <AppContent>
            {children}
          </AppContent>
        </ErrorBoundary>
      </AuthProvider>
    </ToastProvider>
  );
}
