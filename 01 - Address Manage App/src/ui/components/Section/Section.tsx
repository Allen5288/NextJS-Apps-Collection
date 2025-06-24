import React, { FunctionComponent } from 'react';
import cx from 'classnames';

import $ from './Section.module.css';

type VariantType = 'light' | 'dark';
interface SectionProps {
  variant?: VariantType;
  children: React.ReactNode;
}

const Section: FunctionComponent<SectionProps> = ({ children, variant = 'light' }) => {
  return (
    <section
      className={cx($.section, {
        [$.light]: variant === 'light',
        [$.dark]: variant === 'dark'
      })}
    >
      {children}
    </section>
  );
};

export default Section;
