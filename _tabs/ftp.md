---
# the default layout is 'page'
icon: fas fa-link
order: 4
---

<style>
  #ftp-password-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  
  body.ftp-authenticated #ftp-password-overlay {
    display: none;
  }
  
  .ftp-auth-card {
    background: var(--main-bg, #ffffff);
    border-radius: 12px;
    box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    border: 1px solid var(--main-border-color, #e5e7eb);
  }
  
  .ftp-auth-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--heading-color, #111827);
  }
  
  .ftp-auth-description {
    font-size: 0.875rem;
    color: var(--text-muted-color, #6b7280);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }
  
  .ftp-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--text-color, #111827);
    background-color: var(--main-bg, #ffffff);
    border: 1px solid var(--main-border-color, #d1d5db);
    border-radius: 6px;
    transition: all 0.2s;
    margin-bottom: 1rem;
    box-sizing: border-box;
  }
  
  .ftp-input:focus {
    outline: none;
    border-color: var(--link-color, #2563eb);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .ftp-input::placeholder {
    color: var(--text-muted-color, #9ca3af);
  }
  
  .ftp-button {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.5;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-sizing: border-box;
  }
  
  .ftp-button-primary {
    background-color: var(--link-color, #2563eb);
    color: white;
    margin-bottom: 0.75rem;
  }
  
  .ftp-button-primary:hover {
    background-color: var(--link-color, #1d4ed8);
  }
  
  .ftp-button-secondary {
    background-color: transparent;
    color: var(--text-muted-color, #6b7280);
    border: none;
    font-weight: 400;
  }
  
  .ftp-button-secondary:hover {
    background-color: var(--sidebar-bg, #f9fafb);
    color: var(--text-color, #111827);
  }
  
  .ftp-error {
    font-size: 0.875rem;
    color: #dc2626;
    margin-top: 0.75rem;
    display: none;
  }
  
  .ftp-hint-toggle {
    font-size: 0.8125rem;
    color: var(--text-muted-color, #6b7280);
    cursor: pointer;
    user-select: none;
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s;
  }
  
  .ftp-hint-toggle:hover {
    color: var(--link-color, #2563eb);
  }
  
  .ftp-hint-content {
    font-size: 0.8125rem;
    color: var(--text-muted-color, #6b7280);
    margin-top: 0.75rem;
    padding: 0.75rem;
    background-color: var(--sidebar-bg, #f9fafb);
    border-radius: 6px;
    border: 1px solid var(--main-border-color, #e5e7eb);
    display: none;
  }
  
  .ftp-hint-content.show {
    display: block;
  }
  
  @media (prefers-color-scheme: dark) {
    .ftp-hint-content {
      background-color: var(--sidebar-bg, #374151);
      border-color: var(--main-border-color, #4b5563);
    }
  }
  
  @media (prefers-color-scheme: dark) {
    .ftp-auth-card {
      background: var(--main-bg, #1f2937);
      border-color: var(--main-border-color, #374151);
    }
    
    .ftp-input {
      background-color: var(--main-bg, #1f2937);
      border-color: var(--main-border-color, #374151);
      color: var(--text-color, #f9fafb);
    }
    
    .ftp-button-secondary {
      color: var(--text-muted-color, #9ca3af);
    }
    
    .ftp-button-secondary:hover {
      background-color: var(--sidebar-bg, #374151);
      color: var(--text-color, #f9fafb);
    }
  }
</style>

<div id="ftp-password-overlay">
  <div class="ftp-auth-card">
    <h2 class="ftp-auth-title">Password Required</h2>
    <p class="ftp-auth-description">Please enter the password to access this page.</p>
    <form id="ftp-password-form" onsubmit="checkFtpPassword(event)">
      <input 
        type="password" 
        id="ftp-password-input" 
        class="ftp-input"
        placeholder="Enter password" 
        required
        autocomplete="current-password"
      />
      <div class="ftp-hint-toggle" onclick="toggleHint()">
        <span>💡</span>
        <span id="hint-toggle-text">Show hint</span>
      </div>
      <div id="ftp-hint-content" class="ftp-hint-content">
        <strong>Hint:</strong> Administrative capital + 123!
      </div>
      <button 
        type="submit"
        class="ftp-button ftp-button-primary"
      >
        Continue
      </button>
      <a 
        href="/"
        class="ftp-button ftp-button-secondary"
      >
        Go Back
      </a>
    </form>
    <p id="ftp-password-error" class="ftp-error">Invalid password. Please try again.</p>
  </div>
</div>

# Welcome to my FTP Service!

[comment]: <> (-[**file name**](/ftp/file name))

- [**test.pdf**](/ftp/test.pdf)
- [**긴급복지지원-수료증.pdf**](/ftp/긴급복지지원-수료증.pdf)
- [**보수교육이수1.jpg**](/ftp/보수교육이수1.jpg)
- [**보수교육이수2.jpg**](/ftp/보수교육이수2.jpg)
- [**minions.jpg**](/ftp/minions.jpg)
- [**보수교육이수증.jpg**](/ftp/보수교육이수증.jpg)
- [**보수교육이수증2.jpg**](/ftp/보수교육이수증2.jpg)
- [**국외여행허가서.hwp**](/ftp/국외여행허가서 양식.hwp)
- [**공중보건의사 국외여행 승인신청서-중국**](/ftp/공중보건의사 국외여행 승인신청서-중국.pdf)

<script>
(function() {
  // 기본 비밀번호 해시 (SHA-256)
  // 비밀번호를 변경하려면:
  // 1. 원하는 비밀번호를 정하세요
  // 2. https://emn178.github.io/online-tools/sha256.html 에서 해시 생성
  // 3. 아래 DEFAULT_PASSWORD_HASH 값을 변경하세요
  const DEFAULT_PASSWORD_HASH = 'ad27160791ed40b458a1352c599b937b90cee3032c7c5a31b81f28ac00baf0eb'; // 기본 비밀번호: "password"
  
  const SESSION_KEY = 'ftp_authenticated';
  
  // SHA-256 해시 생성
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // 비밀번호 확인
  async function verifyPassword(password) {
    const hash = await hashPassword(password);
    return hash === DEFAULT_PASSWORD_HASH;
  }
  
  // URL에서 비밀번호 또는 해시 추출
  function getPasswordFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      password: urlParams.get('pwd'),
      hash: urlParams.get('hash')
    };
  }
  
  // URL에서 비밀번호 파라미터 제거
  function cleanURL() {
    const url = new URL(window.location);
    url.searchParams.delete('pwd');
    url.searchParams.delete('hash');
    window.history.replaceState({}, '', url);
  }
  
  // 비밀번호 확인 함수
  window.checkFtpPassword = async function(event) {
    event.preventDefault();
    const input = document.getElementById('ftp-password-input');
    const errorMsg = document.getElementById('ftp-password-error');
    const password = input.value;
    
    const isValid = await verifyPassword(password);
    if (isValid) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      document.body.classList.add('ftp-authenticated');
      errorMsg.style.display = 'none';
      input.value = '';
    } else {
      errorMsg.style.display = 'block';
      input.value = '';
      input.focus();
    }
  };
  
  // 인증 상태 확인 및 처리
  async function checkAuthStatus() {
    // 이미 인증된 경우
    const isAuthenticated = sessionStorage.getItem(SESSION_KEY) === 'true';
    if (isAuthenticated) {
      document.body.classList.add('ftp-authenticated');
      return;
    }
    
    // URL에서 비밀번호 또는 해시 확인
    const { password, hash } = getPasswordFromURL();
    
    if (password) {
      cleanURL();
      const isValid = await verifyPassword(password);
      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        document.body.classList.add('ftp-authenticated');
      } else {
        const errorMsg = document.getElementById('ftp-password-error');
        if (errorMsg) {
          errorMsg.textContent = 'Invalid password in URL. Please try again.';
          errorMsg.style.display = 'block';
        }
      }
    } else if (hash) {
      if (hash === DEFAULT_PASSWORD_HASH) {
        cleanURL();
        sessionStorage.setItem(SESSION_KEY, 'true');
        document.body.classList.add('ftp-authenticated');
      } else {
        cleanURL();
        const errorMsg = document.getElementById('ftp-password-error');
        if (errorMsg) {
          errorMsg.textContent = 'Invalid hash in URL. Please try again.';
          errorMsg.style.display = 'block';
        }
      }
    }
  }
  
  // 힌트 토글 함수
  window.toggleHint = function() {
    const hintContent = document.getElementById('ftp-hint-content');
    const toggleText = document.getElementById('hint-toggle-text');
    
    if (hintContent.classList.contains('show')) {
      hintContent.classList.remove('show');
      toggleText.textContent = 'Show hint';
    } else {
      hintContent.classList.add('show');
      toggleText.textContent = 'Hide hint';
    }
  };
  
  // 페이지 로드 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthStatus);
  } else {
    checkAuthStatus();
  }
})();
</script>