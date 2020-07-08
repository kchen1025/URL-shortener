import { Button, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useEffect, useReducer, useState } from 'react';
import API from '../../utils/api';
import styles from './styles.styl';

interface HomeProps {}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const initialState = { variant: 'info', message: null };
function reducer(state, action) {
  switch (action.type) {
    case 'set_message':
      return {
        variant: action.payload.variant,
        message: action.payload.message
      };
    case 'clear_message':
      return { ...initialState };
    default:
      throw new Error();
  }
}

export const Home = (props: HomeProps) => {
  const [mappings, setMappings] = useState([]);
  const [value, setValue] = useState('');
  const [snackbarState, dispatch] = useReducer(reducer, initialState);

  async function getMappings() {
    try {
      const response = await API.get('/api/mapping');
      setMappings(response);
    } catch (err) {
      enqueueNotification('Error retrieving mappings', 'error');
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
      enqueueNotification('successful submission', 'success');
    } catch (err) {
      enqueueNotification('Error submitting url', 'error');
    }
  };

  const handleClose = () => {
    dispatch({ type: 'clear_message' });
  };

  const enqueueNotification = (message: string, variant: NotificationType) => {
    switch (variant) {
      case 'success':
        dispatch({ type: 'set_message', payload: { message, variant } });
        break;
      case 'info':
        dispatch({ type: 'set_message', payload: { message, variant } });
        break;
      case 'warning':
        dispatch({ type: 'set_message', payload: { message, variant } });
        break;
      case 'error':
        dispatch({ type: 'set_message', payload: { message, variant } });
        break;
      default:
        break;
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

      <Snackbar open={!!snackbarState.message} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarState.variant}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
