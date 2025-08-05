const path = require('path');
const fs = require('fs');


const uploadsDir = path.join(__dirname, '../uploads'); // Example

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const saveBase64Image = async (base64Data, filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate base64 data format
      if (!base64Data || typeof base64Data !== 'string') {
        return reject(new Error('Invalid base64 data provided'));
      }

      // Extract MIME type and validate
      const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return reject(new Error('Invalid base64 image format. Expected format: data:image/[type];base64,[data]'));
      }

      const mimeType = matches[1];
      const base64Image = matches[2];

      // Map MIME types to file extensions
      const extensionMap = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/tiff': 'tiff'
      };

      const extension = extensionMap[mimeType];
      if (!extension) {
        return reject(new Error(`Unsupported image format: ${mimeType}`));
      }

      // Create buffer from base64
      const buffer = Buffer.from(base64Image, 'base64');
      
      // Validate buffer size
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (buffer.length > maxSizeInBytes) {
        return reject(new Error(`Image size exceeds ${maxSizeInMB}MB limit`));
      }

      if (buffer.length === 0) {
        return reject(new Error('Empty image buffer'));
      }

      // Generate filename with proper extension
      const basename=path.parse(filename).name;
      const finalFilename = `${basename}.${extension}`;
      const filePath = path.join(uploadsDir, finalFilename);

      console.log(filePath)

      // Check if file already exists and generate unique name if needed
      let counter = 1;
      let uniqueFilePath = filePath;
      while (fs.existsSync(uniqueFilePath)) {
        const nameWithoutExt = path.parse(filename).name;
        const uniqueFilename = `${nameWithoutExt}_${counter}.${extension}`;
        uniqueFilePath = path.join(uploadsDir, uniqueFilename);
        counter++;
      }

      // Write file
      fs.writeFile(uniqueFilePath, buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            filePath: uniqueFilePath,
            filename: path.basename(uniqueFilePath),
            mimeType,
            extension,
            size: buffer.length
          });
        }
      });

    } catch (error) {
      reject(new Error(`Failed to save image: ${error.message}`));
    }
  });
};

module.exports={
    saveBase64Image
}