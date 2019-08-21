//middleware для загрузки файлов
const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {    //функция куда класть файл
        cb(null, 'images');
    },
    filename(req, file, cb) {   //функция для переименовании файла
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage,fileFilter
});