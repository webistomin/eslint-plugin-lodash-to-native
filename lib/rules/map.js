'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isIdentifierArray(node, scope) {
  const name = node.name;
  const variable = scope.set.get(name) || scope.upper.set.get(name);
  
  return variable.defs[variable.defs.length - 1].node.init.type === 'ArrayExpression';
}

function isArrayFrom(node) {
  return node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.computed === false &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Array' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'from';
}

function isNewArray(node) {
  return node.type === 'NewExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'Array';
}

module.exports = {
  meta: {
    type: 'suggestion',
    
    docs: {
      description: '_.map to native Array#map',
      category: '',
      recommended: true,
      url: ''
    },
    
    fixable: 'code',
  },
  create: function(context) {
    let isLodashOverwritten = false;
    let isLodashExists = false;
  
    return {
      
      "VariableDeclaration": function(node) {
        context.getDeclaredVariables(node).forEach((item) => {
          if (item.name === '_') {
            isLodashOverwritten = true
          }
        })
      },
      
      "CallExpression": function(node) {
        console.log('===========================')
        const callee = node.callee;
        const firstArgument = node.arguments[0];
        const firstArgumentType = firstArgument.type;
        let isArgumentArrayLike = false;
        isLodashExists = (callee.object.type === 'Identifier' && callee.object.name === '_') || (node.parent.callee && node.parent.callee.object.name === '_' && node.parent.callee.object.type === 'Identifier');
  
        if (isLodashOverwritten || !isLodashExists) {
          console.log('2');
          return;
        };
        
        if (firstArgumentType === 'ObjectExpression') {
          console.log('3');
          return;
        };
  
        if (isArrayFrom(firstArgument) || isNewArray(firstArgument)) {
          context.report({
            node: node,
            message: "Replace lodash with native Array#map",
            data: {
              identifier: node.name
            },
            // fix: function(fixer) {
            //   const sourseCode = context.getSourceCode();
            //   const arr = sourseCode.getText(node.arguments[0]);
            //   const fn = sourseCode.getText(node.arguments[1]);
            //   return fixer.replaceText(node, `${arr}.map(${fn})`);
            // }
          });
          return;
        }
        
        switch (firstArgumentType) {
          case 'ArrayExpression':
            context.report({
              node: node,
              message: "Replace lodash with native Array#map",
              data: {
                identifier: node.name
              },
              // fix: function(fixer) {
              //   const sourseCode = context.getSourceCode();
              //   const arr = sourseCode.getText(node.arguments[0]);
              //   const fn = sourseCode.getText(node.arguments[1]);
              //   return fixer.replaceText(node, `${arr}.map(${fn})`);
              // }
            });
            break;
          case 'Identifier':
            const scope = context.getScope(node);
            const isArray = isIdentifierArray(firstArgument, scope);
            
            if (isArray) {
              context.report({
                node: node,
                message: "Replace lodash with native Array#map",
                data: {
                  identifier: node.name
                },
                // fix: function(fixer) {
                //   const sourseCode = context.getSourceCode();
                //   const arr = sourseCode.getText(node.arguments[0]);
                //   const fn = sourseCode.getText(node.arguments[1]);
                //   return fixer.replaceText(node, `${arr}.map(${fn})`);
                // }
              });
            }
            break;
        }
      }
    };
  }
};
