const {Schema, model} = require('mongoose');

// схема для таблици
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,    //используем специальный обьект для id в mongo
                    required: true,
                    ref: 'Course'   //связь с таблицей Course,указываеться то имя которое задано в модели при экспорте
                }
            }
        ]
    }
});

//создаем методы для обьекта
userSchema.methods.addToCart = function(course) {
    //клонируем массив item
    const cloneItems = [...this.cart.items];
    const idx = cloneItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    });

    if(idx >= 0) {
        // добавляем кол-во курсов
        cloneItems[idx].count = cloneItems[idx].count + 1;
    } else {
        // добавляем курс
        cloneItems.push({
            courseId: course._id,
            count: 1
        });
    }

    this.cart = {items: cloneItems};

    return this.save();
};

userSchema.methods.removeFromCart = function(id) {
    let cloneItems = [...this.cart.items];
    const idx = cloneItems.findIndex(c => {
        return c.courseId.toString() === id.toString();
    });

    if(cloneItems[idx].count === 1) {
        cloneItems = cloneItems.filter(c => c.courseId.toString() !== id.toString());
    } else {
        cloneItems[idx].count--;
    }

    this.cart = {items: cloneItems};

    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = {items: []};

    return this.save();
};

module.exports = model('User', userSchema);