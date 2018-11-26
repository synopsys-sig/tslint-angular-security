// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags access to localStorage or web storage when Angular2+ app is used
* with plugins:
* - @ngx-pwa/local-storage
* - angular-webstorage-service
* Note that angular-webstorage-service is configured at the constuctor to use either
* LOCAL_STORAGE or SESSION_STORAGE. This rule does not take this into account and
* may return false positives.
*/


import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {

    public static FAILURE_STRING = "Validate that sensitive data is not written to localStorage via plugins ";

    public static metadata: Lint.IRuleMetadata = {
            ruleName: 'flag-local-storage-angular-plugin',
            type: 'functionality',
            description: 'Sensitive data stored in localStorage may be leaked to an attacker',
            options: null,
            optionsDescription: '',
            typescriptOnly: true,
        };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new FlagLocalStoragePluginWalker(sourceFile, this.getOptions()));
    }
}

class FlagLocalStoragePluginWalker extends Lint.RuleWalker {

    public visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {

      //check for @ngx-pwa/local-storage plugn API
      if (node.expression.getText() === 'this.localStorage'
        && node.name.text === 'setItem') {
        this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
      }

      //check for angular-webstorage-service plugin API
      if (node.expression.getText() === 'this.storage'
        && node.name.text === 'set') {
        this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
      }
      // call the base version of this visitor to actually parse this node
      super.visitPropertyAccessExpression(node);
    }
}
