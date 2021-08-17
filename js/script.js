"use strict";

window.addEventListener("DOMContentLoaded", () => {
  // Табы
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParents = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParents.addEventListener("click", (event) => {
    const target = event.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // таймер

  const deadLine = "2022-10-31";

  function getTimeRamaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRamaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadLine);

  //  модальные окна

  const modalTrigger = document.querySelectorAll("[data-modale]"),
    modal = document.querySelector(".modal");

  let openModal = () => {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  };

  let closeModal = () => {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  };

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") === "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 5000);

  const showModalByScroll = () => {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  };

  window.addEventListener("scroll", showModalByScroll);

  // class for cart

  class CartMenu {
    constructor(src, alt, title, descr, price, parentSelector, ...clases) {
      this.src = src;
      this.alt = alt;
      this.tittle = title;
      this.descr = descr;
      this.price = price;
      this.clases = clases;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changetoUAH();
    }

    changetoUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement("div");

      if (this.clases.length === 0) {
        this.element = "menu__item";
        element.classList.add(this.element);
      } else {
        this.clases.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
			<img src=${this.src} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.tittle}</h3>
			<div class="menu__item-descr">${this.descr}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
				<div class="menu__item-cost">Цена:</div>
				<div class="menu__item-total"><span>${this.price}</span> грн/день
			</div>
			`;

      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  };

getResource('http://localhost:3000/menu')
  .then(data => {
      data.forEach(({img, altimg, title, descr, price}) => {
        new CartMenu(img, altimg, title, descr, price, ".menu .container").render();
      });
  });



  // getResource('http://localhost:3000/menu')
  //     .then(data => createCard(data));

  //   function createCard(data) {
  //     data.forEach(({img, altimg, title, descr, price}) => {
  //       const element = document.createElement('div');

  //       element.classList.add('menu__item');

  //       element.innerHTML = `
  //       <img src=${img} alt=${altimg}>
  //       <h3 class="menu__item-subtitle">${title}</h3>
  //       <div class="menu__item-descr">${descr}</div>
  //       <div class="menu__item-divider"></div>
  //       <div class="menu__item-price">
  //         <div class="menu__item-cost">Цена:</div>
  //         <div class="menu__item-total"><span>${price}</span> грн/день
  //       </div>
  //       `;

  //       document.querySelector('.menu .container').append(element);
  //     });
  //   }


  // new CartMenu(
  //   "img/tabs/vegy.jpg",
  //   "vegy",
  //   'Меню "Фитнес"',
  //   'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
  //   9,
  //   ".menu .container",
  //   "menu__item",
  //   "big"
  // ).render();

  // new CartMenu(
  //   "img/tabs/elite.jpg",
  //   "elite",
  //   "Меню “Премиум”",
  //   "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
  //   18,
  //   ".menu .container",
  //   "menu__item"
  // ).render();

  // new CartMenu(
  //   "img/tabs/post.jpg",
  //   "post",
  //   'Меню "Постное"',
  //   "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
  //   14,
  //   ".menu .container",
  //   "menu__item"
  // ).render();

  // axios Библиотека 

	//   axios.get('http://localhost:3000/menu')
	//   .then(data => {
	//     data.data.forEach(({img, altimg, title, descr, price}) => {
	//     	new CartMenu(img, altimg, title, descr, price, ".menu .container").render();
	// 	});
	//   });




  // FORMS

  const forms = document.querySelectorAll("form");

  const message = {
    loading: "img/form/spinner.svg",
    success: "СПАСИБО МЫ С ВАМИ СВЯЖЕМСЯ",
    failure: "ОЙ ХАЛЕПА, ЩОСЬ ПОШЛО НЕ ТАК...",
  };

  forms.forEach((i) => {
    bindPostData(i);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json"},
      body: data
    });

    return await res.json();
  };



  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			margin-top: 25px
			`;

      form.insertAdjacentElement("afterend", statusMessage);

		const formData = new FormData(form);

    const json = JSON.stringify(Object.fromEntries(formData.entries()));

    postData("http://localhost:3000/requests",json)
    .then((data) => {
      console.log(data);
      showThanksModal(message.success);
      statusMessage.remove();
    })
    .catch(() => {
      showThanksModal(message.failure);
    })
    .finally(() => {
      form.reset();
    });
    });
  }


  function showThanksModal(message) {
    	const prevModalDialog = document.querySelector(".modal__dialog");

    	prevModalDialog.classList.add("hide");
    	openModal();

		const thanksModal = document.createElement("div");
		thanksModal.classList.add("modal__dialog");
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
			`;

		document.querySelector(".modal").append(thanksModal);

		setTimeout(() => {
		thanksModal.remove();
		prevModalDialog.classList.add("show");
		prevModalDialog.classList.remove("hide");
		closeModal();
		}, 4000);
  }

  // fetch('http://localhost:3000/menu')
  //   .then(data => data.json())
  //   .then(res => console.log(res));

  // // // // // // // // // // // // // // // // Cлайдер

  	const slides = document.querySelectorAll('.offer__slide'),
  		slider = document.querySelector('.offer__slider'),
  		sliderPreview = document.querySelector('.offer__slider-prev'),
		sliderNext = document.querySelector('.offer__slider-next'),
		current = document.querySelector('#current'),
		total = document.querySelector('#total'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),	
  		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1;
	let offset = 0;

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
		
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

  	slidesField.style.width = 100 * slides.length + '%';
  	slidesField.style.display = 'flex';
	slidesField.style.transition = 'all 0.9s ease';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const dots = document.createElement('ol'),
		  dotsArray = [];
	dots.classList.add('carousel-indicators');

	dots.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;

	slider.append(dots);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`;

		if (i === 0) {
			dot.style.opacity = 1;
		}
		dots.append(dot);
		dotsArray.push(dot);
	}

  function deleteNotDigints(str) {
		return +str.replace(/\D/g, '');
  }


	sliderNext.addEventListener('click', () => {
		if (offset == deleteNotDigints(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += deleteNotDigints(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dotsArray.forEach(dot => {
			dot.style.opacity = '.5';
		});
		dotsArray[slideIndex - 1].style.opacity = 1;
	});

	sliderPreview.addEventListener('click', () => {
		if (offset == 0 ) {
			offset = deleteNotDigints(width) * (slides.length - 1);
			
		} else {
			offset -= deleteNotDigints(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex === 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}


		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dotsArray.forEach(dot => {
			dot.style.opacity = '.5';
		});
		dotsArray[slideIndex - 1].style.opacity = 1;
	});

	dotsArray.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigints(width) * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}

			dotsArray.forEach(dot => {
				dot.style.opacity = '.5';
			});
			dotsArray[slideIndex - 1].style.opacity = 1;
		});
	});















	// showSlide(slideIndex);

	// if (slides.length < 10) {
	// 	total.textContent = `0${slides.length}`;
	// } else {
	// 	total.textContent = slide.length;
	// }

	// function showSlide(n) {
	// 	if (n > slides.length) {
	// 		slideIndex = 1;
	// 	}

	// 	if (n < 1) {
	// 		slideIndex = slides.length;
	// 	}

	// 	slides.forEach(item => item.style.display = 'none');
		
	// 	slides[slideIndex - 1].style.display = 'block';
		
	// 	if (slides.length < 10) {
	// 		current.textContent = `0${slideIndex}`;
	// 	} else {
	// 		current.textContent = slideIndex;
	// 	}

		
	// }

	// function plusSlide(n) {
	// 	showSlide(slideIndex +=n);
	// }

	// sliderPreview.addEventListener('click', () => {
	// 	plusSlide(-1);
	// });

	// sliderNext.addEventListener('click', () => {
	// 	plusSlide(1);
	// });

});
