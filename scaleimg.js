document.addEventListener('DOMContentLoaded', function () {
	// Элементы
	const modal = document.getElementById('imageModal')
	const modalImg = document.getElementById('modalImage')
	const closeBtn = document.querySelector('.close')
	const resetZoomBtn = document.getElementById('resetZoom')
	const zoomableImages = document.querySelectorAll('.zoomable-image')

	let currentScale = 1
	const scaleStep = 0.2
	const maxScale = 3
	const minScale = 0.5

	// Переменные для перемещения изображения
	let isDragging = false
	let startX, startY
	let translateX = 0,
		translateY = 0
	let lastTranslateX = 0,
		lastTranslateY = 0

	// Открытие модального окна
	zoomableImages.forEach(img => {
		img.addEventListener('click', function () {
			modal.style.display = 'block'
			modalImg.src = this.src
			modalImg.alt = this.alt
			currentScale = 1
			translateX = 0
			translateY = 0
			lastTranslateX = 0
			lastTranslateY = 0
			updateImageTransform()
		})
	})

	// Закрытие модального окна
	closeBtn.addEventListener('click', function () {
		modal.style.display = 'none'
	})

	// Управление масштабированием
	resetZoomBtn.addEventListener('click', function () {
		currentScale = 1
		translateX = 0
		translateY = 0
		updateImageTransform()
	})

	// Масштабирование колесиком мыши
	modalImg.addEventListener('wheel', function (e) {
		e.preventDefault()

		// Получаем позицию курсора относительно изображения
		const rect = modalImg.getBoundingClientRect()
		const mouseX = e.clientX - rect.left
		const mouseY = e.clientY - rect.top

		// Сохраняем относительные координаты до масштабирования
		const relX = (mouseX - translateX) / currentScale
		const relY = (mouseY - translateY) / currentScale

		if (e.deltaY < 0) {
			// Скролл вверх - увеличение
			if (currentScale < maxScale) {
				currentScale += scaleStep
			}
		} else {
			// Скролл вниз - уменьшение
			if (currentScale > minScale) {
				currentScale -= scaleStep
			}
		}

		// Пересчитываем позицию для сохранения точки под курсором
		const newTranslateX = mouseX - relX * currentScale
		const newTranslateY = mouseY - relY * currentScale

		// Применяем новые координаты с проверкой границ
		translateX = newTranslateX
		translateY = newTranslateY
		checkBoundaries()
		updateImageTransform()
	})

	// Перемещение изображения
	modalImg.addEventListener('mousedown', function (e) {
		if (e.button === 0) {
			// Только ЛКМ
			isDragging = true
			startX = e.clientX - translateX
			startY = e.clientY - translateY
			modalImg.style.cursor = 'grabbing'
			e.preventDefault()
		}
	})

	document.addEventListener('mousemove', function (e) {
		if (!isDragging) return

		// Вычисляем новые координаты
		translateX = e.clientX - startX
		translateY = e.clientY - startY

		// Проверяем границы
		checkBoundaries()
		updateImageTransform()
	})

	document.addEventListener('mouseup', function () {
		isDragging = false
		modalImg.style.cursor = 'grab'
		// Сохраняем последнюю позицию для следующего перемещения
		lastTranslateX = translateX
		lastTranslateY = translateY
	})

	// Проверка границ перемещения
	function checkBoundaries() {
		const imgRect = modalImg.getBoundingClientRect()
		const modalRect = modal.getBoundingClientRect()

		// Вычисляем видимые размеры изображения с учетом масштаба
		const scaledWidth = imgRect.width * currentScale
		const scaledHeight = imgRect.height * currentScale

		// Максимальные допустимые смещения
		const maxTranslateX = (scaledWidth - modalRect.width) / 6
		const maxTranslateY = (scaledHeight - modalRect.height) / 6

		// Ограничиваем перемещение
		if (scaledWidth > modalRect.width) {
			translateX = Math.min(Math.max(translateX, -maxTranslateX), maxTranslateX)
		} else {
			translateX = 0
		}
		в
		if (scaledHeight > modalRect.height) {
			translateY = Math.min(Math.max(translateY, -maxTranslateY), maxTranslateY)
		} else {
			translateY = 0
		}
	}

	// Обновление трансформации изображения
	function updateImageTransform() {
		modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`
	}

	// Закрытие по ESC
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && modal.style.display === 'block') {
			modal.style.display = 'none'
		}
	})

	// Инициализация курсора
	modalImg.style.cursor = 'grab'
})
