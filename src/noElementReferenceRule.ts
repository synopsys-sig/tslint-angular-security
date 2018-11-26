// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags any references to nativeElement, when DOM-modifying attributes or functions, 
* such as innerHTML, outerHTML, querySelector are called on it. The nativeElement property
* allows access to the underlying DOM element.
*/

import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {

    public static FAILURE_STRING_INNER = "Forbid writing innerHTML directly through element reference";
    public static FAILURE_STRING_OUTER = "Forbid writing outerHTML directly through element reference";
    public static FAILURE_STRING_QUERY = "Validate no tainted data is written to the element accessed directly through querySelector";

    public static metadata: Lint.IRuleMetadata = {
            ruleName: 'no-element-reference',
            type: 'functionality',
            description: 'Directly manipulating innerHTML or outerHTML of the DOM element may lead to XSS',
            options: null,
            optionsDescription: '',
            typescriptOnly: true,
        };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoElementReferenceWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoElementReferenceWalker extends Lint.RuleWalker {

    public visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {

        if (node.getText().includes('nativeElement')) {
          if (node.name.text === 'innerHTML') {
              this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_INNER);
          } else if (node.name.text === 'outerHTML') {
              this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_OUTER);
          } else if (node.name.text === 'querySelector') {
              this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_QUERY);
          }
        }
        // call the base version of this visitor to actually parse this node
        super.visitPropertyAccessExpression(node);
    }
}
