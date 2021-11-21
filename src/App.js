import { useEffect, useState } from 'react';

import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://c.tenor.com/Nrpmif9DljAAAAAC/youtube-twitch.gif',
	'https://c.tenor.com/ae50dsVrp88AAAAC/how-sway-kanye-west.gif',
	'https://c.tenor.com/Z3EfCazQW-4AAAAd/joker-persona.gif',
	'https://c.tenor.com/jDxcgLJt0MQAAAAC/vegito-final.gif'
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const isWalletConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found.');

          const res = await solana.connect({ onlyIfTrusted: true });
          console.log('Connected with Public Key:', res.publicKey.toString());

          setWalletAddress(res.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Install Phantom Wallet!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const res = await solana.connect();
      console.log('Connected with Public Key:', res.publicKey.toString());
      setWalletAddress(res.publicKey.toString());
    }
  };

  const onInputChange = evt => {
    const { value } = evt.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length === 0)
      return console.log('Empty input. Try again.');
    
    console.log('GIF link:', inputValue);
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={evt => {
          evt.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async() => {
      await isWalletConnected();
    };

    window.addEventListener('load', onLoad);
    return() => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 Squid Game GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {walletAddress ? (
            renderConnectedContainer()
          ) : (
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
