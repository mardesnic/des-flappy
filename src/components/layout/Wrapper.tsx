import { ReactNode } from 'react';
import { styled } from '@mui/system';
import { Container as MuiContainer, Box } from '@mui/material';
import { Navbar } from './Navbar';

interface Props {
  children: ReactNode;
}

const Content = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    paddingBlock: theme.spacing(2),
    paddingInline: theme.spacing(0),
  },
}));

export const Wrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <MuiContainer maxWidth='md'>
        <Content>{children}</Content>
      </MuiContainer>
    </>
  );
};
