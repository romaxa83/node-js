const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

class Cart {

    static async add(course) {
        const cart = await Cart.fetch();

        const idx = cart.courses.findIndex(c => c.id === course.id);
        const candidate = cart.courses[idx];

        if(candidate) {
            // курс уже есть
            candidate.count++;
            cart.courses[idx] = candidate;
        } else {
            // добавление курса
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) {
                   rej(err);
                } else {
                    res();
                }
            })
        });
    }

    static async fetch() {

        return new Promise((res, rej) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if(err) {
                    rej(err);
                } else {
                    res(JSON.parse(content));
                }
            })
        });
    }

    static async remove(id) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex(c => c.id === id);
        const course = cart.courses[idx];

        if(course.count === 1) {
            //удаляем курс
            cart.courses = cart.courses.filter(c => c.id !== id);
        } else {
            //изменяем кол-во
            cart.courses[idx].count--;
        }
        cart.price -= course.price;

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) {
                    rej(err);
                } else {
                    res(cart);
                }
            })
        });
    }
}

module.exports = Cart;