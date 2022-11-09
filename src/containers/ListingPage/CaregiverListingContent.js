import React, { Fragment } from 'react';
import { array, arrayOf, bool, func, object, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { Modal, BookingPanel } from '../../components';
import SectionImages from './SectionImages';
import SectionAvatar from './SectionAvatar';
import SectionHeading from './SectionHeading';
import SectionDescriptionMaybe from './SectionDescriptionMaybe';
import SectionFeaturesMaybe from './SectionFeaturesMaybe';
import SectionReviews from './SectionReviews';
import SectionMapMaybe from './SectionMapMaybe';
import ActionBarMaybe from './ActionBarMaybe';

import css from './ListingPage.module.css';

const CaregiverListingContent = props => {
  const {
    params,
    currentAuthor,
    priceTitle,
    formattedPrice,
    richTitle,
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
  } = props;

  const actionBar = listingId ? (
    <div onClick={e => e.stopPropagation()}>
      <ActionBarMaybe
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

  return (
    <Fragment>
      {
        //TODO: Replace this with action bar
        /* <SectionImages
          title={title}
          listing={currentListing}
          isOwnListing={isOwnListing}
          editParams={{
            id: listingId.uuid,
            slug: listingSlug,
            type: listingType,
            tab: listingTab,
          }}
          imageCarouselOpen={this.state.imageCarouselOpen}
          onImageCarouselClose={() => this.setState({ imageCarouselOpen: false })}
          handleViewPhotosClick={handleViewPhotosClick}
          onManageDisableScrolling={onManageDisableScrolling}
        /> */
      }
      <div className={css.sectionImages}>
        <div className={css.threeToTwoWrapper}>
          <div className={css.aspectWrapper}>{actionBar}</div>
        </div>
        <div className={css.contentContainer}>
          {/* actionBar */}
          {/* <SectionAvatar user={currentAuthor} params={params} /> */}
          <div className={css.mainContent}>
            <SectionAvatar user={currentAuthor} params={params} />
            <SectionHeading
              priceTitle={priceTitle}
              formattedPrice={formattedPrice}
              richTitle={richTitle}
              hostLink={hostLink}
              showContactUser={showContactUser}
              onContactUser={onContactUser}
            />
            <SectionDescriptionMaybe description={description} />
            {/* <SectionFeaturesMaybe options={yogaStylesOptions} publicData={publicData} /> */}
            <SectionMapMaybe
              geolocation={geolocation}
              publicData={publicData}
              listingId={currentListing.id}
            />
            <SectionReviews reviews={reviews} fetchReviewsError={fetchReviewsError} />
          </div>
          <BookingPanel
            className={css.bookingPanel}
            listing={currentListing}
            isOwnListing={isOwnListing}
            unitType={unitType}
            onSubmit={onSubmit}
            title={bookingTitle}
            authorDisplayName={authorDisplayName}
            onManageDisableScrolling={onManageDisableScrolling}
            monthlyTimeSlots={monthlyTimeSlots}
            onFetchTimeSlots={onFetchTimeSlots}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CaregiverListingContent;
