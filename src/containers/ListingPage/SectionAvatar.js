import React from 'react';
import { AvatarLarge, AvatarMedium } from '../../components';

import css from './ListingPage.module.css';

const SectionAvatar = props => {
  const { user } = props;
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
