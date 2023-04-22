import React from 'react';
import { Nowrap, Flex } from '../../../styled';
import AboutModal from '../AboutModal/AboutModal';
import { useMediaQuery, useTheme  } from '@mui/material';

const AppFooter = () => {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md')); 
  return (
    <Flex
      between
      sx={{ p: (t) => t.spacing(1, 3), 
      position: 'fixed',
      backgroundColor: '#053d82',
      color: 'white',
      bottom: 0, left: 0, right: 0,  
      height: 'var(--bottom-bar-offset)' }}
      spacing={1}
    >
      {!small && <Flex spacing={2} small>
        <AboutModal />
        <Flex spacing={1}>
        <i className="fa-brands fa-github"></i>
          <Nowrap small hover onClick={() => window.open(GITHUB_URL)}>
            Github Repo
          </Nowrap>
        </Flex>
      </Flex>}

      {!small && <Nowrap small hover onClick={() => window.open(ITUNES_API)}>
        {' '}
        Powered by the <b>iTunes Search API</b>
      </Nowrap>}

      <Flex spacing={1}>
        <img src="/notify.png" style={{
          width: 32,
          height: 32
        }} alt="logo" />
        <Nowrap hover small onClick={() => window.open(XSTATE_HOME)}>
          <b>SkyTunes</b>. An xstate web application
        </Nowrap>
      </Flex>
    </Flex>
  );
};
AppFooter.defaultProps = {};
export default AppFooter;

const ITUNES_API =
  'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html';
const GITHUB_URL = 'https://github.com/miltonejones/stately-apple';
const XSTATE_HOME = 'https://xstate.js.org/';
