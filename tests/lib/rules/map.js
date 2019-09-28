'use strict';

const rule = require('../../../lib/rules/map');
const RuleTester = require('eslint').RuleTester;
const errorMsg = 'Replace lodash with native Array#map';

const ruleTester = new RuleTester();

ruleTester.run('_.map to native Array#map', rule, {
  valid: [
  
    // Игнорируем, если вызов без функции
    {
      code: '_.map({});',
    },
    
    // Игнорируем при работе с объектами
    {
      code: '_.map({}, fn);',
    },
  
    // Игнорируем, если переопределили _
    {
      code: 'var _ = { map: function() { return [] } }; test = _.map([], fn);'
    },
  
    // Игнорируем, если вызов с другой библиотекой
    {
      code: 'underscore.map([1, 2, 3], fn);'
    }
    
  ],
  
  invalid: [
  
    // Можно фиксить на нативный map
    {
      code: '_.map([1, 2, 3], fn);',
      errors: [
        { message: errorMsg }
      ],
    },
    
    // Обрабатываем Array.from
    {
      code: '_.map(Array.from("SHRI"), fn);',
      errors: [
        { message: errorMsg }
      ],
    },
  
    // Обрабатываем new Array
    {
      code: '_.map(new Array("SHRI"), fn);',
      errors: [
        { message: errorMsg }
      ],
    },
    
    // Если в переменной хранится массив, то фиксим
    {
      code: 'var a = [1, 2, 3]; _.map(a, fn);',
      errors: [
        { message: errorMsg }
      ],
    },
    
  ],
  
});
