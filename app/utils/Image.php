<?php

class Image
{
    private $directory = __DIR__ . '/../../src/img/';
    private $maxFileSize = 5 * 1024 * 1024;
    private $allowedExtensions = ['jpg', 'jpeg', 'png'];

    public function uploadImage($file, $subfolder = ''): ?string
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $filename = $this->generateFilename($file['name']);
        $targetDirectory = $this->directory . $subfolder;

        if (!file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        $targetPath = $targetDirectory . $filename;
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);

        if ($this->isImageValid($file['tmp_name']) && in_array($fileExtension, $this->allowedExtensions)) {
            move_uploaded_file($file['tmp_name'], $targetPath);
            return $this->getImageURL($filename);
        }

        return null;
    }

    public function getImage($filename): ?string
    {
        return file_get_contents($this->getImageURL($filename));
    }

    public function getImageURL($filename): ?string
    {
        return file_exists($this->directory . $filename) ? $this->directory . $filename : null;
    }

    private function generateFilename($originalName)
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        return uniqid() . '.' . $extension;
    }

    private function isImageValid($tmpFilePath): bool
    {
        $imageInfo = getimagesize($tmpFilePath);
        if (!$imageInfo) {
            return false;
        }

        $fileSize = filesize($tmpFilePath);
        if ($fileSize > $this->maxFileSize) {
            return false;
        }

        return true;
    }

    public function resizeImage($filename, $width, $height): GdImage
    {
        $imagePath = $this->directory . $filename;

        list($originalWidth, $originalHeight, $imageType) = getimagesize($imagePath);
        $aspectRatio = $originalWidth / $originalHeight;

        if ($width / $height > $aspectRatio) {
            $width = $height * $aspectRatio;
        } else {
            $height = $width / $aspectRatio;
        }

        $resizedImage = imagecreatetruecolor($width, $height);

        if ($imageType === IMAGETYPE_JPEG) {
            $originalImage = imagecreatefromjpeg($imagePath);
            imagecopyresampled(
                $resizedImage,
                $originalImage,
                0,
                0,
                0,
                0,
                $width,
                $height,
                $originalWidth,
                $originalHeight
            );
            imagedestroy($originalImage);
            return $resizedImage;
        } elseif ($imageType === IMAGETYPE_PNG) {
            $originalImage = imagecreatefrompng($imagePath);
            imagealphablending($resizedImage, false);
            imagesavealpha($resizedImage, true);
            imagecopyresampled(
                $resizedImage,
                $originalImage,
                0,
                0,
                0,
                0,
                $width,
                $height,
                $originalWidth,
                $originalHeight
            );
            imagedestroy($originalImage);
            return $resizedImage;
        }

        return null;
    }
}
