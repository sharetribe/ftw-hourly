import React from 'react';
import config from '../../config';
import { StaticPage, TopbarContainer } from '../../containers';
import {
    LayoutSingleColumn,
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,
    ExternalLink,
} from '../../components';

import css from './FAQPage.module.css';

const FAQPage = () => {
    const { siteSavanteInfor } = config;

    return (
        <StaticPage
            title="FAQ"
            schema={{
                '@context': 'http://schema.org',
                '@type': 'FAQPage',
                description: 'FAQ Savante',
                name: 'FAQ page',
            }}
        >
            <LayoutSingleColumn>
                <LayoutWrapperTopbar>
                    <TopbarContainer />
                </LayoutWrapperTopbar>

                <LayoutWrapperMain className={css.mainWrapper}>
                    <h1>Frequently Asked Questions</h1>
                    <div>
                        <h3>Why should I use Savante.com?</h3>
                        <p>Answer: Savante.com gives you the ability to book an appointment with professionals from anywhere in your city, state or country. Save on travel and get the help you need from the convenience of your home.</p>
                    </div>
                    <div>
                        <h3>How can I get more information about the service offered by the professional before I book an appointment?</h3>
                        <p>Answer: You can use our messaging service to ask any questions.</p>
                    </div>
                    <div>
                        <h3>Is the consultation fee negotiable?</h3>
                        <p>Answer: The consultation fee is set by the professional and not negotiable.</p>
                    </div>
                    <div>
                        <h3>When do I have to pay?</h3>
                        <p>Answer: Your credit card is debited when you book the appointment. All transactions are in US Dollars.</p>
                    </div>
                    <div>
                        <h3>What if I cannot make the appointment?</h3>
                        <p>Answer: If you cannot make the appointment due to circumstances beyond your control, message your professional at least 24hrs in advance to reschedule. Otherwise, there will be a 20% cancellation fee charged to your credit card.</p>
                    </div>
                    <div>
                        <h3>What should I have ready for the online appointment?</h3>
                        <p>Answer: Choose a quiet room with good lighting. Make sure you have a good Internet connection and that your computer or personal device has audio/video functionality. Open your calendar/email app and click on the conference link to begin the video conference. Clients can use a mobile phone and choose not to share their video. Professionals, however, should should use a stationary computer, laptop or tablet and always share their video.</p>
                    </div>
                    <div>
                        <h3>What is the service fee charged to professionals?</h3>
                        <p>Answer: Professionals are charged a 15% service fee for each transaction. The remaining amount is credited to your Savante.com account and can be withdrawn to your bank account at anytime. If you decide to offer a full refund to your client, a 15% service fee will apply to the transaction.</p>
                    </div>
                    <div>
                        <h3>What if I am not happy with my online appointment?</h3>
                        <p>Answer: Professionals always strive to provide their best service and appreciate good reviews. However, if you are not happy with the service, let the professional know where they can improve. The professional may decide to give you a refund of the professional fee. Reviews are removed from the professional profile when a refund is made.</p>
                    </div>
                    <div>
                        <h3>What languages are offered?</h3>
                        <p>Answer: Currently Savante.com is available to English speakers only. Other languages will be available as more professionals who can speak other languages sign up. Check the professional’s profile to see what languages they can speak.</p>
                    </div>
                    <div>
                        <h3>Are there any geographical restrictions?</h3>
                        <p>Answer for <strong>clients</strong>: If you are booking an appointment, it is best to choose a professional from your home country to avoid any time zone or language issue. However, you can choose to book an appointment with professionals from abroad. Just message them first to make sure they accept clients from abroad. <br />
                           Answer for <strong>professionals</strong>: Depending on your occupation and your professional license, you may be permitted to practice only in your home state. For example, lawyers and doctors may only offer their services in states that they are licensed to practice. In that case, you can only accept clients who are from those states. Otherwise, if the service you offer has no geographical restriction, you can accept clients from anywhere in your country or even abroad.
                        </p>
                    </div>
                    <div>
                        <h3>What should I include in my professional profile?</h3>
                        <p>Answer: Be sure to include a clear, professional picture of yourself. Clients make a lot of decisions based on what they can see. State clearly what service you offer: English Teacher, Fitness Instructor, Money Manager, Legal Advisor, etc. Explain briefly how your expertise can help potential clients.</p>
                    </div>
                    <div>
                        <h3>My question is not listed here.</h3>
                        <p>Answer: Send an email to <ExternalLink href={siteSavanteInfor}>info@savante.com</ExternalLink> and we will reply as soon as possible.</p>
                    </div>
                </LayoutWrapperMain>

                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSingleColumn>
        </StaticPage>
    );
};

export default FAQPage;