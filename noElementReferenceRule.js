"use strict";
// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags any references to nativeElement, when DOM-modifying attributes or functions,
* such as innerHTML, outerHTML, querySelector are called on it. The nativeElement property
* allows access to the underlying DOM element.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoElementReferenceWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_INNER = "Forbid writing innerHTML directly through element reference";
    Rule.FAILURE_STRING_OUTER = "Forbid writing outerHTML directly through element reference";
    Rule.FAILURE_STRING_QUERY = "Validate no tainted data is written to the element accessed directly through querySelector";
    Rule.metadata = {
        ruleName: 'no-element-reference',
        type: 'functionality',
        description: 'Directly manipulating innerHTML or outerHTML of the DOM element may lead to XSS',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoElementReferenceWalker = /** @class */ (function (_super) {
    __extends(NoElementReferenceWalker, _super);
    function NoElementReferenceWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoElementReferenceWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (node.getText().includes('nativeElement')) {
            if (node.name.text === 'innerHTML') {
                this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_INNER);
            }
            else if (node.name.text === 'outerHTML') {
                this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_OUTER);
            }
            else if (node.name.text === 'querySelector') {
                this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_QUERY);
            }
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    return NoElementReferenceWalker;
}(Lint.RuleWalker));
