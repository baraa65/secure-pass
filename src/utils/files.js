export function getBase64(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = (error) => reject('Error: ', error)
	})
}

export function downloadBase64(contentBase64, fileName) {
	const downloadLink = document.createElement('a')
	document.body.appendChild(downloadLink)

	downloadLink.href = contentBase64
	downloadLink.target = '_self'
	downloadLink.download = fileName
	downloadLink.click()
}
