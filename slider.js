const images = document.querySelectorAll('.slider-img')
const controlls = document.querySelectorAll('.controlls')
let imageIndex = 0
let slideInterval

function show(index) {
	images[imageIndex].classList.remove('active')
	images[index].classList.add('active')
	imageIndex = index
}

function startSlideTimer() {
	// Очищаем предыдущий интервал, если он был
	clearInterval(slideInterval)
	// Устанавливаем новый интервал
	slideInterval = setInterval(() => {
		let nextIndex = imageIndex + 1
		if (nextIndex >= images.length) {
			nextIndex = 0
		}
		show(nextIndex)
	}, 5000) // 5 секунд
}

controlls.forEach(e => {
	e.addEventListener('click', event => {
		if (event.target.classList.contains('prev')) {
			let index = imageIndex - 1
			if (index < 0) {
				index = images.length - 1
			}
			show(index)
		} else if (event.target.classList.contains('next')) {
			let index = imageIndex + 1
			if (index >= images.length) {
				index = 0
			}
			show(index)
		}

		// Сбрасываем таймер при ручном переключении
		startSlideTimer()
	})
})

// Инициализация слайдера и таймера
show(imageIndex)
startSlideTimer()
