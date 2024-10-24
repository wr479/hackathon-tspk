export function header() {
    const stickyHeader = document.getElementById('sticky-header');
    const stickyNav = document.getElementById('page-nav-sticky');
    let prevScrollPos = window.pageYOffset;
    window.onscroll = function() {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollPos > currentScrollPos) {
            if(stickyHeader) {
                stickyHeader.classList.remove('sticky-hidden');
            }
            if (stickyNav) {
                stickyNav.classList.remove('sticky-hidden');
            }
        } else {
            if(stickyHeader) {
                stickyHeader.classList.add('sticky-hidden');
            }
            if (stickyNav) {
                stickyNav.classList.add('sticky-hidden');
            }
        }

        prevScrollPos = currentScrollPos;
    }

    function docOverflowHidden() {
        document.documentElement.style.overflow = "hidden";
        stickyHeader.style.position = "fixed";
        stickyHeader.classList.remove('sticky-hidden');
    }
    function docOverflowRemove() {
        document.documentElement.style.removeProperty('overflow');
        stickyHeader.style.position = "sticky";
    }

    const inset = document.querySelector('.__inset');
    const openMenuBtn = document.querySelectorAll('.open-some-menu');
    const allMenus = document.querySelectorAll('.some-menu');
    const headerNav = document.getElementById('header__nav');

    openMenuBtn.forEach((el) => {
        const getDataOpen = el.getAttribute('data-open')
        el.addEventListener('click',() => {

            allMenus.forEach((e) => {
                e.style.maxHeight = '0';
                e.style.opacity = 0;
            })
            

            if (el.classList.contains('active')) {
                docOverflowRemove()
                headerNav.classList.remove('non-active');
                inset.classList.remove('show');
                el.classList.remove('active');
            } else {
                docOverflowHidden()
                headerNav.classList.add('non-active');
                inset.classList.add('show');
                allMenus.forEach((evt) => {
                    const getMenuData = evt.getAttribute('data-menu');
                    if(getMenuData == getDataOpen) {
                        evt.style.maxHeight = evt.scrollHeight * 2 + "px";
                        evt.style.opacity = 1;
                    }
                })

                openMenuBtn.forEach((e) => {
                    e.classList.remove('active');
                })
                el.classList.add('active');
            }
        })
    })

}

// Для корректной работы необходимо подключить и активировать эту функцию в app.js

// Пример подключения: import { header } from "./путь/к/файлу/header.js";

// Активация: header();