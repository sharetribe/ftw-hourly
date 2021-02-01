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

import css from './AboutPage.module.css';
import image from './About.png';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage, siteSavanteWeb } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About Savante',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Savante is the place where those with professional expertise can help those in need. </h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />

          <div className={css.contentWrapper}>
            {/* <div className={css.contentSide}>
              <p>Yoga was listed by UNESCO as an intangible cultural heritage.</p>
            </div> */}

            <div className={css.contentMain}>
              <h2>
                Whether you are looking for an accountant, a health practitioner or an English teacher, you can find professionals ready to help you right here at Savante.
              </h2>

              <p className={css.paragraph}>
                Browse for an expert of your choice, check their schedule and book an appointment. You will receive an online meeting invite. The appointment is conducted online so you don’t have to travel. You are not limited to just professionals in your local area. You can book an appointment with your favorite Savant no matter where they are located. We take care of payment transactions between you and your consultant. All you need is an Internet connection and a computer or personal device with audio/video functionality.
              </p>

              <h3 className={css.subtitle}>Do you have skills that you can share with others?</h3>

              <p className={css.paragraph}>
                <ExternalLink href={siteSavanteWeb}>Savante.me</ExternalLink> offers you a platform to share your professional expertise with people in need and earn an income working from home. You can accept clients from your city, your state or across the country. Our platform offers you messaging and online conferencing services, easy payment transactions and an opportunity to reach out to a vast audience. Create your profile today and become a Savant! All you need is an Internet connection, and a computer or tablet with a webcam.
              </p>

              <h3 id="contact" className={css.subtitle}>
                Below is a sample list of professionals who are offering their expertise here at Savante.com:
              </h3>
              <p className={css.paragraph}>
                <strong>Health Practitioners:</strong> Doctors, Psychiatrists, Nutritionists,... <br />
                <strong>Legal Experts:</strong> Lawyers, Legal Advisors,... <br />
                <strong>Technology Gurus:</strong> Computer Repair, Smart Home Setup, Audiophiles <br />
                <strong>Sports & Fitness Instructors:</strong> Yoga Instructors, Personal Trainers, Coaches,... <br />
                <strong>Accountants & Financial Advisors:</strong> Investment Advisors, Tax Consultants, Personal Finance Advisors,... <br />
                <strong>Educators & Teachers:</strong> English Teachers, Math Tutors, Music Teachers,... <br />
                <strong>Home Improvement & Housekeeping Consultants:</strong> Master Chefs, Interior Decorators, DIY Instructors,... <br />
                <strong>Fashionistas & Beauticians:</strong> Fashion Advisors, Makeup Artists
              </p>
              <p>
                You can also checkout our{' '}
                <ExternalLink href={siteFacebookPage}>Facebook</ExternalLink> and{' '}
                <ExternalLink href={siteTwitterPage}>Twitter</ExternalLink>.
              </p>
            </div>
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
