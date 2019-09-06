# QuidPHP/Lemur
[![Release](https://img.shields.io/github/v/release/quidphp/lemur)](https://packagist.org/packages/quidphp/lemur)
[![License](https://img.shields.io/github/license/quidphp/lemur)](https://github.com/quidphp/lemur/blob/master/LICENSE)
[![PHP Version](https://img.shields.io/packagist/php-v/quidphp/lemur)](https://www.php.net)
[![Code Size](https://img.shields.io/github/languages/code-size/quidphp/lemur)](https://github.com/quidphp/lemur)

## Included
**QuidPHP/Lemur** comes bundled with the following front-end packages:
- [jquery/jquery](https://github.com/jquery/jquery) | jQuery - The popular JavaScript library
- [jquery/jquery-ui](https://github.com/jquery/jquery-ui) | jQuery-UI - A minimal version of the library is used for drag & drop sorting
- [necolas/normalize.css](https://github.com/necolas/normalize.css) | Normalize - Stylesheet for normalizing the default rules across browsers

### JS
- *jQuery*: All behaviours and widgets are programmed on top of the jQuery library. Many functions are connected with jQuery.fn. Custom events are used across the board, a lot of calls to the jQuery [trigger](https://api.jquery.com/trigger/) and [triggerHandler](https://api.jquery.com/triggerHandler/) methods.
- *Include*: Many scripts are in the include folder. These scripts are used for the CMS but can also be reused within the application.

### SCSS
- *Mixins*: Nesting, variables and mixins are used within the SCSS stylesheets.
- *Include*: Some stylesheets are in the include folder. Those stylesheets are used for the CMS but can also be reused within the application.