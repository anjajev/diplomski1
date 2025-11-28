import multer from 'multer';
import path from 'path'; // Dodaj path za rad sa ekstenzijama

// Konfigurišite multer za otpremanje datoteka
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder gde će se čuvati slike
  },
  filename: function (req, file, cb) {
    // Dobijanje originalne ekstenzije fajla
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Spajanje unikatnog naziva sa originalnom ekstenzijom
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

export default upload;
