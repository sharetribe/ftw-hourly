import React, { Fragment, useState } from 'react';
import { array, arrayOf, bool, func, object, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { ListingMainContent } from '..';
import SectionAvatar from '../../containers/ListingPage/SectionAvatar';
import ActionBarMaybe from '../../containers/ListingPage/ActionBarMaybe';
import { userDisplayNameAsString } from '../../util/data';

import { richText } from '../../util/richText';

import css from './ListingContainer.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 16;

const EmployerListingContainer = props => {
  const {
    params,
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
    handleBookingSubmit,
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

  const currentAuthor = currentListing.author;

  const displayName = userDisplayNameAsString(currentAuthor) + '.';

  const richName = (
    <span>
      {richText(displayName, {
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
          <SectionAvatar
            user={currentAuthor}
            params={params}
            richName={richName}
            initialsClassName={css.avatarInitials}
            className={css.sectionAvatar}
          />
        </div>

        <CaregiverListingMainContent
          className={css.mainContent}
          currentListing={currentListing}
          intl={intl}
          selectedTab={selectedTab}
          onSelectTab={handleSelectedTab}
          isOwnListing={isOwnListing}
          unitType={unitType}
          handleBookingSubmit={handleBookingSubmit}
          currentAuthor={currentAuthor}
          onManageDisableScrolling={onManageDisableScrolling}
          monthlyTimeSlots={monthlyTimeSlots}
          onFetchTimeSlots={onFetchTimeSlots}
          onFetchTransactionLineItems={onFetchTransactionLineItems}
          lineItems={lineItems}
          fetchLineItemsInProgress={fetchLineItemsInProgress}
          fetchLineItemsError={fetchLineItemsError}
          reviews={reviews}
        />
      </div>
    </Fragment>
  );
};

export default EmployerListingContainer;
