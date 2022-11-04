import React, { Component } from 'react';
import { array, bool, func, shape, string, object } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { nonEmptyArray, composeValidators } from '../../util/validators';
import { isUploadImageOverLimitError } from '../../util/errors';
import {
  Button,
  Form,
  ValidationError,
  IconSpinner,
  Avatar,
  ImageFromFile,
} from '../../components';

import css from './EditListingPhotosForm.module.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

export class EditListingPhotosFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadDelay: false };
    this.submittedImages = [];
    this.uploadDelayTimeoutId = null;
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        initialValues={{ profileImage: this.props.profileImage }}
        render={formRenderProps => {
          const {
            form,
            className,
            fetchErrors,
            handleSubmit,
            images,
            uploadInProgress,
            intl,
            invalid,
            onImageUploadHandler,
            onRemoveImage,
            disabled,
            ready,
            saveActionMsg,
            updated,
            updateInProgress,
            profileImage,
            currentUser,
            onImageUpload,
            onProfileImageUpload,
          } = formRenderProps;

          const chooseImageText = (
            <span className={css.chooseImageText}>
              <span className={css.chooseImage}>
                <FormattedMessage id="EditListingPhotosForm.chooseImage" />
              </span>
              <span className={css.imageTypes}>
                <FormattedMessage id="EditListingPhotosForm.imageTypes" />
              </span>
            </span>
          );

          const imageRequiredMessage = intl.formatMessage({
            id: 'EditListingPhotosForm.imageRequired',
          });

          const { publishListingError, showListingsError, updateListingError, uploadImageError } =
            fetchErrors || {};
          const uploadOverLimit = isUploadImageOverLimitError(uploadImageError);

          if (uploadOverLimit) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadOverLimit" />
              </p>
            );
          } else if (uploadImageError) {
            uploadImageFailed = (
              <p className={css.error}>
                <FormattedMessage id="EditListingPhotosForm.imageUploadFailed.uploadFailed" />
              </p>
            );
          }

          // NOTE: These error messages are here since Photos panel is the last visible panel
          // before creating a new listing. If that order is changed, these should be changed too.
          // Create and show listing errors are shown above submit button
          const publishListingFailed = publishListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.publishListingFailed" />
            </p>
          ) : null;
          const showListingFailed = showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPhotosForm.showListingFailed" />
            </p>
          ) : null;

          const submittedOnce = this.submittedImages.length > 0;
          // imgs can contain added images (with temp ids) and submitted images with uniq ids.
          const arrayOfImgIds = imgs =>
            imgs.map(i => (typeof i.id === 'string' ? i.imageId : i.id));
          const imageIdsFromProps = arrayOfImgIds(images);
          const imageIdsFromPreviousSubmit = arrayOfImgIds(this.submittedImages);
          const imageArrayHasSameImages = isEqual(imageIdsFromProps, imageIdsFromPreviousSubmit);
          const pristineSinceLastSubmit = submittedOnce && imageArrayHasSameImages;

          const submitReady = (updated && pristineSinceLastSubmit) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled =
            invalid || disabled || submitInProgress || uploadInProgress || ready;

          const classes = classNames(css.root, className);

          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || currentUser.profileImage;
          const transientUser = { ...currentUser, profileImage: transientUserProfileImage };

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileuploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileuploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectRatioClassName={css.squareAspectRatio}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileuploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileuploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
              <div className={css.avatarPlaceholder}>
                <div className={css.avatarPlaceholderText}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                </div>
                <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                </div>
              </div>
            );

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedImages = images;
                handleSubmit(e);
              }}
            >
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingPhotosForm.updateFailed" />
                </p>
              ) : null}
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </h3>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
                  type="file"
                  form={null}
                  uploadImageError={uploadImageError}
                  disabled={uploadInProgress}
                >
                  {fieldProps => {
                    const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onProfileImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                <div className={css.tip}>
                  <FormattedMessage id="ProfileSettingsForm.tip" />
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>

              <Field
                component={props => {
                  const { input, meta } = props;
                  return (
                    <div className={css.imageRequiredWrapper}>
                      <input {...input} />
                      <ValidationError fieldMeta={meta} />
                    </div>
                  );
                }}
                name="images"
                type="hidden"
                validate={composeValidators(nonEmptyArray(imageRequiredMessage))}
              />

              {publishListingFailed}
              {showListingFailed}

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EditListingPhotosFormComponent.defaultProps = { fetchErrors: null, images: [] };

EditListingPhotosFormComponent.propTypes = {
  fetchErrors: shape({
    publishListingError: propTypes.error,
    showListingsError: propTypes.error,
    uploadImageError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  images: array,
  intl: intlShape.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  onRemoveImage: func.isRequired,
  profileImage: object,
};

export default compose(injectIntl)(EditListingPhotosFormComponent);
