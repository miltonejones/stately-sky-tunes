import React from 'react'; 
import { Helmet } from "react-helmet";
 
 
 
const PageHead = ({ page, pageTitle }) => {
  const title = [page, pageTitle || 'Home'].filter(f => !!f).join(" | ")
 return (
  <Helmet>
  <meta charSet="utf-8" />
  <title>Skytunes | {title}</title>
  <link rel="canonical" href="http://mysite.com/example" />
</Helmet>
 );
}
PageHead.defaultProps = {};
export default PageHead;
