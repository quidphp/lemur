# QuidPHP/Lemur

## About
**QuidPHP/Lemur** contains the LemurCMS, a content management system built on top of the QuidPHP framework. It is part of the [QuidPHP](https://github.com/quidphp/project) package. 

## License
**QuidPHP/Lemur** is available as an open-source software under the [MIT license](LICENSE).

## Installation
**QuidPHP/Lemur** can be easily installed with [Composer](https://getcomposer.org). It is available on [Packagist](https://packagist.org/packages/quidphp/lemur).
``` bash
$ composer require quidphp/lemur
```
Once installed, the **Quid\Lemur** namespace will be available within your PHP application.

## Requirement
**QuidPHP/Lemur** requires the following:
- PHP 7.2+ with fileinfo, curl, openssl, posix, PDO and pdo_mysql

## Dependency
**QuidPHP/Lemur** has the following dependencies:
- [quidphp/base](https://github.com/quidphp/base) | Quid\Base - PHP library that provides a large set of low-level static methods
- [quidphp/main](https://github.com/quidphp/main) | Quid\Main - PHP library that provides a set of base objects and collections 
- [quidphp/orm](https://github.com/quidphp/orm) | Quid\Orm - PHP library that provides database access and a comprehensive Object-Relational Mapper
- [quidphp/routing](https://github.com/quidphp/routing) | Quid\Routing - PHP library that provides a simple route matching and triggering procedure
- [quidphp/core](https://github.com/quidphp/core) | Quid\Core - PHP library that provides an extendable platform to create dynamic applications
- [verot/class.upload.php](https://github.com/verot/class.upload.php) | Verot\Upload - A popular PHP class used for resizing images
- [phpmailer/phpmailer](https://github.com/phpmailer/phpmailer) | PHPMailer\PHPMailer - The classic email sending library for PHP
- [tedivm/jshrink](https://github.com/tedious/JShrink) | JShrink - Javascript Minifier built in PHP
- [scssphp/scssphp](https://github.com/scssphp/scssphp) | ScssPhp\ScssPhp - SCSS compiler written in PHP

All dependencies will be resolved by using the [Composer](https://getcomposer.org) installation process.

## Included
**QuidPHP/Lemur** comes bundled with the following front-end packages:
- [jquery/jquery](https://github.com/jquery/jquery) | jQuery - The popular JavaScript library
- [jquery/jquery-ui](https://github.com/jquery/jquery-ui) | jQuery-UI - A minimal version of the library is used for drag & drop sorting
- [necolas/normalize.css](https://github.com/necolas/normalize.css) | Normalize - Stylesheet for normalizing the default rules across browsers

## Comment
**QuidPHP/Lemur** code is commented and all methods are explained. However, most of the comments are currently written in French.

## PHP

### Convention
**QuidPHP/Lemur** is built on the following conventions:
- *Traits*: Traits filenames start with an underscore (_).
- *Coding*: No curly braces are used in a IF statement if the condition can be resolved in only one statement.
- *Type*: Files, function arguments and return types are strict typed.
- *Config*: A special $config static property exists in all classes. This property gets recursively merged with the parents' property on initialization.
- *Auto-alias*: All class names that finishes by Alias will resolve to the existing class if no alias exists. Exemple: MyRole extents RoleAlias -> will resolve to Role if no alias is found.
- *Core overloading*: This namespace overloads many classes from Quid\Core.

### Overview
**QuidPHP/Lemur** contains 64 classes and traits. Here is an overview:
- [Boot](src/Boot.php) | Extended abstract class for the object that bootstraps the cms
- [Cms](src/Cms)
    - [About](src/Cms/About.php) | Class for the about popup route of the CMS
    - [Account](src/Cms/Account.php) | Class for the account route of the CMS, by default redirects to the user's specific route
    - [AccountChangePassword](src/Cms/AccountChangePassword.php) | Class for the change password route in the CMS
    - [AccountChangePasswordSubmit](src/Cms/AccountChangePasswordSubmit.php) | Class for the submit change password route in the CMS
    - [ActivatePassword](src/Cms/ActivatePassword.php) | Class for the activate password in the CMS
    - [Error](src/Cms/Error.php) | Class for the error route of the CMS
    - [General](src/Cms/General.php) | Class for the general navigation route of the CMS
    - [GeneralDelete](src/Cms/GeneralDelete.php) | Class for the route which allows deleting rows from the general navigation page of the CMS
    - [GeneralExport](src/Cms/GeneralExport.php) | Class for the route which generates the CSV export for the CMS
    - [GeneralExportDialog](src/Cms/GeneralExportDialog.php) | Class for the general export popup route of the CMS
    - [GeneralRelation](src/Cms/GeneralRelation.php) | Class for the route which manages the filters for the general navigation page of the CMS
    - [GeneralTruncate](src/Cms/GeneralTruncate.php) | Class for the route which allows truncating a table from the general page of the CMS
    - [Home](src/Cms/Home.php) | Class for the home route of the CMS
    - [HomeSearch](src/Cms/HomeSearch.php) | Class for the global search route accessible from the homepage of the CMS
    - [Login](src/Cms/Login.php) | Class for the login route of the CMS
    - [LoginSubmit](src/Cms/LoginSubmit.php) | Class for the login submit route of the CMS
    - [Logout](src/Cms/Logout.php) | Class for the logout route of the CMS
    - [Register](src/Cms/Register.php) | Class for the register route of the CMS
    - [RegisterSubmit](src/Cms/RegisterSubmit.php) | Class for the register submit route of the CMS
    - [ResetPassword](src/Cms/ResetPassword.php) | Class for the reset password route of the CMS
    - [ResetPasswordSubmit](src/Cms/ResetPasswordSubmit.php) | Class for the submit reset password route of the CMS
    - [Robots](src/Cms/Robots.php) | Class for the robots.txt route of the CMS
    - [Sitemap](src/Cms/Sitemap.php) | Class for the sitemap.xml route of the CMS
    - [Specific](src/Cms/Specific.php) | Class for the specific route of the CMS, generates the update form for a row
    - [SpecificAdd](src/Cms/SpecificAdd.php) | Class for the specific add route of the CMS, generates the insert form for a row
    - [SpecificAddSubmit](src/Cms/SpecificAddSubmit.php) | Class for the submit specific add route, to process the insertion of a new row in the CMS
    - [SpecificCalendar](src/Cms/SpecificCalendar.php) | Class for the calendar widget route of the CMS
    - [SpecificDelete](src/Cms/SpecificDelete.php) | Class for the specific delete route, to process a row deletion in the CMS
    - [SpecificDispatch](src/Cms/SpecificDispatch.php) | Class for the specific dispatch route, directs to the proper dispatch route of the CMS
    - [SpecificDownload](src/Cms/SpecificDownload.php) | Class for the file download route of the CMS
    - [SpecificDuplicate](src/Cms/SpecificDuplicate.php) | Class for the specific duplicate route, to process a row duplication in the CMS
    - [SpecificRelation](src/Cms/SpecificRelation.php) | Class for the route which manages specific relation - enumSet inputs in the specific form
    - [SpecificSubmit](src/Cms/SpecificSubmit.php) | Class for the submit specific route, to process the update of a row in the CMS
    - [SpecificTableRelation](src/Cms/SpecificTableRelation.php) | Class for the route which manages table relation, used by some inputs in the CMS
    - [SpecificUserWelcome](src/Cms/SpecificUserWelcome.php) | Class for the specific user welcome route which can send a welcome email to the user
    - [_common](src/Cms/_common.php) | Trait that provides commonly used methods for the CMS
    - [_export](src/Cms/_export.php) | Trait that provides commonly used methods for exporting data from the CMS
    - [_general](src/Cms/_general.php) | Trait that provides commonly used methods related to the general navigation route of the CMS
    - [_module](src/Cms/_module.php) | Trait that provides some initial configuration for a CMS module route
    - [_nobody](src/Cms/_nobody.php) | Trait which provides commonly used methods for routes where the user is not logged in the CMS
    - [_page](src/Cms/_page.php) | Trait that provides some practical methods to work with page route within the CMS
    - [_specific](src/Cms/_specific.php) | Trait that provides commonly used methods for the specific routes of the CMS
    - [_specificSubmit](src/Cms/_specificSubmit.php) | Trait that provides commonly used methods for the specific submit routes of the CMS
    - [_template](src/Cms/_template.php) | Trait that grants the methods to generate the CMS HTML template
- [Col](src/Col)
    - [Date](src/Col/Date.php) | Extended class for a date column, supports many date formats
    - [Email](src/Col/Email.php) | Extended class for a column managing email
    - [Files](src/Col/Files.php) | Extended abstract class extended by the media and medias cols
    - [Primary](src/Col/Primary.php) | Extended class for dealing with a column which has an auto increment primary key
    - [Relation](src/Col/Relation.php) | Extended abstract class extended for relation
    - [Textarea](src/Col/Textarea.php) | Extended class for a column which is editable through a textarea input
- [Lang](src/Lang)
    - [En](src/Lang/En.php) | English language content used by this namespace
    - [Fr](src/Lang/Fr.php) | French language content used by this namespace
- [Role](src/Role.php) | Extended abstract class that provides cms logic for a role
    - [Admin](src/Role/Admin.php) | Extended class which contains the cms default configuration for the admin role
    - [Contributor](src/Role/Contributor.php) | Class which contains the cms default configuration for the contributor role (disabled per default)
    - [Cron](src/Role/Cron.php) | Extended class which contains the cms default configuration for the cron role
    - [Editor](src/Role/Editor.php) | Class which contains the cms default configuration for the editor role
    - [Nobody](src/Role/Nobody.php) | Extended class that issues cms default configuration for the nobody role
    - [Shared](src/Role/Shared.php) | Extended class that contains the cms default configuration for the shared role (disabled per default)
    - [SubAdmin](src/Role/SubAdmin.php) | Class that contains the cms default configuration for the subAdmin role (disabled per default)
    - [User](src/Role/User.php) | Extended class that contains the cms default configuration for the user role (disabled per default)
- [Row](src/Row)
    - [User](src/Row/User.php) | Extended class for a row of the user table, with cms logic
- [Table](src/Table.php) | Extended class to represent an existing table within a database, adds cms config

### Testing
**QuidPHP/Lemur** contains 4 test classes:
- [Boot](test/Boot.php) | Class for testing Quid\Lemur\Boot
- [Route](test/Route.php) | Class for testing route
- [Routes](test/Routes.php) | Class for testing routes
- [Table](test/Table.php) | Class for testing table

**QuidPHP/Lemur** testsuite can be run by creating a new [quidphp/project](https://github.com/quidphp/project).

## JS

### Convention
- *jQuery*: All behaviours and widgets are programmed on top of the jQuery library. Many functions are connected with jQuery.fn. Custom events are used across the board, a lot of calls to the jQuery [trigger](https://api.jquery.com/trigger/) and [triggerHandler](https://api.jquery.com/triggerHandler/) methods.
- *Include*: Many scripts are in the include folder. These scripts are used for the CMS but can also be reused within the application.

### Overview
**QuidPHP/Lemur** contains 27 JavaScript files. Here is an overview:
- [cms](js/cms)
    - [cms.js](js/cms/cms.js) | Script of common behaviours for all pages of the CMS
    - [general.js](js/cms/general.js) | Script of behaviours for the general navigation page of the CMS
    - [home.js](js/cms/home.js) | Script of behaviours for the homepage of the CMS
    - [nobody.js](js/cms/nobody.js) | Script of behaviours for all pages where the user is not logged in the CMS
    - [somebody.js](js/cms/somebody.js) | Script of behaviours for all pages where the user is logged in the CMS
    - [specific.js](js/cms/specific.js) | Script of behaviours for the specific form page of the CMS
- [include](js/include)
    - [_helper.js](js/include/_helper.js) | Script with a set of helper functions appended to the jQuery object
    - [accordion.js](js/include/accordion.js) | Script of behaviours for an accordion-related widgets
    - [addRemove.js](js/include/addRemove.js) | Script of behaviours for an add-remove input (like jsonArray)
    - [ajax.js](js/include/ajax.js) | Script with some additional logic over the jQuery ajax object
    - [appendContainer.js](js/include/appendContainer.js) | Script of behaviours for an appendContainer widget (load more)
    - [box.js](js/include/box.js) | Script with behaviours for a box widget (popup in a fixed div)
    - [calendar.js](js/include/calendar.js) | Script with behaviours for a calendar and a date input
    - [clickOpen.js](js/include/clickOpen.js) | Script with some basic logic for a clickOpen widget (click trigger to show, click body to hide)
    - [dragDrop.js](js/include/dragDrop.js) | Script with a function to activate vertical sorting (using jquery-ui)
    - [event.js](js/include/event.js) | Script containing custom events for jQuery
    - [expr.js](js/include/expr.js) | Script containing custom expressions for jQuery
    - [fn.js](js/include/fn.js) | Script with some common fn functions added to jQuery
    - [form.js](js/include/form.js) | Script with behaviours related to form and field validation
    - [input.js](js/include/input.js) | Script containing logic for some simple inputs
    - [navigation.js](js/include/navigation.js) | Script containing the logic related to site navigation by using the HistoryAPI
    - [relation.js](js/include/relation.js) | Script containing logic and methods for relation-related inputs (like enumSet and filters)
    - [scroll.js](js/include/scroll.js) | Script containing logic related to window scrolling
    - [search.js](js/include/search.js) | Script with behaviours for search inputs
    - [tab.js](js/include/tab.js) | Script with behaviours for a tab system and a slider
- [jquery](js/jquery)
    - [jquery.js](js/jquery/jquery.js) | jQuery - The popular JavaScript library
	- [jquery-ui.js](js/jquery/jquery-ui.js) | jQuery-UI - A minimal version of the library is used for drag & drop sorting
	
## SCSS

### Convention
- *Mixins*: Nesting, variables and mixins are used within the SCSS stylesheets.
- *Include*: Some stylesheets are in the include folder. Those stylesheets are used for the CMS but can also be reused within the application.

### Overview
**QuidPHP/Lemur** contains 18 CSS and SCSS stylesheets. Here is an overview:
- [cms](scss/cms)
    - [box.scss](scss/cms/box.scss) | Stylesheet for the various popup box route of the CMS
    - [calendar.scss](scss/cms/calendar.scss) | Stylesheet for the calendar widget of the CMS
    - [clickOpen.scss](scss/cms/clickOpen.scss) | Stylesheet for the various clickOpen components of the CMS
    - [cms.scss](scss/cms/cms.scss) | Stylesheet that imports other stylesheets for the CMS
    - [error.scss](scss/cms/error.scss) | Stylesheet for the error page of the CMS
    - [form.scss](scss/cms/form.scss) | Stylesheet for the various form inputs of the CMS
    - [general.scss](scss/cms/general.scss) | Stylesheet for the general navigation page of the CMS
    - [home.scss](scss/cms/home.scss) | Stylesheet for the home page of the CMS
    - [icon.scss](scss/cms/icon.scss) | Stylesheet containing the rules related to the icons of the CMS
    - [icon64.scss](scss/cms/icon64.scss) | Stylesheet containing all CMS icons in base64
    - [include.scss](scss/cms/include.scss) | Stylesheet that contains variables and mixins for the CMS
    - [interface.scss](scss/cms/interface.scss) | Stylesheet for the main interface of the CMS
    - [nobody.scss](scss/cms/nobody.scss) | Stylesheet for the routes where the user is not logged in the CMS
    - [specific.scss](scss/cms/specific.scss) | Stylesheet for the specific form page of the CMS
    - [style.scss](scss/cms/style.scss) | Stylesheet containing the root styling rules as well as common classes for the CMS
- [include](scss/include)
    - [component.scss](scss/include/component.scss) | Stylesheet containing various reusable component mixins
    - [include.scss](scss/include/include.scss) | Stylesheet containing many helpers mixins
- [normalize](scss/normalize)
    - [normalize.css](scss/normalize/normalize.css) Normalize - Stylesheet for normalizing the default rules across browsers