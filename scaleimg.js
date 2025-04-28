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

	// Сброс масштаба и позиции
	resetZoomBtn.addEventListener('click', function () {
		currentScale = 1
		translateX = 0
		translateY = 0
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
		modalImg.style.cursor = currentScale > 1 ? 'grab' : 'default'
		// Сохраняем последнюю позицию для следующего перемещения
		lastTranslateX = translateX
		lastTranslateY = translateY
	})

	// Управление масштабом через клавиши
	document.addEventListener('keydown', function (e) {
		if (modal.style.display !== 'block') return

		// Закрытие по ESC
		if (e.key === 'Escape') {
			modal.style.display = 'none'
			return
		}

		// Масштабирование только если модальное окно открыто
		const rect = modalImg.getBoundingClientRect()
		const centerX = rect.width / 2
		const centerY = rect.height / 2

		// Сохраняем относительные координаты центра
		const relX = (centerX - translateX) / currentScale
		const relY = (centerY - translateY) / currentScale

		if (e.key === '+' || e.key === '=') {
			// Увеличение
			e.preventDefault()
			if (currentScale < maxScale) {
				currentScale += scaleStep
				// Пересчитываем позицию для сохранения центра
				translateX = centerX - relX * currentScale
				translateY = centerY - relY * currentScale
				checkBoundaries()
				updateImageTransform()
			}
		} else if (e.key === '-' || e.key === '_') {
			// Уменьшение
			e.preventDefault()
			if (currentScale > minScale) {
				currentScale -= scaleStep
				// Пересчитываем позицию для сохранения центра
				translateX = centerX - relX * currentScale
				translateY = centerY - relY * currentScale
				checkBoundaries()
				updateImageTransform()
			}
		} else if (e.key === '0') {
			// Сброс масштаба
			e.preventDefault()
			currentScale = 1
			translateX = 0
			translateY = 0
			updateImageTransform()
		}
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

		if (scaledHeight > modalRect.height) {
			translateY = Math.min(Math.max(translateY, -maxTranslateY), maxTranslateY)
		} else {
			translateY = 0
		}
	}

	// Обновление трансформации изображения
	function updateImageTransform() {
		modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`
		modalImg.style.cursor = currentScale > 1 ? 'grab' : 'default'
	}

	// Инициализация курсора
	modalImg.style.cursor = 'grab'
})
