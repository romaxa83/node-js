//создание хелпера для шаблонизатор handlebars
module.exports = {
    // хелпер для сравнения т.к. handlebar не сравнивает в условной конструкции
  ifequals(a, b, options) {
      if (a == b) {
          return options.fn(this);
      }
      return options.inverse(this);
  }
};