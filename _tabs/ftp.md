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
    <form id="ftp-password-form">
      <input 
        type="password" 
        id="ftp-password-input" 
        class="ftp-input"
        placeholder="Enter password" 
        required
        autocomplete="current-password"
      />
      <button 
        type="submit"
        id="ftp-submit-button"
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

<script src="{{ '/assets/js/ftp-password.js' | relative_url }}"></script>