# Экспорт, импорт в Node.JS

Вроде, все просто и ясно:

	var module = require("./some_module.js");

	module.f(); // запуск экспортируемой функции модуля
	console.log(module.obj); // печать экспортируемого объекта модуля
	module(); // запуск самого модуля

Что бы экспортировать что-то в самом модуле нужно прописать:

	exports.f = function() { return 123; };
	exports.obj = { name: "Foobar", age: 33 };

	// или даже так, что вместе с предыдущими строчками
	// в одном модуле не сработает!
	module.exports = function() { return "I have not a name"; }

Почему не всегда работает?

Ответ на этот вопрос лежит в понимании работы функции require().

При вызове require(), как я помучившись понял, создает объект под именем exports, считывает переданный файл в переменную и выполняет весь код из этой переменной. После чего, возвращает нам изменённый в процессе выполнения кода объект exports.

Попробуем создать свою функцию require(). Для упрощения восприятия мы будем передавать нашей функции не имя файла, а уже, как бы, содержимое файла в виде строковой переменной. Назовем её script.

Определение нашей функции require будет выглядеть так:

	function require(script) {
		var exports = {};
		eval(script);

		return exports;
	}

Но как быть, если нам нужно экспортировать безымянный объект? Помните `module.exports = function() {}`? Добавляем объект с именем module, и его свойству exports присваиваем объект.

Наша функция require немного усложняется:

	function require(script) {
		var module = {};
		var exports = {};

		eval(script);

		return module.exports ? module.exports : exports;
	}

Запускаем тест:

	var script = "exports.foo = 'foo'; exports.bar = 'bar';"; // код модуля
	var foobar = require(script); // импортируем

	console.log(foobar.foo); // печатает: foo
	console.log(foobar.bar); // печатает: bar

Работает!

Запускаем тест с экспортом безымянного объекта:

	var script = "module.exports = function() { return 'foobar'; }"; // код модуля
	var foobar = require(script); // импортируем

	console.log(foobar()); // печатает: foobar

Тоже работает.

Запускаем тест с экспортом безымянного объекта и именованных объектов модуля:

	var script = "exports.arr = [1, 2, 3]; module.exports = function() { return 'foobar'; }"; // код модуля
	var foobar = require(script); // импортируем

	console.log(foobar()); // печатает: foobar
	console.log(foobar.arr); // печатает: undefined

Не работает!

К стати, не работает и при использовании штатной функции node.js require(). Это показывает, что наша функция мало чем отличается от неё, и мы на верном пути.

А как же экспортировать нам и безымянный и именованные объекты? Ответ - нужно использовать только module.exports, причём, именованные объекты экспортируются в модуле обязательно после безымянного.

Откорректируем предыдущий пример:

	var script = "module.exports = function() { return 'foobar'; }\n"  // код модуля
		+ "module.exports.arr = [1, 2, 3];\n"
		+ "module.exports.result = 'Ok'\n";
	var foobar = require(script); // импортируем

	console.log(foobar()); // печатает: foobar
	console.log(foobar.arr); // печатает: [1, 2, 3]
	console.log(foobar.result); // печатает: Ok

Работает!

Надеюсь, что мои примеры, дорогой читатель, помогли Вам глубже понять механизм экспорта-импорта модулей в node.js. На первый взгляд, он очень прост, о чем пишут и сами разработчики. Но без понимания работы встроенной функции require() иногда оказываешься наедине с чУдными результатами работы своего кода.
