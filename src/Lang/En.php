<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Lang;
use Quid\Core;

// en
// english language content used by this namespace
class En extends Core\Lang\En
{
    // config
    public static $config = [
        
        // login
        'login'=>[
            'usernameEmail'=>'Username or email',
            'remember'=>'Remember me ?',
        ],

        // resetPassword
        'resetPassword'=>[
            'forgot'=>'Forgot your password ?',
            'submit'=>'Submit'
        ],

        // register
        'register'=>[
            'confirmPassword'=>'Password confirmation'
        ],
        
        // accountChangePassword
        'accountChangePassword'=>[
            'oldPassword'=>'Current password',
            'newPassword'=>'New password',
            'newPasswordConfirm'=>'New password confirmation',
            'submit'=>'Change my password'
        ],

        // relationOrder
        'relationOrder'=>[
            'key'=>[
                1=>'Oldest first',
                2=>'Newest first',
            ],

            'value'=>[
                3=>'Alphabetical order',
                4=>'Inverted alphabetical order'
            ]
        ],

        // com
        'com'=>[

            // neg
            'neg'=>[

                // insert
                'insert'=>[
                    'contact'=>[
                        'failure'=>'Error sending the message.'
                    ]
                ]
            ],

            // pos
            'pos'=>[
                
                // slug
                'slug'=>[
                    'updated'=>'[count] other%s% line%s% updated'
                ],

                // user
                'user'=>[

                    // welcome
                    'welcome'=>[
                        'success'=>'The welcome email was sent.'
                    ],
                ],

                // duplicate
                'duplicate'=>[
                    'success'=>'Duplicate success'
                ],
                
                // insert
                'insert'=>[
                    'contact'=>[
                        'success'=>'Thank you, the message was sent !'
                    ]
                ]
            ]
        ],

        // role
        'role'=>[

            // label
            'label'=>[
                50=>'Contributor',
                60=>'Editor',
                70=>'Sub-admin'
            ]
        ],

        // relation
        'relation'=>[

            // contextType
            'contextType'=>[
                'cms'=>'Content management system'
            ]
        ],

        // browscap
        'browscap'=>[
            'noscript'=>'JavaScript is disabled on your browser.',
            'cookie'=>'Your browser does not accept cookies.',
            'unsupported'=>'Your browser is unsupported.'
        ],

        // route
        'route'=>[

            // label
            'label'=>[
                'account'=>'My account',
                'accountSubmit'=>'My account - Submit',
                'accountChangePassword'=>'Change my password',
                'accountChangePasswordSubmit'=>'Change my password - Submit',
                'activatePassword'=>'Activate password',
                'contact'=>'Contact',
                'contactSubmit'=>'Contact - Submit',
                'login'=>'Login',
                'loginSubmit'=>'Login - Submit',
                'logout'=>'Logout',
                'register'=>'Register',
                'registerSubmit'=>'Register - Submit',
                'resetPassword'=>'Reset password',
                'resetPasswordSubmit'=>'Reset password - Submit'
            ]
        ],

        // table
        'table'=>[

            // label
            'label'=>[
                'contact'=>'Contact',
                'admin'=>'Admin'
            ]
        ],

        // col
        'col'=>[
            
            // *
            '*'=>array(
                'featured'=>'Featured',
                'category'=>'Category',
                'lang'=>'Language',
                'index'=>'index',
                'subject'=>'Subject',
                'message'=>'Message',
                'method'=>'Method',
                'option'=>'Option',
                'menu'=>'In menu',
                'priority'=>'Priority',
                'body'=>'Body',
                'header'=>'Header',
                'phone'=>'Phone number',
                'company'=>'Company',
                'amount'=>'Amount',
                'year'=>'Year',
                'month'=>'Month',
                'day'=>'Day',
                'url'=>'Url',
                'uri'=>'Uri',
                'media_fr'=>'French media',
                'media_en'=>'English media',
                'video'=>'Video',
                'icon'=>'Icon',
                'icons'=>'Icons',
                'thumbnail'=>'Thumbnail',
                'storage_fr'=>'French file',
                'storage_en'=>'English file',
                'background'=>'Background',
                'title'=>'Title',
                'firstName'=>'First Name',
                'lastName'=>'Last Name',
                'fullName'=>'Full name',
                'country'=>'Country',
                'state'=>'State',
                'province'=>'Province',
                'city'=>'City',
                'zipCode'=>'Zip code',
                'postalCode'=>'Postal code',
                'key_fr'=>'French key',
                'key_en'=>'English key',
                'slug'=>'Slug',
                'slug_fr'=>'French slug',
                'slug_en'=>'English slug',
                'slugPath'=>'Slug path',
                'slugPath_fr'=>'French slug path',
                'slugPath_en'=>'English slug path',
                'fragment'=>'Fragment',
                'fragment_fr'=>'French fragment',
                'fragment_en'=>'English fragment',
                'name_fr'=>'French name',
                'name_en'=>'English name',
                'title_fr'=>'French title',
                'title_en'=>'English title',
                'content_fr'=>'French content',
                'content_en'=>'English content',
                'uri_fr'=>'French Uri',
                'uri_en'=>'English Uri',
                'metaTitle_fr'=>'French meta title',
                'metaTitle_en'=>'English meta title',
                'metaDescription_fr'=>'French meta description',
                'metaDescription_en'=>'English meta description',
                'metaKeywords_fr'=>'French meta keywords',
                'metaKeywords_en'=>'English meta keywords',
                'metaImage_fr'=>'French meta image',
                'metaImage_en'=>'English meta image',
                'metaSearch_fr'=>'French meta search',
                'metaSearch_en'=>'English meta search',
                'media_fr'=>'French media',
                'media_en'=>'English media',
                'video_fr'=>'French video',
                'video_en'=>'English video',
                'json_fr'=>'French json',
                'json_en'=>'English json',
                'timestamp'=>'Timestamp',
                'time'=>'Time',
                'timeStart'=>'Start time',
                'timeEnd'=>'End time',
                'dateExpire'=>'Expiration date',
                'dateBirth'=>'Birth date',
                'dateSent'=>'Sent date',
                'excerpt_fr'=>'French excerpt',
                'excerpt_en'=>'English excerpt',
                'info_fr'=>'French info',
                'info_en'=>'English info',
                'role_fr'=>'French role',
                'role_en'=>'English role',
                'fax'=>'Fax',
                'address'=>'Address',
                'color'=>'Color code',
                'attr'=>'Attribute',
                'visible'=>'Visible',
                'author'=>'Author',
                'price'=>'Price',
                'total'=>'Total',
                'host'=>'Host'
            ),
            
            // label
            'label'=>[

                // contact
                'contact'=>[
                    'email'=>'Email',
                    'name'=>'Full name',
                    'phone'=>'Phone number'
                ]
            ]
        ],

        // cms
        '@cms'=>[

            // com
            'com'=>[

                // pos
                'pos'=>[

                    // sessionRole
                    'sessionRole'=>[
                        'submit'=>'Temporary roles have been assigned.',
                        'reset'=>'Temporary roles have been removed.'
                    ]
                ],

                // neg
                'neg'=>[

                    // sessionRole
                    'sessionRole'=>[
                        'failure'=>'Error assigning temporary roles.'
                    ],

                    // user
                    'user'=>[

                        // welcome
                        'welcome'=>[
                            'failure'=>'The welcome email was not sent.'
                        ]
                    ],

                    // duplicate
                    'duplicate'=>[
                        'failure'=>'Duplicate has failed'
                    ],

                    // multiModify
                    'multiModify'=>[
                        'emptyPost'=>'The submitted form was empty.'
                    ]
                ]
            ],

            // popup
            'popup'=>[

                // session
                'session'=>[
                    'permission'=>'Permission',
                    'classSession'=>'Class Session',
                    'classFqcn'=>'Class User',
                    'classRole'=>'Class Role',
                    'fullName'=>'Name',
                    'requestCount'=>'Request count',
                    'ip'=>'Ip',
                    'lang'=>'Language',
                    'name'=>'Cookie name',
                    'getLoginLifetime'=>'Login lifetime',
                    'getLifetime'=>'Cookie lifetime',
                    'expire'=>'Cookie expire',
                    'getCookieParams'=>'Cookie paramters',
                    'getGarbageCollect'=>'Session garbage collect',
                    'userAgent'=>'User agent',
                    'roles'=>'Roles',
                    'fakeRoles'=>'Temporary roles',
                    'primary'=>'Id session'
                ],

                // boot
                'boot'=>[
                    'phpVersion'=>'PHP version',
                    'quidVersion'=>'QuidPHP version',
                    'envLabel'=>'Environment',
                    'typeLabel'=>'Type',
                    'httpProtocol'=>'HTTP protocol',
                    'hostname'=>'Hostname',
                    'ip'=>'Ip',
                    'os'=>'OS',
                    'isCaseSensitive'=>'Case sensitive',
                    'serverType'=>'Server type',
                    'sapi'=>'Sapi',
                    'user'=>'User',
                    'group'=>'Group',
                    'processId'=>'Process ID',
                    'classFqcn'=>'Class Boot',
                    'classRoute'=>'Class Route',
                    'paths'=>'Paths',
                    'schemeHosts'=>'Domains',
                    'memory'=>'Memory',
                    'diskSpace'=>'Disk space',
                    'phpImportantExtension'=>'Important PHP extensions',
                    'phpImportantIni'=>'Important PHP ini',
                    'phpOverview'=>'PHP code (src)',
                    'jsOverview'=>'JS code (src)',
                    'cssOverview'=>'CSS code (src)',
                ],

                // home
                'home'=>[
                    'dbName'=>'Database',
                    'driver'=>'Driver',
                    'serverVersion'=>'Driver version',
                    'host'=>'Host',
                    'username'=>'Username',
                    'charset'=>'Charset',
                    'collation'=>'Collation',
                    'connectionStatus'=>'Connection status',
                    'classFqcn'=>'Class DB',
                    'classSyntax'=>'Class Syntax',
                    'classSchema'=>'Classe Schema',
                    'classTables'=>'Class Tables',
                    'importantVariables'=>'Important variables'
                ],

                // general
                'general'=>[
                    'table'=>'Table',
                    'order'=>'Order',
                    'direction'=>'Direction',
                    'page'=>'Page',
                    'limit'=>'Per page',
                    'filter'=>'Filter',
                    'search'=>'Search',
                    'cols'=>'Column',
                    'in'=>'In',
                    'notIn'=>'Not in',
                    'highlight'=>'Highlight',
                    'engine'=>'Engine',
                    'collation'=>'Collation',
                    'autoIncrement'=>'Auto increment',
                    'updateTime'=>'Last update',
                    'priority'=>'Priority',
                    'sql'=>'Sql query',
                    'primary'=>'Primary key',
                    'classFqcn'=>'Class Table',
                    'classRow'=>'Class Row',
                    'classRows'=>'Class Rows',
                    'classCols'=>'Class Columns',
                    'classCells'=>'Class Cells'
                ],

                // col
                'col'=>[
                    'name'=>'Name',
                    'isRequired'=>'Required',
                    'shouldBeUnique'=>'Unique',
                    'isEditable'=>'Editable',
                    'pattern'=>'Pattern',
                    'preValidate'=>'Pre-validate',
                    'validate'=>'Validate',
                    'compare'=>'Compare',
                    'type'=>'Type',
                    'length'=>'Length',
                    'unsigned'=>'Unsigned',
                    'default'=>'Default',
                    'acceptsNull'=>'Accepts NULL',
                    'collation'=>'Collation',
                    'priority'=>'Priority',
                    'isOrderable'=>'Orderable',
                    'isFilterable'=>'Filterable',
                    'isSearchable'=>'Searchable',
                    'isExportable'=>'Exportable',
                    'isRelation'=>'Relation',
                    'classFqcn'=>'Class Column',
                    'classCell'=>'Class Cell'
                ]
            ],

            // resetPassword
            'resetPassword'=>[
                'info'=>'Enter your email to get a message explaining how to regenerate the password.'
            ],

            // sessionRole
            'sessionRole'=>[
                'title'=>'Temporary roles',
                'info'=>'Use this form to temporarily assign one or more roles to the current session.',
                'submit'=>'Submit',
                'reset'=>'Reset'
            ],

            // accountChangePassword
            'accountChangePassword'=>[
                'link'=>'My password',
                'info'=>'Use this form to change the password for the current account.',
                'submit'=>'Modify'
            ],

            // about
            'about'=>[
                'content'=>'The Lemur open-source Content Management System is based on the [websiteLink] framework. This software is available under the open-source license [licenseLink]. The current version is: [version]. For any questions, please contact the author [authorLink].'
            ],

            // contact
            'contact'=>[
                'info'=>'Use this form to send a message to the administrator: [name] &lt;[email]&gt;.',
                'submit'=>'Send'
            ],

            // relationFeed
            'relationFeed'=>[
                'loadMore'=>'Load [from] to [to] on [total]'
            ],

            // footer
            'footer'=>[
                'link'=>'Link',
                'lang'=>'Language',
                'module'=>'Module',
                'cli'=>'Cli',
                'version'=>'Version [version]'
            ],

            // home
            'home'=>[
                'feed'=>'Recent activities',
                'overview'=>'Overview',
            ],

            // homeFeed
            'homeFeed'=>[
                'all'=>'Everybody',
                'me'=>'Only me'
            ],

            // search
            'search'=>[
                'submit'=>'Search in all tables',
                'in'=>'Search in',
                'note'=>'Note',
                'config'=>'Search insensitive to case and accents, [count] character%s% minimum.',
                'notFound'=>'Rien à afficher'
            ],

            // general
            'general'=>[
                'search'=>'Search',
                'notFound'=>'Nothing',
                'searchIn'=>'Search in',
                'reset'=>'Reset',
                'note'=>'Note',
                'searchNote'=>'Search insensitive to case and accents, [count] character%s% minimum.',
                'add'=>'Add'
            ],

            // export
            'export'=>[
                'long'=>'This export may take more than one minute.',
                'choice'=>'Choose an exportation type',
                'raw'=>'Raw data',
                'format'=>'Formatted data'
            ],

            // specific
            'specific'=>[
                'add'=>'Add',
                'back'=>'Back',
                'view'=>'View',
                'remove'=>'Remove',
                'mediaRegenerate'=>'This media will be regenerated on next modification.',
                'mediaDelete'=>'This media will be deleted on next modification.',
                'relationChilds'=>'[count] direct child%s%',
                'relationChildsNoAccess'=>'Not accessible',
                'modifyTop'=>'Modify',
                'modifyBottom'=>'Modify',
                'activateField'=>'Modify field'
            ],

            // table
            'table'=>[

                // label
                'label'=>[],

                // description
                'description'=>[
                    'contact'=>'Archive messages sent via the contact page form',
                    'email'=>'Email content sent by the app',
                    'lang'=>'All other text content in the application and CMS',
                    'redirection'=>'Specifies the redirection from one URL to another',
                    'log'=>'Log of activities',
                    'logCron'=>'Log of background scripts',
                    'logEmail'=>'Log of emails',
                    'logError'=>'Log of errors',
                    'logHttp'=>'Log of failed HTTP requests',
                    'logSql'=>'Log of SQL queries',
                    'queueEmail'=>'Email waiting to be sent',
                    'session'=>'Active session tracking',
                    'user'=>'Users who can access the application and/or CMS']
            ],

            // col
            'col'=>[

                // label
                'label'=>[

                    // *
                    '*'=>[],

                    // redirection
                    'redirection'=>[
                        'key'=>'From',
                        'value'=>'Tos',
                    ],

                    // session
                    'session'=>[
                        'sid'=>'Sid'
                    ],

                    // logEmail
                    'logEmail'=>[
                        'json'=>'Header'
                    ]
                ],

                // description
                'description'=>[

                    // *
                    '*'=>[
                        'id'=>'Primary and unique key. Required',
                        'context'=>'Defines the context when creating the element, for administrator.',
                        'envType'=>'Defines the environment and type when creating the element, for administrator.',
                        'metaKeywords_fr'=>'Keywords separated by commas, optional field',
                        'metaKeywords_en'=>'Keywords separated by commas, optional field',
                        'metaDescription_fr'=>'No HTML tags, optional field',
                        'metaDescription_en'=>'No HTML tags, optional field',
                        'date'=>'Specifies the date to represent the entry',
                        'datetimeStart'=>'Specifies the start date of the entry',
                        'datetimeEnd'=>'Specifies the end date of the entry',
                        'phone'=>'Phone number with or without extension',
                        'fax'=>'Fax number with or without extension',
                        'address'=>'Complete address',
                        'active'=>'An inactive element is not displayed on the site',
                        'order'=>'Order of the entry relative to others in the same table',
                        'media'=>'Image to represent the entry',
                        'medias'=>'Image(s) to represent the entry',
                        'thumbnail'=>'Image thumbnail to represent the entry',
                        'icon'=>'Icon to represent the entry',
                        'background'=>'Links a background image to the entry',
                        'video'=>'Links a video to the entry',
                        'userAdd'=>'User who added the entry',
                        'dateAdd'=>'Date and time when the entry was added',
                        'userModify'=>'User who made the last change on the entry',
                        'dateModify'=>'Date and time when the last change was made on the entry',
                        'slug'=>'URL slug to represent the entry. Empty the field to regenerate it automaticaly.',
                        'slug_fr'=>'URL slug to represent the entry. Empty the field to regenerate it automaticaly.',
                        'slug_en'=>'URL slug to represent the entry. Empty the field to regenerate it automaticaly.',
                        'slugPath'=>'URL slug path to represent the entry. Empty the field to regenerate it automaticaly.',
                        'slugPath_fr'=>'URL slug path to represent the entry. Empty the field to regenerate it automaticaly.',
                        'slugPath_en'=>'URL slug path to represent the entry. Empty the field to regenerate it automaticaly.',
                        'fragment'=>'URL fragment to represent the entry. Empty the field to regenerate it automaticaly.',
                        'fragment_fr'=>'URL fragment to represent the entry. Empty the field to regenerate it automaticaly.',
                        'fragment_en'=>'URL fragment to represent the entry. Empty the field to regenerate it automaticaly.',
                        'key'=>'Key to represent the entry.',
                        'key_fr'=>'Key to represent the entry.',
                        'key_en'=>'Key to represent the entry.',
                        'name'=>'Name to represent the element',
                        'name_fr'=>'Name to represent the element',
                        'name_en'=>'Name to represent the element',
                        'title_fr'=>'Title to represent the element',
                        'title_en'=>'Title to represent the element',
                        'uri_fr'=>'Uri of the element. Can be a relative or absolute link',
                        'uri_en'=>'Uri of the element. Can be a relative or absolute link',
                        'excerpt_fr'=>'Short summary of the element, about 2-3 sentences, if empty is generated automatically from the content',
                        'excerpt_en'=>'Short summary of the element, about 2-3 sentences, if empty is generated automatically from the content',
                        'content_fr'=>'Main content field of the element. Possible to copy and paste from Microsoft Word. Press shift+enter to create a new line within the same tag.',
                        'content_en'=>'Main content field of the element. Possible to copy and paste from Microsoft Word. Press shift+enter to create a new line within the same tag.',
                        'metaTitle_fr'=>'Meta title for the French page, optional field',
                        'metaTitle_en'=>'Meta title for the English page, optional field',
                        'metaImage_fr'=>'Meta image to represent the French page, optional field',
                        'metaImage_en'=>'Meta image to represent the English page, optional field',
                        'metaSearch_fr'=>'Specifies additional French search terms to find this line. This automatically generates.',
                        'metaSearch_en'=>'Specifies additional English search terms to find this line. This automatically generates.',
                        'user_id'=>'User who created this entry',
                        'session_id'=>'Session of the user who created this entry',
                        'request'=>'Summary of the HTTP request',
                        'userCommit'=>'User of the session',
                        'storage'=>'File to link to the entry.',
                        'storage_fr'=>'File to link to the entry.',
                        'storage_en'=>'File to link to the entry.',
                        'storages'=>'File(s) to link to the entry.',
                        'pointer'=>'Pointer table -> id. Do not modify, for administrator.',
                        'email'=>'Email address of the entry',
                        'color'=>'Specify a color code (Hex)',
                        'menu'=>'Specifies whether the item should appear in the menu',
                        'route'=>'Specify the route to use (for administrator)',
                        'method'=>'Specifies the method to use (for administrator)',
                        'featured'=>'Specifies whether the item should be featured',
                        'website'=>'Web site linked to the element, put the full address',
                        'author'=>'Specifies the author of the element',
                        'price'=>'Specifies the price of the element',
                        'total'=>'Specifies the total of the element',
                        'timezone'=>'Specifies the timezone of the element'
                    ],

                    // lang
                    'lang'=>[
                        'key'=>'Unique key of the text element',
                        'type'=>'The text element is accessible within these types.'
                    ],

                    // redirection
                    'redirection'=>[
                        'key'=>'URL to redirect',
                        'value'=>'Destination of the redirection',
                        'type'=>'The redirection is active within these types.'
                    ],

                    // user
                    'user'=>[
                        'role'=>'Role of the user within the site and CMS',
                        'username'=>'Must be unique and composed of alphanumeric characters',
                        'password'=>'The password must contain a letter, a number and have a length of at least 5 characters',
                        'passwordReset'=>'String for the password reset',
                        'email'=>'Email for the user',
                        'dateLogin'=>'Last login date',
                        'firstName'=>'First name of the user',
                        'lastName'=>'Last name of the user',
                        'fullName'=>'First and last name of the user',
                        'timezone'=>'Timezone of the user, leave empty to use the timezone of the server ([timezone])'
                    ],

                    // session
                    'session'=>[
                        'name'=>'Session and cookie name of the session',
                        'sid'=>'Unique id of the session',
                        'count'=>'Number of requests made with this session',
                        'data'=>'Serialized data of the session',
                        'ip'=>'Ip of the session'
                    ],

                    // email
                    'email'=>[
                        'key'=>'Unique key of the email template',
                        'type'=>'Content-Type to be used, for administrator'
                    ],

                    // log
                    'log'=>[
                        'type'=>'Log type',
                        'json'=>'Log data'
                    ],

                    // logSql
                    'logSql'=>[
                        'type'=>'Type of sql query',
                        'json'=>'SQL data - for administrator'
                    ],

                    // logCron
                    'logCron'=>[
                        'key'=>'Key of cron',
                        'json'=>'CRON script data - for administrator'
                    ],

                    // logError
                    'logError'=>[
                        'type'=>'Type of error',
                        'json'=>'Data and backtrace of the error - for administrator'
                    ],

                    // logEmail
                    'logEmail'=>[
                        'status'=>'Email sending status',
                        'email_id'=>'Link to the email template used',
                        'json'=>'Email header data',
                        'content'=>'Content of the email'
                    ],

                    // contact
                    'contact'=>[
                        'message'=>'Content of the message'
                    ]
                ]
            ],

            // panel
            'panel'=>[

                // label
                'label'=>[
                    'default'=>'Default',
                    'fr'=>'French',
                    'en'=>'English',
                    'relation'=>'Relation',
                    'media'=>'Media',
                    'profile'=>'Profile',
                    'admin'=>'Administrator',
                    'localization'=>'Localisation',
                    'contact'=>'Contact',
                    'template'=>'Template',
                    'visibility'=>'Visibility',
                    'meta'=>'Meta',
                    'param'=>'Parameters'
                ],

                // description
                'description'=>[
                    'default'=>'This panel contains the default fields, which do not have a specific panel assigned.',
                    'fr'=>'This panel contains the French language fields.',
                    'en'=>'This panel contains the English language fields.',
                    'relation'=>'This panel contains the fields that have relationships with other tables.',
                    'media'=>'This panel contains fields that contain files and media.',
                    'admin'=>'This panel contains advanced fields for administrator.',
                    'profile'=>'This panel contains the fields related to a user profile.',
                    'localization'=>'This panel contains fields related to geolocation.',
                    'contact'=>'This panel contains contact fields.',
                    'template'=>'This panel contains the fields related to the layout.',
                    'visibility'=>'This panel contains the fields related to the visibility of the element.',
                    'meta'=>'This panel contains fields related to the metadata of the line',
                    'param'=>'This panel contains fields related to the parameters of the line'
                ]
            ],

            // route
            'route'=>[

                // label
                'label'=>[
                    'about'=>'About',
                    'calendar'=>'Calendar',
                    'download'=>'Download',
                    'export'=>'Export',
                    'exportDownload'=>'Export - Download',
                    'homeFeed'=>'Home - Feed',
                    'general'=>'General',
                    'generalDelete'=>'General - Delete',
                    'generalEdit'=>'General - Quick Edit',
                    'generalEditSubmit'=>'General - Quick Edit - Submit',
                    'generalRelation'=>'General - Relation',
                    'generalTruncate'=>'Empty the table',
                    'popupBoot'=>'Popup - Boot',
                    'popupSession'=>'Popup - Session',
                    'search'=>'Search',
                    'sessionRole'=>'Role',
                    'sessionRoleSubmit'=>'Role - Submit',
                    'specific'=>'Specific',
                    'specificAdd'=>'Specific - Add',
                    'specificAddSubmit'=>'Specific - Add - Submit',
                    'specificDelete'=>'Specific - Delete',
                    'specificDispatch'=>'Specific - Dispatch',
                    'specificDuplicate'=>'Dupliquer',
                    'specificMulti'=>'Specific - Multiple',
                    'specificMultiSubmit'=>'Specific - Multiple - Submit',
                    'specificRelation'=>'Specific - Relation',
                    'specificSubmit'=>'Specific - Submit',
                    'tableRelation'=>'Table Relation',
                    'userWelcome'=>'Welcome'
                ],

                // description
                'description'=>[]
            ]
        ]
    ];
}

// init
En::__init();
?>