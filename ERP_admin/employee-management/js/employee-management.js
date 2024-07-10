// 직원 데이터 구조 (예시 데이터)
let employees = [
    {
        emp_id: 1,
        emp_name: '홍길동',
        pos_id: 3,
        emp_ssn: '123456-1234567',
        emp_phone: '010-1234-5678',
        emp_address: '서울시 강남구',
        emp_hire_date: '2022-03-01',
        emp_resign_date: null,
        emp_pension_eleg: true,
        emp_contract_date: '2022-03-01',
        loc_name: '서울 본사',
        dept_id: 1,
        emp_insurance_loss: false,
        emp_insurance_acquire: true,
        emp_welfare_card: true,
        emp_crime_check: false,
        emp_email: 'hong@example.com'
    }
];

// 직책 정의
const positions = [
    { id: 1, name: '대표이사' },
    { id: 2, name: '과장' },
    { id: 3, name: '주임' },
    { id: 4, name: '경비원' },
    { id: 5, name: '미화원' },
    { id: 6, name: '관리소장' },
    { id: 7, name: '시설원' }
];

// 필드 정의 (제목은 DB 테이블의 각 컬럼 설명으로 지정)
const employeeFields = {
    emp_id: { title: '직원 고유 번호', required: false, display: true, editable: false },
    emp_name: { title: '직원 이름', required: true, display: true, editable: true },
    pos_id: { title: '직책', required: true, display: true, editable: true },
    emp_ssn: { title: '주민등록번호', required: true, display: false, editable: true },
    emp_phone: { title: '전화번호', required: true, display: true, editable: true },
    emp_address: { title: '주소', required: false, display: false, editable: true },
    emp_hire_date: { title: '입사일', required: true, display: true, editable: true },
    emp_resign_date: { title: '퇴사일', required: false, display: false, editable: true },
    emp_pension_eleg: { title: '국민연금대상자여부', required: false, display: false, editable: false },
    emp_contract_date: { title: '근로계약서 작성일', required: false, display: false, editable: false },
    loc_name: { title: '근무 위치', required: true, display: true, editable: true },
    dept_id: { title: '부서 ID', required: true, display: false, editable: true },
    emp_insurance_loss: { title: '4대보험 상실여부', required: false, display: false, editable: false },
    emp_insurance_acquire: { title: '4대보험 취득여부', required: false, display: false, editable: false },
    emp_welfare_card: { title: '복지카드 소지 여부', required: false, display: false, editable: true },
    emp_crime_check: { title: '성범죄 이력 조회 여부', required: false, display: false, editable: true },
    emp_email: { title: '이메일 주소', required: false, display: true, editable: true }
};

// 필수 항목 및 표시 항목 정의
const requiredFields = Object.keys(employeeFields).filter(key => employeeFields[key].required && employeeFields[key].editable);
const listDisplayFields = Object.keys(employeeFields).filter(key => employeeFields[key].display);

