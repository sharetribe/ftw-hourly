import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './PrivacyPolicy.css';

const PrivacyPolicy = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  // prettier-ignore
  return (
    <div className={classes}>
      <p className={css.lastUpdated}>Last updated: 27/3/2020</p>

      <p>Coming soon.</p>

      {/* <p>
        TThis Privacy Policy explains how KenkoFit and any of its subsidiaries or affiliates, including Kenko (collectively, “Kenko Labs”, "Kenko", “we”, “our” or “us”) collects, uses, and discloses personal data or other information about you (“Personal Information”) collected through our website ​https://paradigm.market​ (the “Site”), and the products, features,content, applications, or services we provide (collectively with the Site, the “Services”). We encourage you to read the Privacy Policy carefully. When you use the Services, you are consenting to the collection, transfer, storage, disclosure, and other uses of your information as described in this Privacy Policy.
        <br></br>
        <br></br>
        When you visit our website ​https://kenkofit.url, and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy notice. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue the use of our Sites and our services.
        <br></br>
        <br></br>
        This privacy notice applies to all information collected through our website (such as https://kenkofit.url), and/or any related services, sales, marketing or events (we refer to them collectively in this privacy notice as the "Services"). Please read this privacy notice carefully as it will help you make informed decisions about sharing your personal information with us.
      </p>

      <h2>What information do we collect?</h2>
      <p>
        We collect your Personal Information to provide, maintain, and improve our Services. To be more specific, we primarily use your Personal Information to:
        <br></br>
        <br></br>

        • Communicate with you about our news, products, services, events, technical updates, and any information that you request through the Services or that we think you might be interested;
        <br></br>
        • Track and analyze activities, usage, trends, numbers, and market insights related to our Services;
        <br></br>
        • Detect, prevent, and address security or technical issues;
        <br></br>
        • Prevent illegal activities and protect the rights and property of KenkoFit and the users; and
        <br></br>
        • Facilitate our work with vendors, agents, consultants, and other service providers.
      </p>

      <h2>How do we use your information?</h2>
      <p>
        In Short: We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below. We use the information we collect or receive:
        <br></br>
        <br></br>
        To protect our Services. We may use your information as part of our efforts to keep our Services safe and secure (for example, for fraud monitoring and prevention).
        <br></br>
        <br></br>
        To deliver services to the user. We may use your information to provide you with the requested service.
        <br></br>
        <br></br>
        To respond to user inquiries/offer support to users. We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.
        <br></br>
        <br></br>
        For other Business Purposes. We may use your information for other Business Purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Services, products, marketing, and your experience. We may use and store this information in aggregated and anonymized form so that it is not associated with individual end-users and does not include personal information. We will not use identifiable personal information without your consent.
      </p>

      <h2>3 At vero eos et accusamus</h2>
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
        voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
        cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id
        est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
        libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
        maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut
        et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
        sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
        doloribus asperiores repellat
      </p> */}
    </div>
  );
};

PrivacyPolicy.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string } = PropTypes;

PrivacyPolicy.propTypes = {
  rootClassName: string,
  className: string,
};

export default PrivacyPolicy;
