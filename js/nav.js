document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.querySelectorAll('.mainmenu_list>li>a');
  const subMenuList = document.querySelectorAll('.submenu_list');
  const headerWrap = document.querySelector('.header_wrap');

  let selectedMenu = null;
  let openHeight = 250;
  let closeHeight = 120;

  for (item of mainMenu) {
    item.addEventListener('mouseenter', overMainMenu)
  }
  for (item of subMenuList) {
    item.addEventListener('mouseenter', overSubMenu)
  }
  headerWrap.addEventListener('mouseleave', inactivateMenu)

 
  function overMainMenu() {
    activateMenu(this)
  }
  function overSubMenu() {
    activateSubMenu(this)
  }

  function inactivateMenu() {
    if (selectedMenu != null) {
      selectedMenu.parentElement.classList.remove('selected')
      selectedMenu.parentElement.children[0].classList.remove('selected')
      gsap.to(subMenuList, {
        height: closeHeight, duration: 0.3, onComplete: () => {
          gsap.set(subMenuList, { display: 'none' })
        }
      })
    }
  }  


  function activateMenu(checkMenu) {
    if (selectedMenu != null && selectedMenu != checkMenu) {
      selectedMenu.parentElement.classList.remove('selected')
      selectedMenu.previousElementSibling.classList.remove('selected')
      selectedMenu.classList.remove('selected')
    }
    if (selectedMenu != checkMenu) {
      selectedMenu = checkMenu.nextElementSibling;
      selectedMenu.parentElement.classList.add('selected')
      selectedMenu.previousElementSibling.classList.add('selected')
      selectedMenu.classList.add('selected')
    }
    gsap.set(subMenuList, { display: 'block' })
    gsap.to(subMenuList, { height: openHeight, duration: 0.3 })
  }
  function activateSubMenu(checkMenu) {
    if (selectedMenu != checkMenu) {
      selectedMenu.parentElement.classList.remove('selected')
      selectedMenu.classList.remove('selected')
      selectedMenu.parentElement.children[0].classList.remove('selected')
      selectedMenu = checkMenu;
      selectedMenu.parentElement.classList.add('selected')
      selectedMenu.classList.add('selected')
      selectedMenu.parentElement.children[0].classList.add('selected')
    }
  }

})
