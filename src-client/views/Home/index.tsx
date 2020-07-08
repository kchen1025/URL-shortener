import { Button, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import styles from './styles.styl';

interface HomeProps {}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Home = (props: HomeProps) => {
  const [mappings, setMappings] = useState([]);
  const [value, setValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  async function getMappings() {
    const response = await fetch(`http://localhost:8080/api/mapping`);
    response
      .json()
      .then(res => setMappings(res))
      .catch(err => setMappings(err));
  }

  async function submitMapping(url) {
    const response = await fetch('http://localhost:8080/api/generateShortId', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'same-origin',
      cache: 'no-cache',
      body: JSON.stringify({ originalUrl: url })
    });
    const content = await response.json();
    return content;
  }

  // pull in all shortened urls
  useEffect(() => {
    getMappings();
  }, []);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      setSnackbarOpen(true);
      const result = await submitMapping(value);
      if (result) {
        setMappings([...mappings, result]);
      }
    } catch (err) {
      setMappings(err);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.container}>
      <h1>Url Shortener</h1>

      <form onSubmit={handleSubmit}>
        <TextField value={value} onChange={handleChange} />
        <Button type="submit">shorten</Button>
      </form>

      <section>
        {mappings.map((elem, i) => {
          return (
            <div key={`elem-${i}`}>
              <span>{elem.long_url}</span>
              <span> </span>
              <span>{elem.short_code}</span>
              <span> </span>
              <span>{elem.visited}</span>
            </div>
          );
        })}
      </section>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
};
