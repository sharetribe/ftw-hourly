import React, { Fragment, useState } from 'react';
import { array, arrayOf, bool, func, object, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { ListingMainContent } from '../';
import SectionAvatar from '../../containers/ListingPage/SectionAvatar';
import ActionBarMaybe from '../../containers/ListingPage/ActionBarMaybe';

import { richText } from '../../util/richText';

import css from './ListingContent.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 16;

const CaregiverListingContent = props => {
  const {
    params,
    currentAuthor,
    formattedPrice,
    publicData,
    hostLink,
    showContactUser,
    onContactUser,
    description,
    geolocation,
    currentListing,
    reviews,
    fetchReviewsError,
    isOwnListing,
    unitType,
    onSubmit,
    bookingTitle,
    authorDisplayName,
    onManageDisableScrolling,
    monthlyTimeSlots,
    onFetchTimeSlots,
    onFetchTransactionLineItems,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    listingId,
    listingSlug,
    listingType,
    listingTab,
    intl,
  } = props;

  const actionBar = listingId ? (
    <div onClick={e => e.stopPropagation()}>
      <ActionBarMaybe
        className={css.actionBar}
        isOwnListing={isOwnListing}
        listing={currentListing}
        editParams={{
          id: listingId.uuid,
          slug: listingSlug,
          type: listingType,
          tab: listingTab,
        }}
      />
    </div>
  ) : null;

  const avatarUser = { profileImage: currentListing.images[0] };

  const { displayName = '' } = currentAuthor?.attributes.profile;
  const displayNameArray = displayName.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.substring(1);
  });
  const displayNameCapitalized = displayNameArray[0] + ' ' + displayNameArray[1];

  const richName = (
    <span>
      {richText(displayNameCapitalized + '.', {
        longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
        longWordClass: css.longWord,
      })}
    </span>
  );

  const [selectedTab, setSelectedTab] = useState('AVAILABILITY');

  const handleSelectedTab = e => {
    setSelectedTab(e.target.textContent);
  };

  return (
    <Fragment>
      <div className={css.actionBar}>{actionBar}</div>
      <div className={css.contentContainer}>
        <div className={css.userDisplay}>
          <h1 className={css.title}>{richName}</h1>
          <SectionAvatar user={avatarUser} params={params} richName={richName} />
        </div>

        <ListingMainContent
          className={css.mainContent}
          currentListing={currentListing}
          intl={intl}
          selectedTab={selectedTab}
          onSelectTab={handleSelectedTab}
        />
      </div>
    </Fragment>
  );
};

export default CaregiverListingContent;
