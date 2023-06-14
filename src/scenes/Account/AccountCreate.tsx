import React, { useCallback, useEffect, useState } from 'react';
import { generateAccount } from '../../utils/AccountUtils';
import { Account } from '../../models/Account';
import AccountDetail from './AccountDetail';

const recoveryPhraseKeyName = 'recoveryPhrase';

function AccountCreate() {
  const [seedphrase, setSeedphrase] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [showRecoverInput, setShowRecoverInput] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSeedphrase(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      recoverAccount(seedphrase);
    }
  };

  const recoverAccount = useCallback(async (recoveryPhrase: string) => {
    const result = await generateAccount(recoveryPhrase);
    setAccount(result.account);

    if (localStorage.getItem(recoveryPhraseKeyName) !== recoveryPhrase) {
      localStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
    }
  }, []);

  useEffect(() => {
    const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName);
    if (localStorageRecoveryPhrase) {
      setSeedphrase(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount]);

  async function createAccount() {
    const result = await generateAccount();
    setAccount(result.account);
  }

  return (
    <div className='AccountCreate p-5 m-3 card shadow'>
      <h1>Express Wallet</h1>
      <form onSubmit={event => event.preventDefault()}>
        <button type="button" className="btn" onClick={createAccount} disabled={!termsAccepted}>
          Create Account
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => showRecoverInput ? recoverAccount(seedphrase) : setShowRecoverInput(true)}
          disabled={showRecoverInput && !seedphrase}
        >
          Recover Account
        </button>
        {showRecoverInput && (
          <div className="form-group mt-3">
            <input
              type="text"
              placeholder='Enter the unique Seedphrase or private key'
              className="form-control"
              value={seedphrase}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
        {account ? (
          <>
            <hr />
            <AccountDetail account={account} />
          </>
        ) : (
          <div className="terms">
            <p>Please accept the terms and conditions to create an account</p>
            <div className="toggle-container">
              <label htmlFor="termsToggle" className={`toggle-label ${termsAccepted ? 'accepted' : ''}`}>
                <span className="toggle-label-text">No</span>
                <div className={`toggle-button ${termsAccepted ? 'accepted' : ''}`} />
                <input
                  type="checkbox"
                  id="termsToggle"
                  className="sr-only"
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="toggle-label-text">Yes</span>
              </label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AccountCreate;
