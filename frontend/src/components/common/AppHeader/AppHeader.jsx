import './AppHeader.css';

import defaultLogoImage from '../../../assets/logos/logo.png';
import defaultProfileImage from '../../../assets/images/grandma-profile.png';

function AppHeader({
  className = '',
  logoClassName = '',
  logoImage = defaultLogoImage,
  logoAlt = 'Ieobom logo',
  profileImage = defaultProfileImage,
  profileAlt = 'Profile',
  onLogoClick,
  onProfileClick,
}) {
  return (
    <header className={`app-header ${className}`}>
      <button
        type="button"
        className="app-header-logo-button"
        aria-label="처음 화면으로 돌아가기"
        title="처음 화면으로 돌아가기"
        onClick={onLogoClick}
      >
        <img
          src={logoImage}
          alt={logoAlt}
          className={`app-header-logo ${logoClassName}`}
        />
      </button>

      <button
        type="button"
        className="profile-button"
        aria-label={profileAlt}
        onClick={onProfileClick}
      >
        {profileImage && (
          <img
            src={profileImage}
            alt={profileAlt}
            className="profile-image"
          />
        )}
        <span className="profile-placeholder" />
      </button>
    </header>
  );
}

export default AppHeader;
