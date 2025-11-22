import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const girlIcon = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 640 640"><path fill="#fff" d="M264 88C264 57.1 289.1 32 320 32C350.9 32 376 57.1 376 88C376 118.9 350.9 144 320 144C289.1 144 264 118.9 264 88zM240 448L214.2 448C203.3 448 195.6 437.3 199 426.9L242 297.9L193.7 363C183.2 377.2 163.1 380.2 148.9 369.6C134.7 359 131.7 339 142.3 324.8L212.8 229.8C238 196 277.7 176 320 176C362.3 176 402 196 427.2 229.9L497.7 324.9C508.2 339.1 505.3 359.1 491.1 369.7C476.9 380.3 456.9 377.3 446.3 363.1L398 298L441 426.9C444.5 437.3 436.7 448 425.8 448L400 448L400 576C400 593.7 385.7 608 368 608C350.3 608 336 593.7 336 576L336 448L304 448L304 576C304 593.7 289.7 608 272 608C254.3 608 240 593.7 240 576L240 448z"/></svg>`
);

const manIcon = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 640 640"><path fill="#fff" d="M376 88C376 57.1 350.9 32 320 32C289.1 32 264 57.1 264 88C264 118.9 289.1 144 320 144C350.9 144 376 118.9 376 88zM400 300.7L446.3 363.1C456.8 377.3 476.9 380.3 491.1 369.7C505.3 359.1 508.3 339.1 497.7 324.9L427.2 229.9C402 196 362.3 176 320 176C277.7 176 238 196 212.8 229.9L142.3 324.9C131.8 339.1 134.7 359.1 148.9 369.7C163.1 380.3 183.1 377.3 193.7 363.1L240 300.7L240 576C240 593.7 254.3 608 272 608C289.7 608 304 593.7 304 576L304 416C304 407.2 311.2 400 320 400C328.8 400 336 407.2 336 416L336 576C336 593.7 350.3 608 368 608C385.7 608 400 593.7 400 576L400 300.7z"/></svg>`
);

const MenWomanToggle = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundSize: '24px 24px',
        backgroundImage: `url("data:image/svg+xml,${girlIcon}")`,
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#d6428c', // hot pink when checked
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'pink',
        ...theme.applyStyles('dark', {
          backgroundColor: 'blue',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#1e90ff', // blue when unchecked
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '24px 24px',
      backgroundImage: `url("data:image/svg+xml,${manIcon}")`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: 'lightblue',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

export default MenWomanToggle;
