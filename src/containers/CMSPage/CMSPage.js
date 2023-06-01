import React from 'react';
import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import PageBuilder from '../../containers/PageBuilder/PageBuilder';
import { searchListings } from '../SearchPage/SearchPage.duck';
import { getListingsById } from '../../ducks/marketplaceData.duck';





export const CMSPageComponent = props => {

  const { params, pageAssetsData, inProgress, error } = props;
  const pageId = params.pageId || props.pageId;


  if (!inProgress && error?.status === 404) {
    return <NotFoundPage />;
  }

  const searchParams = {
    pub_golfCourse: params.pageId,
    page: 1,
    perPage: 24,
    include: [
      'author',
      'images'
    ],
    'fields.listing': [
      'title',
      'geolocation',
      'price',
      'publicData'
    ],
    'fields.user': [
      'profile.displayName',
      'profile.abbreviatedName'
    ],
    'fields.image': [
      'variants.landscape-crop',
      'variants.landscape-crop2x'
    ],
    'limit.images': 1
  }
  const dispatch = useDispatch();


  React.useEffect(() => {
    dispatch(searchListings(searchParams))
  }, [])
  return (
    <>
      <PageBuilder
        pageAssetsData={pageAssetsData?.[pageId]?.data}
        inProgress={inProgress}
        schemaType="Article"
      />


    </>
  );
};

CMSPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  return { pageAssetsData, inProgress, error };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const CMSPage = compose(
  withRouter,
  connect(mapStateToProps)
)(CMSPageComponent);

export default CMSPage;
