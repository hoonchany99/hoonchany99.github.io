(function() {
  // 기본 비밀번호 해시 (SHA-256)
  // 비밀번호를 변경하려면:
  // 1. 원하는 비밀번호를 정하세요
  // 2. https://emn178.github.io/online-tools/sha256.html 에서 해시 생성
  // 3. 아래 DEFAULT_PASSWORD_HASH 값을 변경하세요
  const DEFAULT_PASSWORD_HASH = '3176108b5bdaebfe357e565413aae5b9866719e71fe093c7b7073bee070d04ff'; // 기본 비밀번호: "세종1234!"
  
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
  async function checkFtpPassword(event) {
    if (event) {
      event.preventDefault();
    }
    const input = document.getElementById('ftp-password-input');
    const errorMsg = document.getElementById('ftp-password-error');
    if (!input || !errorMsg) {
      console.error('Password input or error message element not found');
      return;
    }
    const password = input.value;
    
    if (!password) {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Please enter a password.';
      return;
    }
    
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        document.body.classList.add('ftp-authenticated');
        errorMsg.style.display = 'none';
        input.value = '';
      } else {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Invalid password. Please try again.';
        input.value = '';
        input.focus();
      }
    } catch (error) {
      console.error('Password verification error:', error);
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'An error occurred. Please try again.';
    }
  }
  
  // 폼 제출 이벤트 리스너 등록
  function setupPasswordForm() {
    const form = document.getElementById('ftp-password-form');
    const submitButton = document.getElementById('ftp-submit-button');
    const input = document.getElementById('ftp-password-input');
    
    if (!form || !submitButton || !input) {
      console.error('Form elements not found, retrying...');
      setTimeout(setupPasswordForm, 100);
      return;
    }
    
    // 폼 제출 이벤트
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      checkFtpPassword(event);
    });
    
    // 버튼 클릭 이벤트
    submitButton.addEventListener('click', function(event) {
      event.preventDefault();
      checkFtpPassword(event);
    });
    
    // Enter 키 이벤트
    input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        checkFtpPassword(event);
      }
    });
    
    console.log('Password form event listeners registered');
  }
  
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
  
  // 페이지 로드 시 실행
  function init() {
    console.log('Initializing FTP password protection...');
    checkAuthStatus().then(() => {
      setupPasswordForm();
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
