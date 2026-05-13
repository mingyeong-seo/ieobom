import './RoleSelectPage.css';

import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import logoImage from '../../assets/logos/logo.png';

function RoleSelectPage({ onSelectParent, onSelectGuardian }) {
  return (
    <PhoneLayout leftStatus="9:41">
      <section className="role-page">
        <img src={logoImage} alt="이어봄 로고" className="role-logo" />

        <div className="role-content">
          <h1>어떤 분이신가요?</h1>

          <button
            type="button"
            className="role-card parent"
            onClick={onSelectParent}
          >
            <div className="role-emoji">🧑‍🦳</div>

            <strong>부모님</strong>

            <p>인공지능과 대화하며 하루를 기록해요</p>

            <span>시작하기 →</span>
          </button>

          <button
            type="button"
            className="role-card guardian"
            onClick={onSelectGuardian}
          >
            <div className="role-emoji">👩‍👧‍👦</div>

            <strong>보호자 &#40;자녀 등&#41;</strong>

            <p>부모님의 하루를 확인하고 반응해요</p>

            <span>시작하기 →</span>
          </button>

          <p className="role-help">로그인 없이 체험할 수 있어요</p>
        </div>
      </section>
    </PhoneLayout>
  );
}

export default RoleSelectPage;
