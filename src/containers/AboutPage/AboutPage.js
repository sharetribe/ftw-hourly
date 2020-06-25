import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.css';
import image from './about-us-1056.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us | vivify Mobile Hair, Nails & Beauty"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About vivify',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>vivify. Bringing beauty to your doorstep.</h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <h2>vivify</h2><p>
verb | /ˈvɪvɪfʌɪ/</p><p>

to enliven.</p><p>
"looking beautiful leads to feeling beautiful, and feeling beautiful will simply vivify the amazing things within you."</p>
            </div>

            <div className={css.contentMain}>
              <h2>
                vivify was created for those who do both. The women slaying in the boardroom by day and the dating game by night. The stay-at-home champions raising little <strike>monsters</strike> angels but want to trade juice-stains for jaw-drops on date night.</h2><h2>
The business trippers ready to tear it up after a day of meetings. The lionesses who turn heads on the netball court and at the club, in equal measure. Whichever you are, vivify was created for <strong>you</strong>.
              </h2>

              <p>
                Our mission is to make it easy for everyone to get beauty on demand – search and book mobile hair, beauty, nail, barbering, massage and aesthetic treatments at not just a time and price that is right for you, but also in a location of your choosing. Heading straight out after work? Our top-rated treatment practitioners will come to your office. Just in town for an event? We’ll make a salon out of your hotel room. Had a crap day? Book on your way home and have a masseuse waiting for you by the time you get off the bus.
 </p><p>
Instant beauty and wellness, when and where you want it.
              </p>

              <h3 id="contact" className={css.subtitle}>Contact us.</h3>

              <p>
              If you have any questions, feedback or *touch wood* problems, contact our team on 01423 611 130 and we'd be happy to help get you vivified. Our team are around from 9-5 Monday to Friday and 10-4 Saturday.

</p><p>You might find it quicker to talk to us on the live chat option, or you can send us an email at <ExternalLink href="mailto:clientservices@vivify.ltd">clientservices@vivify.ltd</ExternalLink>.
</p><p>
You can even write us a letter, if you want. Who doesn't love a bit of proper post!? Gives you a chance to indulge your stationary obsession:</p>
<p>
Windsor House, Cornwall Road, Harrogate, North Yorkshire, HG1 2PW
</p> 
      
<h3 className={css.subtitle}>
                Do you own a mobile or freelance hair & beauty business?
              </h3>
              <p>
                vivify partners with specialists in hair, beauty, nails, massage, spa treatments, barbering and aesthetics who offer mobile services to their clients. We concentrate on two things: bringing you new customers and making sure they come back. So you can focus on what you do best, instead of the admin! For more information, visit our <ExternalLink href="http://www.google.com/">partner centre</ExternalLink>.
                </p>            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;
