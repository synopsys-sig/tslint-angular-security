import * as ts from "typescript";
import * as Lint from "tslint";
export declare class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING_INNER: string;
    static FAILURE_STRING_OUTER: string;
    static FAILURE_STRING_QUERY: string;
    static metadata: Lint.IRuleMetadata;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
