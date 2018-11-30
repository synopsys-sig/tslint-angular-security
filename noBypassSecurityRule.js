"use strict";
// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags any call to Angular APIs bypassSecurityTrust*, which
* when called on tainted data may result in untrusted data written into the DOM
* which may lead to XSS.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
        return this.applyWithWalker(new NoBypassSecurityWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Untrusted data sent to bypassSecurityTrust* methods may result in XSS";
    Rule.metadata = {
        ruleName: 'no-bypass-security',
        type: 'functionality',
        description: 'Angular bypassSecurityTrust* methods may lead to XSS and other attacks',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoBypassSecurityWalker = /** @class */ (function (_super) {
    __extends(NoBypassSecurityWalker, _super);
    function NoBypassSecurityWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoBypassSecurityWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (node.name.text === 'bypassSecurityTrustHtml'
            || node.name.text === 'bypassSecurityTrustStyle'
            || node.name.text === 'bypassSecurityTrustScript'
            || node.name.text === 'bypassSecurityTrustUrl'
            || node.name.text === 'bypassSecurityTrustResourceUrl')
            // create a failure at the current position
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    return NoBypassSecurityWalker;
}(Lint.RuleWalker));
