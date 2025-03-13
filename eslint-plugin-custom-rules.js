export default {
  rules: {
    'no-hardcoded-jsx-strings': {
      meta: {
        type: 'problem'
      },
      create(context) {
        const variables = new Map();

        return {
          VariableDeclarator(node) {
            if (node.id.type === 'Identifier' && node.init) {
              if (node.init.type === 'Literal' && typeof node.init.value === 'string') {
                variables.set(node.id.name, node.init.value);
              } else if (node.init.type === 'BinaryExpression' || node.init.type === 'TemplateLiteral') {
                const containsHardcodedString = checkExp(node.init);
                if (containsHardcodedString) {
                  variables.set(node.id.name, 'Contains hardcoded string');
                }
              }
            }
          },

          JSXExpressionContainer(node) {
            if (node.expression.type === 'Identifier') {
              const varName = node.expression.name;
              if (variables.has(varName)) {
                context.report({
                  node,
                  message: `disallow literal string: ${varName}='${variables.get(varName)}'`
                });
              }
            }
          }
        };

        function checkExp(expression) {
          switch (expression.type) {
            case 'Literal':
              return typeof expression.value === 'string';
            case 'BinaryExpression':
              return checkExp(expression.left) || checkExp(expression.right);
            case 'TemplateLiteral':
              return expression.quasis.some(quasi => quasi.value.raw.trim() !== '');
            default:
              return false;
          }
        }
      }
    }
  }
};
