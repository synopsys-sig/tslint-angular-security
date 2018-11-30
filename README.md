# Angular Security Rules for TSLint

These simple linting rules flag points of interest where a security problem may be present in TypeScript Angular code. These rules are to be used with [TSLint](https://palantir.github.io/tslint/).

## Getting Started

TSLint must be installed locally in the target project. And the project must have tsconfig.json file in the root folder. Install `tslint-angular-security` from npm.

```
cd targetproject
npm init -y
npm i tslint typescript
npm i tslint-angular-security
./node_modules/tslint/bin/tslint --init
```

## Configuration

Configure the target project `tslint.json` file to include the needed rules from the `tslint-angular-security` package. 

```
{
  "rulesDirectory": [
    "node_modules/tslint-angular-security"
  ],

  "rules": {
    "flag-local-storage-angular-plugin": true,
    "no-bypass-security": true,
    "no-element-reference": true
  }
}
```

See example configuration in `tslint_custom_rules.json`.


## Running

In the root of the target project run:

```
./node_modules/.bin/tslint --project tsconfig.json --config tslint.json
```

*Warning: This repository is a work-in-progress. Things may break while we transition this project to open source. This is not an officially supported Synopsys product.*

## Rules

Rule Name   | Description | Vulnerability | CWE
:---------- | :------------ | -------------|---
`no-bypass-security` | Flags all calls of Angular Sanitizer functions: bypassSecurityTrustHtml, bypassSecurityTrustStyle, bypassSecurityTrustScript, bypassSecurityTrustUrl, bypassSecurityTrustResourceUrl. Angular does not apply any sanitization on the passed through these functions. | Validate that the input to these functions is tainted and that the result it written into a template.| [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
`no-element-reference` | Flags all calls to `nativeElement.innerHTML`, `nativeElement.outerHTML`, and `nativeElement.querySelector`. The `nativeElement` property of the ElementRef class allows direct access to the DOM element. | Validate that tainted data is assigned in these calls or other element manipulations, which can lead to DOM XSS.| [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
`flag-local-storage-angular-plugin` | Flags all calls writing data to localStorage or webStorage for plugins @ngx-pwa/local-storage and angular-webstorage-service. | Validate that the data is actually written to localStorage and not sessionStorage, and that the data is sensitive.| [CWE-922](https://cwe.mitre.org/data/definitions/922.html)

## Developing

Feel free to update/add new rules in your local version. After you add/update the .ts, compile them using the [TypeScript compiler](https://www.npmjs.com/package/typescript) from the root folder:

```
tsc
```
The compiled JavaScript files will be in the root directory. Copy them to `node_modules\tslint-angular-security` in the target project and use them. 

## Authors
 
* **Ksenia Peguero**, Senior Research Lead @Synopsys
 
## License
 
This software is released by Synopsys under the MIT license.
 
## Acknowledgments
 
* Thanks to [Lewis Ardern](https://github.com/LewisArdern/) for inspiration with his security rules for AngularJS https://github.com/LewisArdern/eslint-config-angular-security
