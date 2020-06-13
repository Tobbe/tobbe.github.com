import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { split } from 'lodash';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 3rem 0;
  span {
    font-size: 0.75rem;
  }
`;

interface DataProps {
  site: {
    siteMetadata: {
      title: string;
    };
    buildTime: string;
  };
}

const Footer = () => {
  const query = graphql`
    {
      site {
        buildTime(formatString: "DD.MM.YYYY")
      }
    }
  `;
  const render = (data: DataProps) => {
    return (
      <FooterWrapper>
        &copy; {split(data.site.buildTime, '.')[2]} by Tobbe Lundberg. All rights reserved. <br />{' '}
        <a href="https://github.com/Tobbe/tobbe.github.com">
          GitHub Repository{' '}
        </a>{' '}
        <br />
        <span>Last build: {data.site.buildTime}</span>{' '}
        {/*
          // TODO: Add attribution to Majid Hajian
          https://www.majidhajian.com/
          https://github.com/mhadaily/gatsby-starter-typescript-power-blog
        */}
      </FooterWrapper>
    );
  };

  return <StaticQuery query={query} render={render} />;
};

export { Footer };
