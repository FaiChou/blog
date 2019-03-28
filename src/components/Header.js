import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import ContentWrapper from "../components/ContentWrapper";

const HeaderTag = styled.header`
  width: 100%;
  padding: 16px 0;
  // border-bottom: solid 1px ${props => props.theme.colors.blackLight};
  box-shadow: 0 2px 4px rgba(0,0,0,.4);
`;

const HeaderInner = styled.div`
  position: relative;
  h1,
  h3 {
    width: 100%;
  }
  .logo {
    display: block;
    width: 165px;
    height: 37px;
    @media screen and (max-width: ${props => props.theme.responsive.small}) {
      margin: 0 auto;
    }
  }

  .logo-link {
    display: block;
    span.logo {
      font-size: 1.4em;
      font-weight: 600;
      color: white;
    }
  }
  .message-link {
    position: absolute;
    right: 0;
    top: 7px;
    display: block;
    width: 34px;
    &:hover {
      top: 5px;
    }
  }
`;

const Header = ({ title, location }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const logoLink = (
    <Link to={`/`} className="logo-link">
      <span className="logo">FaiChou's Blog</span>
    </Link>
  );

  let headerLogo;
  if (location.pathname === rootPath) {
    headerLogo = <h1>{logoLink}</h1>;
  } else {
    headerLogo = <h3>{logoLink}</h3>;
  }
  return (
    <HeaderTag>
      <ContentWrapper>
        <HeaderInner>{headerLogo}</HeaderInner>
      </ContentWrapper>
    </HeaderTag>
  );
};

export default Header;
