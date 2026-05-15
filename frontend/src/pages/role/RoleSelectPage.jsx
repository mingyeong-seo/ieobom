import "./RoleSelectPage.css";

import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";

import logoImage from "../../assets/logos/logo.png";

function RoleSelectPage({ onSelectParent, onSelectGuardian }) {
  return (
    <PhoneLayout leftStatus="9:41">
      <section className="role-page page-enter">
        <img src={logoImage} alt="이어봄 로고" className="role-logo" />

        <div className="role-intro">
          <h1>이어봄에 오신 걸 환영해요👋</h1>
        </div>

        <div className="role-description">
          <p>
            부모님의 하루를 AI 대화로 기록하고
            <br />
            가족과 공유하는 서비스예요.
          </p>
        </div>

        <div className="role-content">
          <button
            type="button"
            className="role-card parent"
            onClick={onSelectParent}
          >
            <div className="role-emoji">🧑‍🦳</div>

            <strong>부모님</strong>

            <p>AI와 대화하며 하루를 기록해요</p>

            <span>선택하기 →</span>
          </button>

          <button
            type="button"
            className="role-card guardian"
            onClick={onSelectGuardian}
          >
            <div className="role-emoji">👩‍👧‍👦</div>

            <strong>보호자 &#40;자녀 등&#41;</strong>

            <p>부모님의 하루 이야기를 확인해요</p>

            <span>선택하기 →</span>
          </button>
        </div>

        <p className="role-select-guide">
          원하는 역할을 선택해 이어봄을 체험해보세요.
        </p>

        <p className="role-help">* MVP 체험용 프로토타입 화면입니다.</p>
      </section>
    </PhoneLayout>
  );
}

export default RoleSelectPage;
