window.addEventListener('load',()=>{
  const $headerWrap = document.querySelector('#header_wrap')
  const $mainMenu=document.querySelectorAll('#mainmenu_list>li>a');
  const $logo= document.querySelector('#logo>a>span')
  const $subMenuList = document.querySelectorAll('.submenu_list');

  window.addEventListener('scroll', scrollEventMenu)
  let closeHeight = 120;

  function scrollEventMenu() {
    scrollposition = window.pageYOffset;
    if (scrollposition >= 30) {
      gsap.to($headerWrap, { backgroundColor: 'white', duration: 0.5 });
      for (let item of $mainMenu) {
        gsap.to(item, { color: '#1B2040', duration: 0.5 });
      }
      gsap.to($logo,{color :'#1B2040'})
      gsap.to($subMenuList,{hegiht:closeHeight})
    } else {
      gsap.to($headerWrap, { backgroundColor: 'transparent', duration: 0.5 });
      for (let item of $mainMenu) {
        gsap.to(item, { color: 'white', duration: 0.5 });
      }
      gsap.to($logo,{color :'white'})
    }
  }
})