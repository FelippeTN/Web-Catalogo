package utils

import (
	"image"
	"image/jpeg"
	_ "image/png"
	"mime/multipart"
	"os"
)

func SaveCompressedImage(fileHeader *multipart.FileHeader, destPath string) error {
	src, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	img, _, err := image.Decode(src)
	if err != nil {
		return err
	}
	out, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer out.Close()

	return jpeg.Encode(out, img, &jpeg.Options{Quality: 75})
}

func IsImageFile(fileHeader *multipart.FileHeader) bool {
    contentType := fileHeader.Header.Get("Content-Type")
    if contentType == "image/jpeg" || contentType == "image/png" || contentType == "image/jpg" {
        return true
    }
    return false
}
