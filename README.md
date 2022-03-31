# QuidPHP/Lemur
[![Release](https://img.shields.io/github/v/release/quidphp/lemur)](https://packagist.org/packages/quidphp/lemur)
[![License](https://img.shields.io/github/license/quidphp/lemur)](https://github.com/quidphp/lemur/blob/master/LICENSE)
[![PHP Version](https://img.shields.io/packagist/php-v/quidphp/lemur)](https://www.php.net)
[![Style CI](https://styleci.io/repos/206858806/shield)](https://styleci.io)
[![Code Size](https://img.shields.io/github/languages/code-size/quidphp/lemur)](https://github.com/quidphp/lemur)

## About
**QuidPHP/Lemur** contains the LemurCMS, a content management system built on top of the QuidPHP framework. It is part of the [QuidPHP](https://github.com/quidphp/project) package. 

## License
**QuidPHP/Lemur** is available as an open-source software under the [MIT license](LICENSE).

## Documentation
**QuidPHP/Lemur** documentation is being written. Once ready, it will be available at [QuidPHP/Docs](https://github.com/quidphp/docs).

## Installation
**QuidPHP/Lemur** can be easily installed with [Composer](https://getcomposer.org). It is available on [Packagist](https://packagist.org/packages/quidphp/lemur).
``` bash
$ composer require quidphp/lemur
```
Once installed, the **Quid\Lemur** namespace will be available within your PHP application.

## Requirement
**QuidPHP/Lemur** requires the following:
- PHP 7.4, 8.0 or 8.1
- Mysql (>= 8.0) or MariaDB (>= 10.5) database
- All other requirements specified in [quidphp/core](https://github.com/quidphp/core)
- Minimal browser: Internet Explorer 11

## Dependency
**QuidPHP/Lemur** has the following dependencies:
- [quidphp/base](https://github.com/quidphp/base) - Quid\Base - PHP library that provides a set of low-level static methods
- [quidphp/main](https://github.com/quidphp/main) - Quid\Main - PHP library that provides a set of base objects and collections 
- [quidphp/orm](https://github.com/quidphp/orm) - Quid\Orm - PHP library that provides database access and a comprehensive ORM
- [quidphp/routing](https://github.com/quidphp/routing) - Quid\Routing - PHP library that provides a route matching and triggering procedure
- [quidphp/core](https://github.com/quidphp/core) - Quid\Core - PHP library that provides an extendable platform to create dynamic applications
- [quidphp/front](https://github.com/quidphp/front) - Quid\Front - QuidPHP JavaScript and CSS front-end assets
- [verot/class.upload.php](https://github.com/verot/class.upload.php) - Verot\Upload - A popular PHP class used for resizing images
- [phpmailer/phpmailer](https://github.com/phpmailer/phpmailer) - PHPMailer\PHPMailer - The classic email sending library for PHP
- [tedivm/jshrink](https://github.com/tedious/JShrink) - JShrink - Javascript Minifier built in PHP
- [scssphp/scssphp](https://github.com/scssphp/scssphp) - ScssPhp\ScssPhp - SCSS compiler written in PHP
- [tinymce/tinymce](https://github.com/tinymce/tinymce) - Tinymce - The world's #1 JavaScript library for rich text editing

All dependencies will be resolved by using the [Composer](https://getcomposer.org) installation process.

## Included
**QuidPHP/Lemur** comes bundled with the following front-end packages:
- [tinymce/tinymce](https://github.com/tinymce/tinymce) - Tinymce - French language pack for Tinymce
- [SortableJs/Sortable](https://github.com/SortableJS/Sortable) - Sortable - A JavaScript library for reorderable drag-and-drop lists on modern browsers and touch devices

## Comment
**QuidPHP/Lemur** code is commented and all methods are explained. However, most of the comments are written in French.

## PHP

### Convention
**QuidPHP/Lemur** is built on the following conventions:
- *Core overloading*: This namespace overloads many classes from Quid\Core.
- *Auto-alias*: All class names that finishes by Alias will resolve to the existing class if no alias exists. Exemple: MyRole extents RoleAlias -> will resolve to Role if no alias is found.
- *Traits*: Traits filenames start with an underscore (_).
- *Type*: Files, function arguments and return types are strict typed.
- *Config*: A special $config static property exists in all classes. This property gets recursively merged with the parents' property on initialization.
- *Coding*: No curly braces are used in a IF statement if the condition can be resolved in only one statement.

### Overview
**QuidPHP/Lemur** contains 203 classes and traits. Here is an overview:
- [Boot](src/Boot.php) - Extended abstract class for the object that bootstraps the cms
- [Cell](src/Cell.php) - Extended class to represent an existing cell within a row
    - [Crypt](src/Cell/Crypt.php) - Extended class for a cell with crypted data
    - [Files](src/Cell/Files.php) - Abstract class extended by the media and medias cells
    - [JsonArray](src/Cell/JsonArray.php) - Class to manage a cell containing a json array
    - [JsonArrayRelation](src/Cell/JsonArrayRelation.php) - Class to manage a cell containing a relation value to another cell containing a json array
    - [JsonExport](src/Cell/JsonExport.php) - Class for a cell that contains json which should be exported (similar to var_export)
    - [Media](src/Cell/Media.php) - Class to work with a cell containing a value which is a link to a file
    - [Medias](src/Cell/Medias.php) - Class to manage a cell containing a value which is a link to many files
    - [Money](src/Cell/Money.php) - Class to manage a cell managing money (money formatted string)
    - [Phone](src/Cell/Phone.php) - Class for a cell managing phone numbers
    - [Primary](src/Cell/Primary.php) - Class for dealing with a cell of a column which has an auto increment primary key
    - [Relation](src/Cell/Relation.php) - Abstract class extended by the enum and set cells
    - [Uri](src/Cell/Uri.php) - Class to manage a cell containing an URI
    - [Video](src/Cell/Video.php) - Class to manage a cell containing a video from a third-party service
- [Cms](src/Cms)
    - [About](src/Cms/About.php) - Class for the about popup route of the CMS
    - [Account](src/Cms/Account.php) - Class for the account route of the CMS, by default redirects to the user's specific route
    - [AccountChangePassword](src/Cms/AccountChangePassword.php) - Class for the change password route in the CMS
    - [AccountChangePasswordSubmit](src/Cms/AccountChangePasswordSubmit.php) - Class for the submit change password route in the CMS
    - [ActivatePassword](src/Cms/ActivatePassword.php) - Class for activating the password in the CMS
    - [Calendar](src/Cms/Calendar.php) - Class for the calendar route of the CMS
    - [CliClearAll](src/Cms/CliClearAll.php) - Class for a cli route to remove all cached and logged data
    - [CliClearCache](src/Cms/CliClearCache.php) - Class for a cli route to remove all cached data
    - [CliClearLog](src/Cms/CliClearLog.php) - Class for a cli route to remove all log data
    - [CliCompile](src/Cms/CliCompile.php) - Class for a cli route to compile assets (js and css)
    - [CliPreload](src/Cms/CliPreload.php) - Class for a cli route to generate the preload PHP script
    - [CliSessionGc](src/Cms/CliSessionGc.php) - Class for a cli route to remove expired sessions for the CMS
    - [CliVersion](src/Cms/CliVersion.php) - Class for the version route of the CMS, accessible via the cli
    - [Contact](src/Cms/Contact.php) - Class for the contact form route of the CMS
    - [ContactSubmit](src/Cms/ContactSubmit.php) - Class for a contact submit route for the CMS
    - [Download](src/Cms/Download.php) - Class for the file download route of the CMS
    - [Email](src/Cms/Email.php) - Class for the modal route to confirm the mailto link
    - [Error](src/Cms/Error.php) - Class for the error route of the CMS
    - [Export](src/Cms/Export.php) - Class for the export popup route of the CMS
    - [ExportDownload](src/Cms/ExportDownload.php) - Class for the route to generate and download the CSV export for the CMS
    - [General](src/Cms/General.php) - Class for the general navigation route of the CMS
    - [GeneralDelete](src/Cms/GeneralDelete.php) - Class for the route which allows deleting rows from the general navigation page of the CMS
    - [GeneralEdit](src/Cms/GeneralEdit.php) - Class for the route that allows quick editing a cell from the general page
    - [GeneralEditSubmit](src/Cms/GeneralEditSubmit.php) - Class for the route to manage the form to quick edit a cell from the general page
    - [GeneralRelation](src/Cms/GeneralRelation.php) - Class for the route which manages the filters for the general navigation page of the CMS
    - [GeneralTruncate](src/Cms/GeneralTruncate.php) - Class for the route which allows truncating a table from the general page of the CMS
    - [Home](src/Cms/Home.php) - Class for the home route of the CMS
    - [HomeFeed](src/Cms/HomeFeed.php) - Class for the route feed of the home page for the CMS
    - [HomeFeedRelation](src/Cms/HomeFeedRelation.php) - Class for the route which manages table relation, used by some inputs in the CMS
    - [Login](src/Cms/Login.php) - Class for the login route of the CMS
    - [LoginSubmit](src/Cms/LoginSubmit.php) - Class for the login submit route of the CMS
    - [Logout](src/Cms/Logout.php) - Class for the logout route of the CMS
    - [PopupBoot](src/Cms/PopupBoot.php) - Class for the popup route with the boot information
    - [PopupSession](src/Cms/PopupSession.php) - Class for the popup route with the session information
    - [Register](src/Cms/Register.php) - Class for the register route of the CMS
    - [RegisterSubmit](src/Cms/RegisterSubmit.php) - Class for the register submit route of the CMS
    - [ResetPassword](src/Cms/ResetPassword.php) - Class for the reset password route of the CMS
    - [ResetPasswordSubmit](src/Cms/ResetPasswordSubmit.php) - Class for the submit reset password route of the CMS
    - [Robots](src/Cms/Robots.php) - Class for the robots.txt route of the CMS
    - [Search](src/Cms/Search.php) - Class for the global search route of the CMS
    - [SessionRole](src/Cms/SessionRole.php) - Class for the route with the popup to apply a fake role to the current session
    - [SessionRoleSubmit](src/Cms/SessionRoleSubmit.php) - Class for the route to submit and apply a fake role to the current session
    - [Sitemap](src/Cms/Sitemap.php) - Class for the automated sitemap.xml route of the CMS
    - [Specific](src/Cms/Specific.php) - Class for the specific route of the CMS, generates the update form for a row
    - [SpecificAdd](src/Cms/SpecificAdd.php) - Class for the specific add route of the CMS, generates the insert form for a row
    - [SpecificAddSubmit](src/Cms/SpecificAddSubmit.php) - Class for the submit specific add route, to process the insertion of a new row in the CMS
    - [SpecificDelete](src/Cms/SpecificDelete.php) - Class for the specific delete route, to process a row deletion in the CMS
    - [SpecificDispatch](src/Cms/SpecificDispatch.php) - Class for the specific dispatch route, directs to the proper dispatch route of the CMS
    - [SpecificDuplicate](src/Cms/SpecificDuplicate.php) - Class for the specific duplicate route, to process a row duplication in the CMS
    - [SpecificMulti](src/Cms/SpecificMulti.php) - Class for the specific multi route of the CMS, generates the update form for multiple rows
    - [SpecificMultiSubmit](src/Cms/SpecificMultiSubmit.php) - Class for the submit multi specific route, to process the update of multiple rows in the CMS
    - [SpecificPosition](src/Cms/SpecificPosition.php) - Class for a route that redirects to the proper specific route according to a position
    - [SpecificRelation](src/Cms/SpecificRelation.php) - Class for the route which manages specific relation - enumSet inputs in the specific form
    - [SpecificSubmit](src/Cms/SpecificSubmit.php) - Class for the submit specific route, to process the update of a row in the CMS
    - [TableRelation](src/Cms/TableRelation.php) - Class for the route which manages table relation, used by some inputs in the CMS
    - [UserWelcome](src/Cms/UserWelcome.php) - Class for the user welcome route which can send a welcome email to the user
    - [_cli](src/Cms/_cli.php) - Trait that provides some initial configuration for a CMS cli route
    - [_colRelation](src/Cms/_colRelation.php) - Trait that provides methods related to a column relation
    - [_common](src/Cms/_common.php) - Trait that provides commonly used methods for the CMS
    - [_export](src/Cms/_export.php) - Trait that provides commonly used methods for exporting data from the CMS
    - [_general](src/Cms/_general.php) - Trait that provides commonly used methods related to the general navigation route of the CMS
    - [_generalInput](src/Cms/_generalInput.php) - Trait that provides some methods for generating reusable general inputs
    - [_generalRelation](src/Cms/_generalRelation.php) - Trait that provides methods to make a filter from a relation
    - [_generalSegment](src/Cms/_generalSegment.php) - Trait that provides some methods for a general navigation page
    - [_link](src/Cms/_link.php) - Trait that provides some initial configuration for a CMS link route
    - [_module](src/Cms/_module.php) - Trait that provides some initial configuration for a CMS module route
    - [_nobody](src/Cms/_nobody.php) - Trait which provides commonly used methods for routes where the user is not logged in the CMS
    - [_page](src/Cms/_page.php) - Trait that provides some practical methods to work with page route within the CMS
    - [_popup](src/Cms/_popup.php) - Trait that provides some initial configuration for a CMS popup route
    - [_relation](src/Cms/_relation.php) - Trait that provides some initial configuration for a CMS relation route
    - [_specific](src/Cms/_specific.php) - Trait that provides commonly used methods for the specific routes of the CMS
    - [_specificAddMulti](src/Cms/_specificAddMulti.php) - Trait that provides common methods between the specificAdd and specificMulti routes
    - [_specificNav](src/Cms/_specificNav.php) - Trait that provides a method for the specific navigation
    - [_specificRelation](src/Cms/_specificRelation.php) - Trait that provides methods to make an enumSet input
    - [_specificSubmit](src/Cms/_specificSubmit.php) - Trait that provides commonly used methods for the specific submit routes of the CMS
    - [_tableRelation](src/Cms/_tableRelation.php) - Trait that provides methods for a table relation selector
    - [_template](src/Cms/_template.php) - Trait that grants the methods to generate the CMS HTML template
- [Col](src/Col.php) - Extended class to represent an existing column within a table, adds cms config
    - [Auto](src/Col/Auto.php) - Class for the auto column, generate value automatically using the data from other cells
    - [ContextType](src/Col/ContextType.php) - Class for the contextType column, a checkbox set relation with all boot types
    - [Crypt](src/Col/Crypt.php) - Extended class for a column with crypted data
    - [Date](src/Col/Date.php) - Extended class for a date column, supports many date formats
    - [Email](src/Col/Email.php) - Extended class for a column managing email
    - [Error](src/Col/Error.php) - Extended class for a column that manages an error object
    - [Excerpt](src/Col/Excerpt.php) - Class for a column which contains an excerpt of a longer value
    - [Files](src/Col/Files.php) - Extended abstract class extended by the media and medias cols
    - [Fragment](src/Col/Fragment.php) - Class for a column which contains URI fragments
    - [IntegerRange](src/Col/IntegerRange.php) - Class for an integer column that supports range
    - [JsonArray](src/Col/JsonArray.php) - Class for a column which offers a special input for json values
    - [JsonArrayRelation](src/Col/JsonArrayRelation.php) - Class to manage a column containing a relation value to another column which is a jsonArray
    - [JsonExport](src/Col/JsonExport.php) - Class for a column that contains json which should be exported
    - [Media](src/Col/Media.php) - Extended class to work with a column containing a value which is a link to a file
    - [Medias](src/Col/Medias.php) - Class to work with a column containing a value which is a link to many files
    - [Money](src/Col/Money.php) - Class for a column managing money (money formatted string)
    - [Percent](src/Col/Percent.php) - Class for a column percent value
    - [Phone](src/Col/Phone.php) - Class for a column managing phone numbers, automatically formats the value
    - [Primary](src/Col/Primary.php) - Extended class for dealing with a column which has an auto increment primary key
    - [Range](src/Col/Range.php) - Class for a column managing a range (minimum, maximum, increment)
    - [Relation](src/Col/Relation.php) - Extended abstract class extended for a relation
    - [Request](src/Col/Request.php) - Extended class for a column that manages a request object
    - [Serialize](src/Col/Serialize.php) - Extended class for a column which should serialize its value
    - [Set](src/Col/Set.php) - Class for a column containing a set relation (many)
    - [Slug](src/Col/Slug.php) - Class for a column dealing with an URI slug
    - [SlugPath](src/Col/SlugPath.php) - Class for a column dealing with an URI slug within a URI path
    - [Textarea](src/Col/Textarea.php) - Class for a column which is editable through a textarea input
    - [TinyMce](src/Col/TinyMce.php) - Class for a column which transforms the textarea in a simple tinymce WYSIWYG editor
    - [TinyMceAdvanced](src/Col/TinyMceAdvanced.php) - Class for a column which transforms the textarea in a complex tinymce WYSIWYG editor
    - [UriAbsolute](src/Col/UriAbsolute.php) - Extended class for a column managing an absolute uri
    - [UserActive](src/Col/UserActive.php) - Class for the column which manages the active field for the user row
    - [UserPassword](src/Col/UserPassword.php) - Class for the column which manages the active field for the user row
    - [UserRole](src/Col/UserRole.php) - Class for the column which manages the role field for the user row
    - [Video](src/Col/Video.php) - Extended abstract class for a column containing a video from a third-party service
    - [_jsonRelation](src/Col/_jsonRelation.php) - Trait with common methods for jsonArrayRelation columns
- [Db](src/Db.php) - Extended class used to query the database, adds cms logic
- [Lang](src/Lang)
    - [En](src/Lang/En.php) - English language content used by this namespace
    - [Fr](src/Lang/Fr.php) - French language content used by this namespace
- [Route](src/Route.php) - Extended abstract class for a route, adds cms logic
    - [Account](src/Route/Account.php) - Abstract class for an account route
    - [AccountChangePassword](src/Route/AccountChangePassword.php) - Abstract class for an account change password route
    - [AccountChangePasswordSubmit](src/Route/AccountChangePasswordSubmit.php) - Abstract class for an account change password submit route
    - [AccountSubmit](src/Route/AccountSubmit.php) - Abstract class for an account submit route
    - [ActivatePassword](src/Route/ActivatePassword.php) - Abstract class for a route to activate a password that was previously reset
    - [Contact](src/Route/Contact.php) - Abstract class for a contact form route
    - [ContactSubmit](src/Route/ContactSubmit.php) - Abstract class for a contact submit route
    - [Login](src/Route/Login.php) - Abstract class for a login route
    - [LoginSubmit](src/Route/LoginSubmit.php) - Abstract class for a login submit route
    - [Logout](src/Route/Logout.php) - Abstract class for a logout route
    - [Register](src/Route/Register.php) - Abstract class for a register route
    - [RegisterSubmit](src/Route/RegisterSubmit.php) - Abstract class for a register submit route
    - [ResetPassword](src/Route/ResetPassword.php) - Abstract class for a reset password route
    - [ResetPasswordSubmit](src/Route/ResetPasswordSubmit.php) - Abstract class for a reset password submit route
    - [_browscap](src/Route/_browscap.php) - Trait with a method to generate text related to browser capabilities
    - [_calendar](src/Route/_calendar.php) - Trait that provides most methods to make a calendar route
    - [_download](src/Route/_download.php) - Trait that provides most methods necessary to make a download route
    - [_formSubmit](src/Route/_formSubmit.php) - Trait that provides methods and logic necessary to make a form submit route
    - [_modal](src/Route/_modal.php) - Trait that provides some initial configuration for modal routes
    - [_rowsFeed](src/Route/_rowsFeed.php) - Trait that grants methods related to a rows feed (with a load-more)
    - [_searchGet](src/Route/_searchGet.php) - Trait that grants methods for search route via GET
    - [_searchPost](src/Route/_searchPost.php) - Trait that grants methods for search route via POST
    - [_specificPointer](src/Route/_specificPointer.php) - Trait that grants methods to deal with a specific resource represent by a pointer (table/id)
    - [_specificPrimary](src/Route/_specificPrimary.php) - Trait that provides most methods used for a specific route using a primary segment
    - [_specificSlug](src/Route/_specificSlug.php) - Trait with methods to work with a specific resource represented by an URI slug
- [Row](src/Row.php) - Extended class to represent a row within a table, adds cms config
    - [CacheRoute](src/Row/CacheRoute.php) - Class to store rendered route caches, with cms config
    - [Contact](src/Row/Contact.php) - Class to work with a row of the contact table, stores contact messages
    - [Email](src/Row/Email.php) - Class to deal with a row of the email table, with cms config
    - [Lang](src/Row/Lang.php) - Class to work with a row of the lang table, with cms config
    - [Log](src/Row/Log.php) - Class to represent a row of the log table, with cms config
    - [LogCron](src/Row/LogCron.php) - Class to represent a row of the logCron table, with cms config
    - [LogEmail](src/Row/LogEmail.php) - Class to represent a row of the logEmail table, with cms config
    - [LogError](src/Row/LogError.php) - Class to represent a row of the logError table, with cms config
    - [LogHttp](src/Row/LogHttp.php) - Class to represent a row of the logHttp table, with cms config
    - [LogSql](src/Row/LogSql.php) - Class to represent a row of the logSql table, with cms config
    - [QueueEmail](src/Row/QueueEmail.php) - Class to deal with a row of the queueEmail table, with cms config
    - [Redirection](src/Row/Redirection.php) - Class to work with a row of the redirection table, with cms config
    - [Session](src/Row/Session.php) - Extended class for a row of the session table, with cms config
    - [User](src/Row/User.php) - Extended class for a row of the user table, with cms logic
    - [_log](src/Row/_log.php) - Trait to set permissions for a log row
    - [_media](src/Row/_media.php) - Trait to work with a row of containing media, storage or video
    - [_meta](src/Row/_meta.php) - Trait with methods to make a row a meta-source
- [Segment](src/Segment)
    - [_boolean](src/Segment/_boolean.php) - Trait that issues a method to deal with boolean route segment (1 or 0)
    - [_col](src/Segment/_col.php) - Trait to manage a route segment which must contain a column name or object
    - [_colRelation](src/Segment/_colRelation.php) - Trait to work with a route segment which must contain a column with a relation
    - [_cols](src/Segment/_cols.php) - Trait to manage a route segment which must contain many columns
    - [_direction](src/Segment/_direction.php) - Trait to deal with a route segment which must contain a sorting direction
    - [_filter](src/Segment/_filter.php) - Trait to manage a complex route segment which contains filtering directive
    - [_int](src/Segment/_int.php) - Trait that issues a method to deal with a simple integer route segment
    - [_limit](src/Segment/_limit.php) - Trait that issues a method to deal with a limit route segment (max per page)
    - [_numeric](src/Segment/_numeric.php) - Trait that issues a method to deal with a simple numeric route segment
    - [_order](src/Segment/_order.php) - Trait to manage a route segment which must contain an orderable column
    - [_orderColRelation](src/Segment/_orderColRelation.php) - Trait to work with a route segment which must contain an orderable column relation
    - [_orderTableRelation](src/Segment/_orderTableRelation.php) - Trait to manage a route segment which must contain an orderable table relation
    - [_page](src/Segment/_page.php) - Trait that issues a method to deal with a page route segment (page number)
    - [_pointer](src/Segment/_pointer.php) - Trait to work with a pointer route segment (value which contains a table and row)
    - [_primaries](src/Segment/_primaries.php) - Trait to deal with a route segment which must contain many rows
    - [_primary](src/Segment/_primary.php) - Trait to work with a route segment which must contain a row id or object
    - [_selected](src/Segment/_selected.php) - Trait that provides logic to deal with a route segment which represents a selected value
    - [_slug](src/Segment/_slug.php) - Trait that issues methods to work with a standard slug route segment
    - [_str](src/Segment/_str.php) - Trait that issues a method to deal with a simple string route segment
    - [_table](src/Segment/_table.php) - Trait to work with a route segment which must contain a table name or object
    - [_timestamp](src/Segment/_timestamp.php) - Trait to deal with a route segment which contains a timestamp
    - [_timestampMonth](src/Segment/_timestampMonth.php) - Trait to work with a route segment which contains the timestamp of a month
    - [_yes](src/Segment/_yes.php) - Trait that issues a method to deal with yes route segment
- [Service](src/Service)
    - [Polyfill](src/Service/Polyfill.php) - Class to integrate javascript polyfills
    - [Sortable](src/Service/Sortable.php) - Class to integrate the sortable javascript library
    - [TinyMce](src/Service/TinyMce.php) - Class that provides a method to integrate the Tinymce WYSIWYG editor
- [Session](src/Session.php) - Extended class for the session with methods related to the CMS
- [Table](src/Table.php) - Extended class to represent an existing table within a database

### Testing
**QuidPHP/Lemur** contains 8 test classes:
- [Boot](test/Boot.php) - Class for testing Quid\Lemur\Boot
- [Cell](test/Cell.php) - Class for testing Quid\Lemur\Cell
- [Col](test/Col.php) - Class for testing Quid\Lemur\Col
- [Route](test/Route.php) - Class for testing Quid\Lemur\Route
- [Row](test/Row.php) - Class for testing Quid\Lemur\Row
- [Session](test/Session.php) - Class for testing Quid\Lemur\Session
- [Suite](test/Suite)
    - [BootLemur](test/Suite/BootLemur.php) - Class for booting the Quid\Lemur testsuite
- [Table](test/Table.php) - Class for testing Quid\Lemur\Table

**QuidPHP/Lemur** PHP testsuite can be run by creating a new [QuidPHP/assert](https://github.com/quidphp/assert) project.

## JS

### Convention
- *ES5*: All code is compatible with ES5, there is no need for any JavaScript transpiler.
- *Strict*: All generated files declare *use strict* on the first line.
- *IE11*: The minimum compatible browser is IE11. Older browsers will fail non-gracefully.
- *Compiling*: The concatenation of the JS files is done on the PHP side.

### Overview
**QuidPHP/Lemur** contains 17 JavaScript files. Here is an overview:
- [cms](js/cms)
    - [_lemur.js](js/cms/_lemur.js) - Script of common behaviours for all pages of the CMS
    - [colsSorter.js](js/cms/colsSorter.js) - Script for the col sorter component of the general page of the CMS
    - [com.js](js/cms/com.js) - Script of behaviours for the communication component of the CMS
    - [generalComponents.js](js/cms/generalComponents.js) - Component that manages the components on the general page
    - [homeFeed.js](js/cms/homeFeed.js) - Script for feed component with a filter on the CMS home page
    - [inputFiles.js](js/cms/inputFiles.js) - Script with logic for the file upload component of the CMS
    - [quickEdit.js](js/cms/quickEdit.js) - Script for the quickEdit component in the general page of the CMS
    - [rowsChecker.js](js/cms/rowsChecker.js) - Script for the rows checker component in the general page of the CMS
    - [specificComponents.js](js/cms/specificComponents.js) - Component that manages the panel on the specific form page of the CMS
    - [specificMulti.js](js/cms/specificMulti.js) - Component that manages the multi modification form
    - [specificNav.js](js/cms/specificNav.js) - Component that manages the navigation box on the specific form page of the CMS
    - [specificPanel.js](js/cms/specificPanel.js) - Component that manages the panel on the specific form page of the CMS
    - [textareaExtra.js](js/cms/textareaExtra.js) - Script for a component to search and insert content within a textarea, with support for tinymce
- [component](js/component)
    - [addRemove.js](js/component/addRemove.js) - Script of behaviours for an add-remove input component
    - [enumSet.js](js/component/enumSet.js) - Script for an enumSet component (search in a relation)
    - [sorter.js](js/component/sorter.js) - Script with drag and drop related sorting functionnalities, uses Sortable
    - [tinymce.js](js/component/tinymce.js) - Component to manage a Tinymce wysiwyg input
	
## CSS

### Convention
- *SCSS*: Nesting, variables and mixins are used within the stylesheets.
- *Compiling*: The compiling and concatenation of the SCSS files is done on the PHP side.

### Overview
**QuidPHP/Lemur** contains 36 SCSS stylesheets. Here is an overview:
- [cms](css/cms)
    - [_form.scss](css/cms/_form.scss) - Stylesheet with various form-related mixins
    - [_include.scss](css/cms/_include.scss) - Stylesheet with various global mixins
    - [cms.scss](css/cms/cms.scss) - Stylesheet containing the root styling rules as well as common classes for the CMS
    - [general.scss](css/cms/general.scss) - Stylesheet for the general navigation page of the CMS
    - [home.scss](css/cms/home.scss) - Stylesheet for the home route of the CMS
    - [interface.scss](css/cms/interface.scss) - Stylesheet for the main interface of the CMS
    - [modal.scss](css/cms/modal.scss) - Stylesheet for the modal and the modal routes
    - [nobody.scss](css/cms/nobody.scss) - Stylesheet for the nobody routes of the CMS
    - [specific.scss](css/cms/specific.scss) - Stylesheet for the specific form page of the CMS
- [cms-component](css/cms-component)
    - [_include.scss](css/cms-component/_include.scss) - Stylesheet for various simple components of the CMS
    - [addRemove.scss](css/cms-component/addRemove.scss) - Stylesheet for the addRemove form component of the CMS
    - [block.scss](css/cms-component/block.scss) - Stylesheet for the block component of the CMS
    - [burger.scss](css/cms-component/burger.scss) - Stylesheet for the burger component of the CMS
    - [calendar.scss](css/cms-component/calendar.scss) - Stylesheet for the calendar component of the cms
    - [clickOpen.scss](css/cms-component/clickOpen.scss) - Stylesheet related to clickOpen components for the CMS
    - [colsSorter.scss](css/cms-component/colsSorter.scss) - Stylesheet for the colsSorter component of the CMS
    - [com.scss](css/cms-component/com.scss) - Stylesheet for the communication component of the CMS
    - [enumSet.scss](css/cms-component/enumSet.scss) - Stylesheet for the enumSet component of the CMS
    - [fakeSelect.scss](css/cms-component/fakeSelect.scss) - Stylesheet for the fakeSelect component of the CMS
    - [filter.scss](css/cms-component/filter.scss) - Stylesheet for the filter component of the CMS
    - [homeFeed.scss](css/cms-component/homeFeed.scss) - Stylesheet for the home feed component of the CMS
    - [inputCalendar.scss](css/cms-component/inputCalendar.scss) - Stylesheet for the input calendar of the CMS
    - [inputFiles.scss](css/cms-component/inputFiles.scss) - Stylesheet for the files upload inputs component of the CMS
    - [inputNumericRange.scss](css/cms-component/inputNumericRange.scss) - Styles for the integerRange component of the CMS
    - [mainNav.scss](css/cms-component/mainNav.scss) - Stylesheet for the main navigation component of the CMS
    - [modal.scss](css/cms-component/modal.scss) - Stylesheet for the modal component of the CMS
    - [quickEdit.scss](css/cms-component/quickEdit.scss) - Stylesheet for the quickEdit component of the CMS
    - [rowsChecker.scss](css/cms-component/rowsChecker.scss) - Stylesheet for the rowsChecker component of the CMS
    - [searchAutoInfo.scss](css/cms-component/searchAutoInfo.scss) - Stylesheet for the main search component of the CMS
    - [searchSlide.scss](css/cms-component/searchSlide.scss) - Mixin for the searchSlide component of the CMS
    - [specificNav.scss](css/cms-component/specificNav.scss) - Stylesheet for the speciic nav component of the CMS
    - [textareaExtra.scss](css/cms-component/textareaExtra.scss) - Stylesheet for the textarea component of the CMS (with relation inserts)
    - [tooltip.scss](css/cms-component/tooltip.scss) - Stylesheet for the tooltip component of the CMS
- [cms-icon](css/cms-icon)
    - [base64.scss](css/cms-icon/base64.scss) - Stylesheet containing all CMS icons in base64
    - [icon.scss](css/cms-icon/icon.scss) - Stylesheet generating rules for the base64 icons
- [cms-tinymce](css/cms-tinymce)
    - [tinymce.scss](css/cms-tinymce/tinymce.scss) - Stylesheet providing default styling for the Tinymce wysiwyg editor