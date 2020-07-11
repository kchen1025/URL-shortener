import { Button, makeStyles, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import LinkRow from '../../components/LinkRow';
import { IUrlMappingResponse } from '../../types';
import API from '../../utils/api';
import styles from './styles.styl';

const useStyles = makeStyles({
  inputLabelRoot: {
    color: 'white'
  },
  inputRoot: {
    color: 'white',
    width: '25rem'
  },
  inputUnderline: {
    '&:before': {
      borderBottomColor: 'white'
    },
    '&:hover:before': {
      borderBottomColor: ['white', '!important']
    }
    // '&:after': {
    //   borderBottomColor: colors.white,
    // },
  },
  buttonRoot: {
    width: '10rem',
    marginLeft: '10px'
  }
});

export const Home = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [mappings, setMappings] = useState([]);
  const [value, setValue] = useState('');

  const classes = useStyles();

  // pull in all shortened urls
  useEffect(() => {
    async function run() {
      try {
        const dbMappings: IUrlMappingResponse[] = await getMappings();
        setMappings(dbMappings);
      } catch (err) {
        enqueueSnackbar('Error pulling url mappings', { variant: 'error' });
      }
    }
    run();
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
    } finally {
      setValue('');
    }
  };

  return (
    <div>
      <nav className={styles.navigation}>
        <h1>URL Shortener</h1>
      </nav>
      <div className={styles.placeholder} />

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <TextField
          InputLabelProps={{ classes: { root: classes.inputLabelRoot } }}
          InputProps={{ classes: { root: classes.inputRoot, underline: classes.inputUnderline } }}
          label="Shorten your link"
          value={value}
          onChange={handleChange}
        />
        <Button classes={{ root: classes.buttonRoot }} variant="contained" color="primary" type="submit">
          shorten
        </Button>
      </form>

      <section>
        {mappings.map((elem, i) => (
          <LinkRow key={`elem-${i}`} mapping={elem} />
        ))}
      </section>
    </div>
  );
};

async function getMappings(): Promise<IUrlMappingResponse[]> {
  return API.get('/api/mapping');
}

async function submitMapping(url): Promise<IUrlMappingResponse[]> {
  return API.post('/api/generateShortId', { originalUrl: url });
}
