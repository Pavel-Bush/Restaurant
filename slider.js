const images = document.querySelectorAll('.slider-img')
const controlls = document.querySelectorAll('.controlls')
const indicatorsContainer = document.querySelector('.slider-indicators')
let imageIndex = 0
let slideInterval

// Создаем индикаторы
function createIndicators() {
	images.forEach((_, index) => {
		const indicator = document.createElement('div')
		indicator.classList.add('indicator')
		if (index === 0) indicator.classList.add('active')
		indicator.addEventListener('click', () => {
			show(index)
			startSlideTimer()
		})
		indicatorsContainer.appendChild(indicator)
	})
}

function updateIndicators() {
	const indicators = document.querySelectorAll('.indicator')
	indicators.forEach((indicator, index) => {
		indicator.classList.toggle('active', index === imageIndex)
	})
}

function show(index) {
	images.forEach(img => img.classList.remove('active'))
	images[index].classList.add('active')
	imageIndex = index
	updateIndicators()
}

function startSlideTimer() {
	clearInterval(slideInterval)
	slideInterval = setInterval(() => {
		const nextIndex = (imageIndex + 1) % images.length
		show(nextIndex)
	}, 5000)
}

controlls.forEach(control => {
	control.addEventListener('click', event => {
		if (event.target.classList.contains('prev')) {
			const index = (imageIndex - 1 + images.length) % images.length
			show(index)
		} else if (event.target.classList.contains('next')) {
			const index = (imageIndex + 1) % images.length
			show(index)
		}
		startSlideTimer()
	})
})

// Инициализация
createIndicators()
show(imageIndex)
startSlideTimer()
