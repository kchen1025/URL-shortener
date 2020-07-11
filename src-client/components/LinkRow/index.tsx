import React from 'react';
import { IUrlMappingResponse } from '../../types';
import styles from './styles.styl';

interface IRowProps {
  mapping: IUrlMappingResponse;
}

const Row = (props: IRowProps) => {
  const {
    mapping: { long_url, short_code, visited }
  } = props;

  const urlLink = `${window.location.protocol}//${window.location.host}/in/${short_code}`;

  return (
    <div className={styles.linkRowContainer}>
      <div className={styles.linkRow}>{long_url}</div>
      <div className={styles.linkRow}>
        <a target="_blank" href={`/in/${short_code}`}>
          {urlLink}
        </a>
      </div>
      <div className={styles.linkRow}>{visited}</div>
    </div>
  );
};

export default Row;
