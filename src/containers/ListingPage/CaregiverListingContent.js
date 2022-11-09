import React, { Fragment } from 'react';
import { array, arrayOf, bool, func, object, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { Modal, BookingPanel } from '../../components';
import {
  SectionImages,
  SectionAvatar,
  SectionHeading,
  SectionDescriptionMaybe,
  SectionFeaturesMaybe,
  SectionMapMaybe,
  SectionReviews,
} from './';
import { EnquiryForm } from '../../forms';

const CaregiverListingContentComponent = props => {
  const {} = props;

  return (
    <Fragment>
      <div>
        <SectionImages
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
        />
        <div className={css.contentContainer}>
          <SectionAvatar user={currentAuthor} params={params} />
          <div className={css.mainContent}>
            <SectionHeading
              priceTitle={priceTitle}
              formattedPrice={formattedPrice}
              richTitle={richTitle}
              listingCertificate={publicData ? publicData.certificate : null}
              certificateOptions={certificateOptions}
              hostLink={hostLink}
              showContactUser={showContactUser}
              onContactUser={this.onContactUser}
            />
            <SectionDescriptionMaybe description={description} />
            <SectionFeaturesMaybe options={yogaStylesOptions} publicData={publicData} />
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
            onSubmit={handleBookingSubmit}
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
      <Modal
        id="ListingPage.enquiry"
        contentClassName={css.enquiryModalContent}
        isOpen={isAuthenticated && this.state.enquiryModalOpen}
        onClose={() => this.setState({ enquiryModalOpen: false })}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <EnquiryForm
          className={css.enquiryForm}
          submitButtonWrapperClassName={css.enquirySubmitButtonWrapper}
          listingTitle={title}
          authorDisplayName={authorDisplayName}
          sendEnquiryError={sendEnquiryError}
          onSubmit={this.onSubmitEnquiry}
          inProgress={sendEnquiryInProgress}
        />
      </Modal>
    </Fragment>
  );
};
