import React, { FunctionComponent } from 'react';

import $ from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
}

const Card: FunctionComponent<CardProps> = ({ children }) => {
  return <div className={$.card}>{children}</div>;
};

export default Card;
