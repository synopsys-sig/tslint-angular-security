"use strict";
// Copyright (c) 2018 Synopsys, Inc. All rights reserved worldwide.
/* The rule flags access to localStorage or web storage when Angular2+ app is used
* with plugins:
* - @ngx-pwa/local-storage
* - angular-webstorage-service
* Note that angular-webstorage-service is configured at the constuctor to use either
* LOCAL_STORAGE or SESSION_STORAGE. This rule does not take this into account and
* may return false positives.
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
        return this.applyWithWalker(new FlagLocalStoragePluginWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "Validate that sensitive data is not written to localStorage via plugins ";
    Rule.metadata = {
        ruleName: 'flag-local-storage-angular-plugin',
        type: 'functionality',
        description: 'Sensitive data stored in localStorage may be leaked to an attacker',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var FlagLocalStoragePluginWalker = /** @class */ (function (_super) {
    __extends(FlagLocalStoragePluginWalker, _super);
    function FlagLocalStoragePluginWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlagLocalStoragePluginWalker.prototype.visitPropertyAccessExpression = function (node) {
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
        _super.prototype.visitPropertyAccessExpression.call(this, node);
    };
    return FlagLocalStoragePluginWalker;
}(Lint.RuleWalker));