// 유틸리티 함수
const utils = {
    calculateAge: (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    isValidSSN: (ssn) => {
        // 간단한 주민등록번호 유효성 검사 (실제로는 더 복잡한 검증이 필요)
        const regex = /^\d{6}-\d{7}$/;
        return regex.test(ssn);
    },
    sanitizeInput: (input) => {
        // XSS 방지를 위한 입력 살균
        return input.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
    }
};

// 직원 데이터 자동 계산 및 업데이트 함수
function updateEmployeeData(employeeData) {
    const birthDate = new Date(employeeData.emp_ssn.substring(0, 6));
    const hireDate = new Date(employeeData.emp_hire_date);

    employeeData.emp_pension_eleg = utils.calculateAge(birthDate) < 60;
    employeeData.emp_insurance_acquire = (new Date() - hireDate) / (1000 * 60 * 60 * 24) >= 30;
    employeeData.emp_contract_date = employeeData.emp_hire_date;
    employeeData.emp_insurance_loss = employeeData.emp_resign_date !== null;

    return employeeData;
}

// API 엔드포인트 정의
const API_ENDPOINTS = {
    EMPLOYEES: '/api/employees',
    EMPLOYEE: (id) => `/api/employees/${id}`,
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout'
};

// API 호출 함수
const api = {
    async request(url, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                // 여기에 인증 토큰 등을 추가할 수 있습니다.
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    async fetchEmployees() {
        return this.request(API_ENDPOINTS.EMPLOYEES);
    },

    async fetchEmployeeById(id) {
        return this.request(API_ENDPOINTS.EMPLOYEE(id));
    },

    async createEmployee(employeeData) {
        return this.request(API_ENDPOINTS.EMPLOYEES, 'POST', employeeData);
    },

    async updateEmployee(id, employeeData) {
        return this.request(API_ENDPOINTS.EMPLOYEE(id), 'PUT', employeeData);
    },

    async deleteEmployee(id) {
        return this.request(API_ENDPOINTS.EMPLOYEE(id), 'DELETE');
    },

    async login(credentials) {
        return this.request(API_ENDPOINTS.LOGIN, 'POST', credentials);
    },

    async logout() {
        return this.request(API_ENDPOINTS.LOGOUT, 'POST');
    }
};

// 인증 관련 기능 업데이트
const auth = {
    async login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await api.login({ username, password });
            if (response.success) {
                document.getElementById('userInfo').style.display = 'block';
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('userName').textContent = utils.sanitizeInput(username);
                // 여기서 받은 토큰을 저장할 수 있습니다.
                // localStorage.setItem('token', response.token);
                ui.showMessage('로그인 성공!');
            } else {
                ui.showMessage('로그인 실패. 사용자명과 비밀번호를 확인해주세요.', true);
            }
        } catch (error) {
            console.error('Login error:', error);
            ui.showMessage('로그인 중 오류가 발생했습니다.', true);
        }
    },

    async logout() {
        try {
            await api.logout();
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            // 저장된 토큰을 제거합니다.
            // localStorage.removeItem('token');
            ui.showMessage('로그아웃되었습니다.');
        } catch (error) {
            console.error('Logout error:', error);
            ui.showMessage('로그아웃 중 오류가 발생했습니다.', true);
        }
    }
};

// 상태 관리
let currentFilter = 'all';

// UI 관련 함수
const ui = {
    toggleSidebar: () => {
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');
        sidebar.classList.toggle('open');
        main.classList.toggle('sidebar-open');
    },
    closeSidebar: () => {
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('main');
        sidebar.classList.remove('open');
        main.classList.remove('sidebar-open');
    },
    renderEmployeeList: (employeesToRender) => {
        const tableBody = document.getElementById('employeeTableBody');
        tableBody.innerHTML = '';

        employeesToRender.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="employee-select" data-id="${employee.emp_id}"></td>
                ${listDisplayFields.map(field => {
                if (field === 'pos_id') {
                    const position = positions.find(p => p.id === employee[field]);
                    return `<td>${position ? utils.sanitizeInput(position.name) : 'Unknown'}</td>`;
                }
                return `<td>${utils.sanitizeInput(String(employee[field]))}</td>`;
            }).join('')}
                <td>
                    <button onclick="employeeManagement.editEmployee(${employee.emp_id})">수정</button>
                    <button onclick="employeeManagement.deleteEmployee(${employee.emp_id})">삭제</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        ui.updateStatusButtonStyles();
    },
    updateStatusButtonStyles: () => {
        const buttons = document.querySelectorAll('.btn-status');
        buttons.forEach(button => {
            button.classList.toggle('active', button.dataset.status === currentFilter);
        });
    },
    openEmployeeModal: (employeeId = null) => {
        const modal = document.getElementById('employeeModal');
        const form = document.getElementById('employeeForm');
        form.reset();

        ui.populatePositionOptions();

        if (employeeId) {
            api.fetchEmployeeById(employeeId).then(employee => {
                if (employee) {
                    for (const field in employeeFields) {
                        const element = document.getElementById(field);
                        if (element) {
                            if (element.type === 'checkbox') {
                                element.checked = employee[field];
                            } else {
                                element.value = employee[field] || '';
                            }
                        }
                    }
                }
                document.getElementById('modalTitle').textContent = '직원 정보 수정';
            });
        } else {
            document.getElementById('modalTitle').textContent = '새 직원 등록';
        }

        ui.handlePositionChange();
        modal.style.display = 'block';
    },
    closeModal: () => {
        document.getElementById('employeeModal').style.display = 'none';
    },
    populatePositionOptions: () => {
        const positionSelect = document.getElementById('pos_id');
        if (positionSelect) {
            positionSelect.innerHTML = positions.map(pos => `<option value="${pos.id}">${utils.sanitizeInput(pos.name)}</option>`).join('');
        } else {
            console.error('pos_id 엘리먼트를 찾을 수 없습니다.');
        }
    },
    handlePositionChange: () => {
        const positionSelect = document.getElementById('pos_id');
        const crimeCheckField = document.getElementById('emp_crime_check_field');

        if (positionSelect.value === '4') { // '4'는 경비원의 ID
            crimeCheckField.style.display = 'block';
        } else {
            crimeCheckField.style.display = 'none';
            document.getElementById('emp_crime_check').checked = false;
        }
    },
    showMessage: (message, isError = false) => {
        alert(message); // 실제 구현에서는 더 세련된 알림 UI를 사용하는 것이 좋습니다.
    }
};

