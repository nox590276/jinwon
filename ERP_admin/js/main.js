document.addEventListener('DOMContentLoaded', function() {
    const employeeManagementLink = document.getElementById('employee-management');
    
    employeeManagementLink.addEventListener('mouseover', function() {
        this.classList.add('active');
    });

    employeeManagementLink.addEventListener('mouseout', function() {
        this.classList.remove('active');
    });

   /* employeeManagementLink.addEventListener('click', function(e) {
        e.preventDefault();
        // 여기에 직원관리 페이지로 이동하는 로직을 추가할 수 있습니다.
        console.log('직원관리 페이지로 이동');
        
        // 클릭 시 모든 메뉴 항목의 'active' 클래스를 제거하고 현재 항목에만 추가
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });*/
});
const submenuToggles = document.querySelectorAll('.submenu-toggle');
submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        this.querySelector('.fa-chevron-down').classList.toggle('fa-chevron-up');
    });
});