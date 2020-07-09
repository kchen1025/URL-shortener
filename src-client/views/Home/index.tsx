import { Button, Snackbar, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useReducer, useState } from 'react';
import API from '../../utils/api';
import styles from './styles.styl';

interface HomeProps {}

export const Home = (props: HomeProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [mappings, setMappings] = useState([]);
  const [value, setValue] = useState('');

  async function getMappings() {
    try {
      const response = await API.get('/api/mapping');
      setMappings(response);
    } catch (err) {
      enqueueSnackbar('Error retrieving mappings', { variant: 'error' });
    }
  }

  async function submitMapping(url) {
    const response = await API.post('/api/generateShortId', { originalUrl: url });
    return response;
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
      const result = await submitMapping(value);
      if (result) {
        setMappings([...mappings, result]);
      }
      enqueueSnackbar('successful submission', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Error submitting url', { variant: 'error' });
    }
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
    </div>
  );
};
