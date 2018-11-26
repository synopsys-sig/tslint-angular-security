// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags any call to Angular APIs bypassSecurityTrust*, which 
* when called on tainted data may result in untrusted data written into the DOM
* which may lead to XSS.
*/

import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {

    public static FAILURE_STRING = "Untrusted data sent to bypassSecurityTrust* methods may result in XSS";

    public static metadata: Lint.IRuleMetadata = {
            ruleName: 'no-bypass-security',
            type: 'functionality',
            description: 'Angular bypassSecurityTrust* methods may lead to XSS and other attacks',
            options: null,
            optionsDescription: '',
            typescriptOnly: true,
        };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBypassSecurityWalker(sourceFile, this.getOptions()));
    }
}

class NoBypassSecurityWalker extends Lint.RuleWalker {

    public visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {

        if (node.name.text === 'bypassSecurityTrustHtml'
          || node.name.text === 'bypassSecurityTrustStyle'
          || node.name.text === 'bypassSecurityTrustScript'
          || node.name.text === 'bypassSecurityTrustUrl'
          || node.name.text === 'bypassSecurityTrustResourceUrl' )
        // create a failure at the current position
        this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);

        // call the base version of this visitor to actually parse this node
        super.visitPropertyAccessExpression(node);
    }
}
