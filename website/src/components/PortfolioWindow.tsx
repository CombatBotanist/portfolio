import { useState } from 'react';
import styled from 'styled-components';
import { Button, Window, WindowContent, WindowHeader } from 'react95';

const Centered = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const StyledWindow = styled(Window)`
  width: 100%;
  max-width: 800px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: ${({ theme }) => theme.materialText};
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

export function PortfolioWindow() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <Centered>
      <StyledWindow>
        <StyledWindowHeader>
          <span>portfolio.exe</span>
          <Button onClick={() => setOpen(false)} aria-label='Close'>
            <span className='close-icon' />
          </Button>
        </StyledWindowHeader>
        <WindowContent>
          Welcome to my portfolio site. I'm not currently hunting for a new job so there isn't much
          content right now. I will slowly add things as I have time and inspiration.
        </WindowContent>
      </StyledWindow>
    </Centered>
  );
}
