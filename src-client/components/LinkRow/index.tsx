import React from 'react';
import { IUrlMappingResponse } from '../../types';
import styles from './styles.styl';

interface IRowProps {
  mapping: IUrlMappingResponse;
  handleUpdate: any;
}

const Row = (props: IRowProps) => {
  const {
    mapping: { id, long_url, short_code, visited },
    handleUpdate
  } = props;

  const urlLink = `${window.location.protocol}//${window.location.host}/in/${short_code}`;

  const handleClick = () => {
    window.open(`/in/${short_code}`, '_blank');
    handleUpdate(id);
  };

  return (
    <div className={styles.linkRowContainer}>
      <div className={styles.linkRow}>{long_url}</div>
      <div className={styles.linkRow}>
        <a href="#" onClick={handleClick}>
          {urlLink}
        </a>
      </div>
      <div className={styles.linkRow}>{visited}</div>
    </div>
  );
};

export default Row;