// 직원 관리 주요 기능
const employeeManagement = {
    handleFormSubmit: async (e) => {
        e.preventDefault();
        const employeeId = document.getElementById('emp_id').value;
        let employeeData = {};

        for (const field in employeeFields) {
            if (employeeFields[field].editable) {
                const element = document.getElementById(field);
                if (element) {
                    if (element.type === 'checkbox') {
                        employeeData[field] = element.checked;
                    } else if (element.type === 'date') {
                        employeeData[field] = element.value || null;
                    } else {
                        employeeData[field] = utils.sanitizeInput(element.value);
                    }
                }
            }
        }

        // 필수 항목 검증
        for (let field of requiredFields) {
            if (employeeData[field] === undefined || employeeData[field] === '') {
                ui.showMessage(`${employeeFields[field].title}는 필수 항목입니다.`, true);
                return;
            }
        }

        // 주민등록번호 유효성 검사
        if (!utils.isValidSSN(employeeData.emp_ssn)) {
            ui.showMessage('유효하지 않은 주민등록번호입니다.', true);
            return;
        }

        // 자동 계산 로직 적용
        employeeData = updateEmployeeData(employeeData);

        try {
            if (employeeId) {
                await api.updateEmployee(employeeId, employeeData);
                ui.showMessage('직원 정보가 성공적으로 수정되었습니다.');
            } else {
                await api.createEmployee(employeeData);
                ui.showMessage('새 직원이 성공적으로 등록되었습니다.');
            }
            await employeeManagement.searchAndFilterEmployees();
            ui.closeModal();
        } catch (error) {
            console.error('Error saving employee:', error);
            ui.showMessage('직원 정보 저장 중 오류가 발생했습니다.', true);
        }
    },

    performBulkAction: async (action) => {
        const selectedEmployees = document.querySelectorAll('.employee-select:checked');
        if (selectedEmployees.length === 0) {
            ui.showMessage('최소한 한 명의 직원을 선택해주세요.', true);
            return;
        }

        const confirmMessage = {
            approve: '선택된 직원들을 승인하시겠습니까?',
            delete: '선택된 직원들을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.'
        }[action];

        if (confirm(confirmMessage)) {
            const errors = [];
            for (let checkbox of selectedEmployees) {
                const employeeId = parseInt(checkbox.dataset.id);
                try {
                    switch (action) {
                        case 'approve':
                            await api.updateEmployee(employeeId, { emp_resign_date: null });
                            break;
                        case 'delete':
                            await api.deleteEmployee(employeeId);
                            break;
                    }
                } catch (error) {
                    console.error(`Error performing ${action} action for employee ${employeeId}:`, error);
                    errors.push(employeeId);
                }
            }

            await employeeManagement.searchAndFilterEmployees();

            if (errors.length > 0) {
                ui.showMessage(`다음 직원들에 대한 ${action} 작업 중 오류가 발생했습니다: ${errors.join(', ')}`, true);
            } else {
                ui.showMessage(`선택된 직원들에 대한 ${action} 작업이 완료되었습니다.`);
            }
        }
    },

    toggleSelectAll: () => {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.employee-select');
        checkboxes.forEach(checkbox => checkbox.checked = selectAll.checked);
    },

    searchAndFilterEmployees: async () => {
        const searchName = document.getElementById('searchName').value.toLowerCase();
        const searchRegion = document.getElementById('searchRegion').value;
        const searchDepartment = document.getElementById('searchDepartment').value;
        const searchAuth = document.getElementById('searchAuth').value;
        
        try {
            const allEmployees = await api.fetchEmployees();
            const filteredEmployees = allEmployees.filter(employee => {
                const nameMatch = employee.emp_name.toLowerCase().includes(searchName);
                const regionMatch = searchRegion === '' || employee.loc_name === searchRegion;
                const departmentMatch = searchDepartment === '' || employee.dept_id.toString() === searchDepartment;
                const authMatch = searchAuth === '' || employee.emp_auth === searchAuth;
                const statusMatch = currentFilter === 'all' || 
                    (currentFilter === '퇴사자' ? employee.emp_resign_date !== null : employee.emp_resign_date === null);

                return nameMatch && regionMatch && departmentMatch && authMatch && statusMatch;
            });

            ui.renderEmployeeList(filteredEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            ui.showMessage('직원 정보를 불러오는 중 오류가 발생했습니다.', true);
        }
    }
};

// 초기화 함수
async function init() {
    await employeeManagement.searchAndFilterEmployees();
     // 이벤트 리스너 설정
     document.getElementById('menuToggle').addEventListener('click', (e) => {
        e.stopPropagation();
        ui.toggleSidebar();
    });
    
    // 사이드바 외 영역 클릭 시 사이드바 닫기
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target.id !== 'menuToggle') {
            ui.closeSidebar();
        }
    });

    // 사이드바 내부 클릭 시 이벤트 전파 중지
    document.querySelector('.sidebar').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.getElementById('searchName').addEventListener('input', employeeManagement.searchAndFilterEmployees);
    document.getElementById('searchRegion').addEventListener('change', employeeManagement.searchAndFilterEmployees);
    document.getElementById('searchDepartment').addEventListener('change', employeeManagement.searchAndFilterEmployees);
    document.getElementById('searchAuth').addEventListener('change', employeeManagement.searchAndFilterEmployees);

    document.querySelectorAll('.btn-status').forEach(button => {
        button.addEventListener('click', () => employeeManagement.filterByStatus(button.dataset.status));
    });

    document.querySelector('.btn-add-employee').addEventListener('click', () => ui.openEmployeeModal());
    document.getElementById('employeeForm').addEventListener('submit', employeeManagement.handleFormSubmit);
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', ui.closeModal);
    });

    document.getElementById('btnApprove').addEventListener('click', () => employeeManagement.performBulkAction('approve'));
    document.getElementById('btnDelete').addEventListener('click', () => employeeManagement.performBulkAction('delete'));
    document.getElementById('selectAll').addEventListener('change', employeeManagement.toggleSelectAll);
    document.getElementById('pos_id').addEventListener('change', ui.handlePositionChange);

    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('active');
            const submenu = this.nextElementSibling;
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.getElementById('btnLogin').addEventListener('click', auth.login);
    document.getElementById('btnLogout').addEventListener('click', auth.logout);
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener('DOMContentLoaded', init);