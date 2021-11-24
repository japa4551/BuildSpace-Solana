import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants


const App = () => {
    const [ walletStatus, setWalletStatus ] = useState("Attempting to find a Solana wallet...")
    const [ walletAddress, setWalletAddress ] = useState()
    const [ inputValue, setInputValue ] = useState("")
    const [ gifList, setGifList ] = useState([])

    const TEST_GIFS = [
        'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
        'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
        'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
        'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
    ]

    const TWITTER_USER = 'buildspace'
    const TWITTER_LINK = `https://twitter.com/${TWITTER_USER}`

    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if(solana) {
                if (solana.isPhantom) 
                {
                    console.log('Phantom wallet found!')
                    setWalletStatus("Phantom Wallet Found Attempting to contact it...")

                    try
                    {
                        const response = await solana.connect({ onlyIfTrusted: true })
                        const userWallet = response.publicKey.toString()

                        console.log("Connection established with the user's wallet")
                        setWalletStatus(`Connected to Phantom Wallet 👻`)
                        setWalletAddress(userWallet)
                    }

                    catch(error)
                    {
                        console.log(error)
                        setWalletStatus("Connection to your Phantom Wallet failed!")
                    }
                }
            } 

            else 
            {
                console.log('We could not detectGet a Phantom Wallet 👻')
                setWalletStatus("We could not detect a Phantom Wallet!")
            }
        } 

        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let onPageLoad = async () => {
            await checkIfWalletIsConnected()
        }

        window.addEventListener("load", onPageLoad)
        return () => window.removeEventListener("load", onPageLoad)
    })

    useEffect(() => {
        if (walletAddress) {
            console.log('Fetching GIF list...');
            
            // Call Solana program here.

            // Set state
            setGifList(TEST_GIFS);
        }
    }, [walletAddress]);

    const onInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const sendGIF = async() => {
        if (inputValue.length > 0) console.log('Gif submitted! Gif link:', inputValue);
        else alert('Empty input. Try again.');
    }

    const connectToWalletButton = async () => {
        const { solana } = window;

        if(solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString())
            setWalletAddress(response.publicKey.toString())
            setWalletStatus(`Connected to Phantom Wallet 👻`)
        }
    }

    const renderConnectedContainer = () => (
        <div className="connected-container">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    sendGIF()
                }}
                >
                <input 
                    type="text" 
                    placeholder="Enter image/gif link!" 
                    value={inputValue}
                    onChange={onInputChange}
                />

                <button type="submit" className="cta-button submit-gif-button">Submit</button>
            </form>

            <div className="gif-grid">
            {gifList.map(gif => (
                <div className="gif-item" key={gif}>
                <img src={gif} alt={gif} />
                </div>
            ))}
            </div>
        </div>
    );

    const renderNotConnectedContainer = () => (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectToWalletButton}
            >
            Connect to Wallet
        </button>
    );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">Japa's Solana Project</p>
          <p className="sub-text">
            View memes in the blockchain ✨
          </p>
          
          <p className="sub-text loading-animation">
            {walletStatus}
          </p>

          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Powered by @${TWITTER_USER}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
