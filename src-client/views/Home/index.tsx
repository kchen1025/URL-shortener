import { useAuth0 } from '@auth0/auth0-react';
import { Button, CircularProgress, makeStyles, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import LinkRow from '../../components/LinkRow';
import LoginButton from '../../components/LoginButton';
import LogoutButton from '../../components/LogoutButton';
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
  },
  buttonRoot: {
    width: '10rem',
    height: '2.3rem',
    marginLeft: '10px'
  },
  loadingRoot: {
    margin: 'auto'
  }
});

export const Home = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [mappings, setMappings] = useState([]);
  const [value, setValue] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  const classes = useStyles();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // pull in all shortened urls
  useEffect(() => {
    async function run() {
      try {
        setContentLoading(true);

        const accessToken = await getAccessTokenSilently();
        API.setAuthorization(accessToken);

        const dbMappings: IUrlMappingResponse[] = await getMappings();
        setMappings(dbMappings);
      } catch (err) {
        enqueueSnackbar(`Error pulling url mappings: ${err.friendly || ''}`, { variant: 'error' });
      } finally {
        setTimeout(() => {
          setContentLoading(false);
        }, 500);
      }
    }
    run();
  }, [isAuthenticated]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmissionLoading(true);
    try {
      const result = await submitMapping(value);
      if (result) {
        setMappings([...mappings, result]);
      }
      enqueueSnackbar('successful submission', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(`Error submitting url: ${err.friendly || ''}`, { variant: 'error' });
    } finally {
      setValue('');
      // leave some time for the page to load
      setTimeout(() => {
        setSubmissionLoading(false);
      }, 500);
    }
  };

  // update the count of visited link
  const handleUpdate = (id: number) => {
    const newMappings: IUrlMappingResponse[] = [];

    for (const elem of mappings) {
      if (elem.id === id) {
        if (elem.visited < 9) {
          newMappings.push({ ...elem, visited: elem.visited + 1 });
        }
      } else {
        newMappings.push({ ...elem });
      }
    }
    setMappings(newMappings);
  };

  // useEffect(() => {
  //   const getUserMetadata = async () => {
  //     try {
  //       const accessToken = await getAccessTokenSilently();

  //       const userDetailsByIdUrl = `/api/mapping`;
  //       console.log(accessToken);
  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       });

  //       const result = await metadataResponse.json();

  //       console.log(result);
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //   };

  //   getUserMetadata();
  // });

  return (
    <div>
      <nav className={styles.navigation}>
        <h1>URL Shortener</h1>
        <LoginButton />
        <LogoutButton />
      </nav>
      <div className={styles.placeholder} />

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {isAuthenticated ? (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        ) : (
          <div style={{ color: 'white' }}>not authed</div>
        )}
        <TextField
          InputLabelProps={{ classes: { root: classes.inputLabelRoot } }}
          InputProps={{ classes: { root: classes.inputRoot, underline: classes.inputUnderline } }}
          label="Shorten your link"
          value={value}
          onChange={handleChange}
        />
        <Button
          disabled={submissionLoading}
          classes={{ root: classes.buttonRoot }}
          variant="contained"
          color="primary"
          type="submit"
        >
          {submissionLoading ? <CircularProgress color="secondary" size={20} /> : 'Shorten'}
        </Button>
      </form>
      <section>
        {contentLoading ? (
          <div className={styles.loaderContainer}>
            <CircularProgress color="secondary" size={40} classes={{ root: classes.loadingRoot }} />
          </div>
        ) : (
          mappings
            .sort((a, b) => a.visited - b.visited)
            .map((elem, i) => <LinkRow key={`elem-${i}`} mapping={elem} handleUpdate={handleUpdate} />)
        )}
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
