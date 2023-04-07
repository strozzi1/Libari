package resize

import (
	"bytes"
	"errors"
	"image"
	"image/jpeg"
	_ "image/jpeg"

	"github.com/nfnt/resize"
)

func Resize(image image.Image) (bytes.Buffer, error) {

	resizedImg := resize.Resize(400, 0, image, resize.Lanczos3)
	var buffer bytes.Buffer
	err := jpeg.Encode(&buffer, resizedImg, nil)
	if err != nil {

		return bytes.Buffer{}, errors.New("Failed to encode to jpeg")
	}

	return buffer, nil
}
