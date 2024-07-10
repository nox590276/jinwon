  // 로그인 상태 확인 및 UI 업데이트 함수
  function checkLoginStatus() {
    const token = Cookies.get('token');
    const userInfo = document.getElementById('userInfo');
    const loginForm = document.getElementById('loginForm');

    if (token) {
        // 토큰이 있으면 사용자 정보를 가져와 표시
        fetch('/api/user/info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userPosition').textContent = data.position;
            userInfo.style.display = 'block';
            loginForm.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            // 에러 발생 시 로그아웃 처리
            Cookies.remove('token');
            userInfo.style.display = 'none';
            loginForm.style.display = 'block';
        });
    } else {
        // 토큰이 없으면 로그인 폼 표시
        userInfo.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

// 로그인 함수
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            Cookies.set('token', data.token, { expires: 7 }); // 7일간 유효한 쿠키 설정
            checkLoginStatus(); // UI 업데이트
        } else {
            alert('로그인 실패. 사용자명과 비밀번호를 확인해주세요.');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('로그인 중 오류가 발생했습니다.');
    });
}

// 로그아웃 함수
function logout() {
    Cookies.remove('token');
    checkLoginStatus(); // UI 업데이트
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnLogin').addEventListener('click', login);
    document.getElementById('btnLogout').addEventListener('click', logout);
    checkLoginStatus(); // 초기 로드 시 로그인 상태 확인
});