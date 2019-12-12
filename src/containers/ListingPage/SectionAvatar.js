import React from 'react';
import { NamedLink, AvatarLarge, AvatarMedium } from '../../components';

import css from './ListingPage.css';

const SectionAvatar = props => {
  const { user, params } = props;
  return (
    <div className={css.sectionAvatar}>
      <AvatarLarge
        user={user}
        className={css.avatarDesktop}
        initialsClassName={css.initialsDesktop}
        disableProfileLink
      />

      <AvatarMedium user={user} className={css.avatarMobile} disableProfileLink />
    </div>
  );
};

export default SectionAvatar;
