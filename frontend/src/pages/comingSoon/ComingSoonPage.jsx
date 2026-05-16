import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import { comingSoonContent } from './comingSoonContent';

import './ComingSoonPage.css';

function ComingSoonPage({ feature = 'album', leftStatus = '9:00', onBack, onHome }) {
  const content = comingSoonContent[feature] || comingSoonContent.album;

  return (
    <PhoneLayout leftStatus={leftStatus}>
      <section className="coming-soon-page page-enter">
        <header className="coming-soon-header">
          <button type="button" aria-label="이전으로 돌아가기" onClick={onBack}>
            &lt;
          </button>
        </header>

        <main className="coming-soon-content">
          <div className="coming-soon-visual" aria-hidden="true">
            <span>{content.icon}</span>
          </div>

          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </main>

        <footer className="coming-soon-footer">
          <button type="button" className="coming-soon-home-button" onClick={onHome}>
            <span aria-hidden="true">🏠</span>
            홈으로 돌아가기
          </button>
        </footer>
      </section>
    </PhoneLayout>
  );
}

export default ComingSoonPage;
