import * as React from 'react';

export interface HelloProps {
  compiler: string;
  framework: string;
}

export const Hello = (props: HelloProps) => {
  return (
    <React.Fragment>
      <div>
        <h1>
          Hello from {props.compiler} ansdfd {props.framework}!
        </h1>
        <a href="/api">Backend API endsdfspoint.</a>
      </div>
    </React.Fragment>
  );
};
