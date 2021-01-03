import React from 'react';

const List = ({ title, data, path }) => {
  return (
    <>
      <h1>
        {title} ({data.length})
      </h1>
      <ul>
        {data.map(({ node: { uid, data: { title } } }) => (
          <li key={uid}>
            <a href={`/${path}/${uid}`} aria-label={`link-to-${path}`}>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default List;
