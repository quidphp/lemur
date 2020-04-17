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

// fr
// french language content used by this namespace
class Fr extends Core\Lang\Fr
{
    // config
    public static $config = [

        // login
        'login'=>[
            'usernameEmail'=>"Nom d'utilisateur ou courriel",
            'remember'=>'Se souvenir de moi?'
        ],

        // resetPassword
        'resetPassword'=>[
            'forgot'=>'Mot de passe oublié ?',
            'submit'=>'Soumettre'
        ],

        // register
        'register'=>[
            'confirmPassword'=>'Confirmation du mot de passe'
        ],

        // accountChangePassword
        'accountChangePassword'=>[
            'oldPassword'=>'Mot de passe actuel',
            'newPassword'=>'Nouveau mot de passe',
            'newPasswordConfirm'=>'Confirmation du nouveau mot de passe',
            'submit'=>'Modifier mon mot de passe'
        ],

        // relationOrder
        'relationOrder'=>[
            'key'=>[
                1=>'Plus ancien en premier',
                2=>'Plus récent en premier',
            ],

            'value'=>[
                3=>'Ordre alphabétique',
                4=>'Ordre alphabétique inversé'
            ]
        ],

        // com
        'com'=>[

            // neg
            'neg'=>[

                // insert
                'insert'=>[
                    'contact'=>[
                        'failure'=>"Erreur lors de l'envoie du message."
                    ]
                ]
            ],

            // pos
            'pos'=>[

                // slug
                'slug'=>[
                    'updated'=>'[count] autre%s% ligne%s% mise%s% à jour'
                ],

                // user
                'user'=>[

                    // welcome
                    'welcome'=>[
                        'success'=>'Le courriel de bienvenue a été envoyé.'
                    ],
                ],

                // duplicate
                'duplicate'=>[
                    'success'=>'La duplication a réussie'
                ],

                // insert
                'insert'=>[
                    'contact'=>[
                        'success'=>'Merci, le message a été envoyé !'
                    ]
                ]
            ]
        ],

        // role
        'role'=>[

            // label
            'label'=>[
                50=>'Contributeur',
                60=>'Éditeur',
                70=>'Sous-administrateur'
            ]
        ],

        // relation
        'relation'=>[

            // contextType
            'contextType'=>[
                'cms'=>'Gestionnaire de contenu'
            ]
        ],

        // browscap
        'browscap'=>[
            'noscript'=>'JavaScript est désactivé sur votre navigateur.',
            'cookie'=>"Votre navigateur n'accepte pas les cookies.",
            'unsupported'=>"Votre navigateur n'est pas supporté."
        ],

        // route
        'route'=>[

            // label
            'label'=>[
                'account'=>'Mon compte',
                'accountSubmit'=>'Mon compte - Soumettre',
                'accountChangePassword'=>'Changer mon mot de passe',
                'accountChangePasswordSubmit'=>'Changer mon mot de passe - Soumettre',
                'activatePassword'=>'Activer le mot de passe',
                'contact'=>'Contact',
                'contactSubmit'=>'Contact - Soumettre',
                'login'=>'Connexion',
                'loginSubmit'=>'Connexion - Soumettre',
                'logout'=>'Déconnexion',
                'register'=>'Enregistrement',
                'registerSubmit'=>'Enregistrement - Soumettre',
                'resetPassword'=>'Régénérer un nouveau mot de passe',
                'resetPasswordSubmit'=>'Régénérer un nouveau mot de passe - Soumettre'
            ]
        ],

        // table
        'table'=>[

            // label
            'label'=>[
                'contact'=>'Contact',
                'admin'=>'Administration'
            ]
        ],

        // col
        'col'=>[

            // label
            'label'=>[

                // *
                '*'=>[
                    'featured'=>'En vedette',
                    'category'=>'Catégorie',
                    'lang'=>'Langue',
                    'index'=>'index',
                    'subject'=>'Sujet',
                    'message'=>'Message',
                    'method'=>'Méthode',
                    'option'=>'Option',
                    'menu'=>'Dans le menu',
                    'priority'=>'Priorité',
                    'body'=>'Corps',
                    'header'=>'En-tête',
                    'phone'=>'Téléphone',
                    'company'=>'Compagnie',
                    'amount'=>'Montant',
                    'year'=>'Année',
                    'month'=>'Mois',
                    'day'=>'Jour',
                    'url'=>'Url',
                    'uri'=>'Uri',
                    'thumbnail'=>'Miniature',
                    'media_fr'=>'Média français',
                    'media_en'=>'Média anglais',
                    'video'=>'Vidéo',
                    'icon'=>'Icône',
                    'icons'=>'Icônes',
                    'storage_fr'=>'Fichier français',
                    'storage_en'=>'Fichier anglais',
                    'background'=>'Arrière-plan',
                    'title'=>'Titre',
                    'firstName'=>'Prénom',
                    'lastName'=>'Nom de famille',
                    'fullName'=>'Nom complet',
                    'country'=>'Pays',
                    'state'=>'État',
                    'province'=>'Province',
                    'city'=>'Ville',
                    'zipCode'=>'Zip code',
                    'postalCode'=>'Code postal',
                    'key_fr'=>'Clé française',
                    'key_en'=>'Clé anglaise',
                    'slug'=>'Slug',
                    'slug_fr'=>'Slug français',
                    'slug_en'=>'Slug anglais',
                    'slugPath'=>'Slug-chemin',
                    'slugPath_fr'=>'Slug-chemin français',
                    'slugPath_en'=>'Slug-chemin anglais',
                    'fragment'=>'Fragment',
                    'fragment_fr'=>'Fragment français',
                    'fragment_en'=>'Fragment anglais',
                    'name_fr'=>'Nom français',
                    'name_en'=>'Nom anglais',
                    'title_fr'=>'Titre français',
                    'title_en'=>'Titre anglais',
                    'content_fr'=>'Contenu français',
                    'content_en'=>'Contenu anglais',
                    'uri_fr'=>'Uri française',
                    'uri_en'=>'Uri anglaise',
                    'metaTitle_fr'=>'Meta titre français',
                    'metaTitle_en'=>'Meta titre anglais',
                    'metaDescription_fr'=>'Meta description française',
                    'metaDescription_en'=>'Meta description anglaise',
                    'metaKeywords_fr'=>'Meta mots clefs français',
                    'metaKeywords_en'=>'Meta mots clefs anglais',
                    'metaImage_fr'=>'Meta image français',
                    'metaImage_en'=>'Meta image anglais',
                    'metaSearch_fr'=>'Meta recherche français',
                    'metaSearch_en'=>'Meta recherche anglais',
                    'media_fr'=>'Média français',
                    'media_en'=>'Média anglais',
                    'video_fr'=>'Vidéo français',
                    'video_en'=>'Vidéo anglais',
                    'json_fr'=>'Json français',
                    'json_en'=>'Json anglais',
                    'timestamp'=>'Code temps',
                    'dateBirth'=>'Date de naissance',
                    'dateSent'=>"Date d'envoie",
                    'dateExpire'=>"Date d'expiration",
                    'time'=>'Heure',
                    'timeStart'=>'Heure de début',
                    'timeEnd'=>'Heure de fin',
                    'excerpt_fr'=>'Résumé français',
                    'excerpt_en'=>'Résumé anglais',
                    'info_fr'=>'Information française',
                    'info_en'=>'Information anglaise',
                    'role_fr'=>'Rôle français',
                    'role_en'=>'Rôle anglais',
                    'fax'=>'Fax',
                    'address'=>'Adresse',
                    'color'=>'Code couleur',
                    'attr'=>'Attribut',
                    'visible'=>'Visible',
                    'author'=>'Auteur',
                    'price'=>'Prix',
                    'percent'=>'Pourcentage',
                    'total'=>'Total',
                    'host'=>'Hôte',
                    'quantity'=>'Quantité',
                    'gender'=>'Gendre'
                ],

                // contact
                'contact'=>[
                    'email'=>'Adresse courriel',
                    'name'=>'Prénom et nom',
                    'phone'=>'Numéro de téléphone'
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
                        'submit'=>'Les rôles temporaires ont été attribués.',
                        'reset'=>'Les rôles temporaires ont été retirés.'
                    ]
                ],

                // neg
                'neg'=>[

                    // sessionRole
                    'sessionRole'=>[
                        'failure'=>"Erreur lors de l'attribution des rôles temporaires."
                    ],

                    // user
                    'user'=>[

                        // welcome
                        'welcome'=>[
                            'failure'=>"Le courriel de bienvenue n'a pas pu être envoyé."
                        ]
                    ],

                    // duplicate
                    'duplicate'=>[
                        'failure'=>'La duplication a échouée'
                    ],

                    // multiModify
                    'multiModify'=>[
                        'emptyPost'=>'Le formulaire soumis est vide.'
                    ]
                ]
            ],

            // tinymce
            'tinymce'=>[
                'paragraph'=>'Paragraphe',
                'superscript'=>'Exposant',
                'header1'=>'En-tête 1',
                'header2'=>'En-tête 2',
                'header3'=>'En-tête 3',
                'header4'=>'En-tête 4',
                'header5'=>'En-tête 5',
                'header6'=>'En-tête 6',
                'alignLeft'=>'Aligner à gauche',
                'alignCenter'=>'Aligner au centre',
                'alignRight'=>'Aligner à droite',
                'floatLeft'=>'Flotter à gauche',
                'floatRight'=>'Flotter à droite'
            ],

            // tooltip
            'tooltip'=>[
                'rememberMe'=>"Se souvenir du nom d'utilisateur après la déconnexion",
                'colsSorter'=>'Gestion des colonnes à afficher',
                'filterIn'=>'Conserver les lignes cochés',
                'filterOut'=>'Retirer les lignes cochés',
                'multiModify'=>'Modifier toutes les lignes cochées',
                'multiDelete'=>'Effacer toutes les lignes cochées',
                'mediaRegenerate'=>'Regénérer les versions de cette image',
                'mediaDelete'=>'Effacer ce média'
            ],

            // popup
            'popup'=>[

                // session
                'session'=>[
                    'rolePermission'=>'Rôle',
                    'classSession'=>'Classe Session',
                    'classFqcn'=>'Classe Utilisateur',
                    'classRole'=>'Classe Rôle',
                    'fullName'=>'Nom',
                    'requestCount'=>'Nombre de requête',
                    'ip'=>'Ip',
                    'lang'=>'Langue',
                    'name'=>'Nom du cookie',
                    'getLoginLifetime'=>'Durée de la connexion',
                    'getLifetime'=>'Durée de vie du cookie',
                    'expire'=>'Expiration du cookie',
                    'getCookieParams'=>'Paramètres du cookie',
                    'getGarbageCollect'=>'Nettoyage des sessions',
                    'userAgent'=>'Agent utilisateur',
                    'roles'=>'Rôles',
                    'fakeRoles'=>'Rôles temporaires',
                    'primary'=>'Id session'
                ],

                // boot
                'boot'=>[
                    'phpVersion'=>'Version PHP',
                    'quidVersion'=>'Version QuidPHP',
                    'envLabel'=>'Environnement',
                    'typeLabel'=>'Type',
                    'httpProtocol'=>'Protocole HTTP',
                    'hostname'=>"Nom d'hôte",
                    'ip'=>'Ip',
                    'os'=>'OS',
                    'isCaseSensitive'=>'Sensible à la case',
                    'serverType'=>'Type de serveur',
                    'sapi'=>'Sapi',
                    'user'=>'Utilisateur',
                    'group'=>'Groupe',
                    'processId'=>'Identifiant de processus',
                    'classFqcn'=>'Classe Boot',
                    'classRoute'=>'Classe Route',
                    'paths'=>'Chemins',
                    'schemeHosts'=>'Domaines',
                    'memory'=>'Mémoire vive',
                    'diskSpace'=>'Espace disque',
                    'phpImportantExtension'=>'Extensions PHP importantes',
                    'phpImportantIni'=>'Ini PHP importantes',
                    'phpOverview'=>'Code PHP (src)',
                    'jsOverview'=>'Code JS (src)',
                    'cssOverview'=>'Code CSS (src)',
                ],

                // home
                'home'=>[
                    'dbName'=>'Base de données',
                    'driver'=>'Connecteur',
                    'serverVersion'=>'Version du connecteur',
                    'host'=>'Hôte',
                    'username'=>"Nom d'utilisateur",
                    'charset'=>'Encodage',
                    'collation'=>'Collation',
                    'connectionStatus'=>'Connexion',
                    'classFqcn'=>'Classe DB',
                    'classSyntax'=>'Classe Syntaxe',
                    'classSchema'=>'Classe Schéma',
                    'classTables'=>'Classe Tables',
                    'importantVariables'=>'Variables importantes'
                ],

                // general
                'general'=>[
                    'primary'=>'Clé primaire',
                    'table'=>'Table',
                    'order'=>'Ordre',
                    'direction'=>'Direction',
                    'page'=>'Page',
                    'limit'=>'Par page',
                    'filter'=>'Filtre',
                    'search'=>'Recherche',
                    'cols'=>'Colonne',
                    'in'=>'Dans',
                    'notIn'=>'Pas dans',
                    'highlight'=>'Surligné',
                    'engine'=>'Engin',
                    'collation'=>'Collation',
                    'autoIncrement'=>'Auto incrément',
                    'updateTime'=>'Dernière modification',
                    'priority'=>'Priorité',
                    'sql'=>'Requête Sql',
                    'classFqcn'=>'Classe Table',
                    'classRow'=>'Classe Ligne',
                    'classRows'=>'Classe Lignes',
                    'classCols'=>'Classe Colonnes',
                    'classCells'=>'Classe Cellules'
                ],

                // col
                'col'=>[
                    'name'=>'Nom',
                    'isRequired'=>'Requis',
                    'shouldBeUnique'=>'Unique',
                    'isEditable'=>'Modifiable',
                    'pattern'=>'Modèle',
                    'preValidate'=>'Pré-validation',
                    'validate'=>'Validation',
                    'compare'=>'Comparaison',
                    'type'=>'Type',
                    'length'=>'Longueur',
                    'unsigned'=>'Non signé',
                    'default'=>'Défaut',
                    'acceptsNull'=>'Accepte NULL',
                    'collation'=>'Collation',
                    'priority'=>'Priorité',
                    'isOrderable'=>'Ordonnable',
                    'isFilterable'=>'Filtrable',
                    'isSearchable'=>'Cherchable',
                    'isExportable'=>'Exportable',
                    'isRelation'=>'Relation',
                    'classFqcn'=>'Classe Colonne',
                    'classCell'=>'Classe Cellule'
                ]
            ],

            // resetPassword
            'resetPassword'=>[
                'info'=>'Entrer votre courriel pour obtenir un message indiquant la marche à suivre pour regénérer le mot de passe.'
            ],

            // sessionRole
            'sessionRole'=>[
                'title'=>'Rôles temporaires',
                'info'=>'Utilisez ce formulaire pour attribuer de façon temporaire à la session courante un ou plusieurs rôles.',
                'submit'=>'Soumettre',
                'reset'=>'Réinitialiser'
            ],

            // accountChangePassword
            'accountChangePassword'=>[
                'link'=>'Mot de passe',
                'info'=>'Utilisez ce formulaire pour changer le mot de passe du compte courant.',
                'submit'=>'Modifier'
            ],

            // about
            'about'=>[
                'content'=>"Le gestionnaire de contenu Lemur est développé sur le framework [websiteLink]. Ce logiciel est disponible via la license open-source [licenseLink]. La version actuelle est [version]. Pour toute question, contactez l'auteur [authorLink]."
            ],

            // contact
            'contact'=>[
                'info'=>"Utilisez ce formulaire pour envoyer un message à l'administrateur: [name] &lt;[email]&gt;.",
                'submit'=>'Envoyer'
            ],

            // email
            'email'=>[
                'send'=>'Envoyer'
            ],

            // relationFeed
            'relationFeed'=>[
                'loadMore'=>'Charger de [from] à [to] sur [total]'
            ],

            // footer
            'footer'=>[
                'backToTop'=>'Retour vers le haut',
                'link'=>'Lien',
                'lang'=>'Langue',
                'module'=>'Module',
                'cli'=>'Cli',
                'version'=>'Version [version]'
            ],

            // home
            'home'=>[
                'feed'=>'Dernières activitées',
                'overview'=>'Survol'
            ],

            // homeFeed
            'homeFeed'=>[
                'all'=>'Tous',
                'me'=>'Seulement moi'
            ],

            // search
            'search'=>[
                'submit'=>'Recherche dans toutes les tables',
                'in'=>'Recherche dans',
                'note'=>'Note',
                'config'=>'Recherche insensible à la case et aux accents, [count] caractère%s% minimum.',
                'notFound'=>'Rien à afficher'
            ],

            // general
            'general'=>[
                'search'=>'Recherche',
                'notFound'=>'Rien à afficher',
                'searchIn'=>'Recherche dans',
                'reset'=>'Réinitialiser',
                'note'=>'Note',
                'searchNote'=>'Recherche insensible à la case et aux accents, [count] caractère%s% minimum.',
                'add'=>'Ajouter'
            ],

            // export
            'export'=>[
                'long'=>"Cette exportation peut prendre plus d'une minute.",
                'choice'=>"Choisir un type d'exportation",
                'raw'=>'Données brutes',
                'format'=>'Données formatées'
            ],

            // specific
            'specific'=>[
                'add'=>'Ajout',
                'back'=>'Retour',
                'view'=>'Voir',
                'remove'=>'Supprimer',
                'mediaRegenerate'=>'Ce média sera regénéré lors de la prochaine modification.',
                'mediaDelete'=>'Ce média sera effacé lors de la prochaine modification.',
                'relationChilds'=>'[count] enfant%s% direct%s%',
                'relationChildsNoAccess'=>'Inaccessible',
                'modifyTop'=>'Modifier',
                'modifyBottom'=>'Modifier',
                'activateField'=>'Modifier le champ'
            ],

            // rangeInput
            'rangeInput'=>[
                'min'=>'Minimum',
                'max'=>'Maximum',
                'inc'=>'Incrémentation'
            ],

            // table
            'table'=>[

                // label
                'label'=>[],

                // description
                'description'=>[
                    'contact'=>'Messages envoyés via les formulaire de contact',
                    'email'=>"Contenu relatif aux courriels envoyés par l'application",
                    'lang'=>"Tous les autres contenus textes présents dans l'application et le CMS",
                    'redirection'=>"Spécifie les redirections d'une URL à une autre",
                    'log'=>'Log des activités',
                    'logCron'=>"Log des scripts d'arrière-plan",
                    'logEmail'=>'Log des envoies courriel',
                    'logError'=>'Log des erreurs',
                    'logHttp'=>'Log des requêtes HTTP échouées',
                    'logSql'=>'Log des requêtes SQL',
                    'queueEmail'=>"Email en attente d'envoi",
                    'session'=>'Suivi des sessions actives',
                    'user'=>"Utilisateurs pouvant accéder à l'application et/ou au CMS"]
            ],

            // validate
            'validate'=>[
                'integerRange'=>"Doit être inclu dans l'intervalle définie",
                'range'=>'Doit être une intervalle valide',
            ],

            // col
            'col'=>[

                // label
                'label'=>[

                    // *
                    '*'=>[],

                    // redirection
                    'redirection'=>[
                        'key'=>'De',
                        'value'=>'Vers',
                    ],

                    // session
                    'session'=>[
                        'sid'=>'Sid'
                    ],

                    // logEmail
                    'logEmail'=>[
                        'json'=>'En-tête'
                    ]
                ],

                // description
                'description'=>[

                    // *
                    '*'=>[
                        'id'=>'Clé primaire et unique. Obligatoire',
                        'context'=>"Défini le contexte lors de la création de l'élément, pour administrateur.",
                        'envType'=>"Défini l'environnement et le type lors de la création de l'élément, pour administrateur.",
                        'metaKeywords_fr'=>'Mots clefs séparés par des virgules, champ facultatif',
                        'metaKeywords_en'=>'Mots clefs séparés par des virgules, champ facultatif',
                        'metaDescription_fr'=>'Aucune balise HTML, champ facultatif',
                        'metaDescription_en'=>'Aucune balise HTML, champ facultatif',
                        'date'=>"Spécifie la date pour représenter l'élément",
                        'datetime'=>"Spécifie la date et l'heure pour représenter l'élément",
                        'datetimeStart'=>"Spécifie la date et l'heure de début de l'élément",
                        'datetimeEnd'=>"Spécifie la date et l'heure de fin de l'élément",
                        'phone'=>'Numéro de téléphone avec ou sans extension',
                        'fax'=>'Numéro de fax avec ou sans extension',
                        'address'=>'Adresse complête',
                        'active'=>"Défini si l'élément est actif et doit s'afficher",
                        'order'=>"Permet d'ordonner l'élément par rapport aux autres de la même table",
                        'media'=>"Image pour représenter l'élément",
                        'medias'=>"Image(s) pour représenter l'élément",
                        'thumbnail'=>"Image miniature pour représenter l'élément",
                        'icon'=>"Icône pour représenter l'élément",
                        'background'=>"Lie une image d'arrière-plan à l'élément",
                        'video'=>"Lie une vidéo au à l'élément",
                        'userAdd'=>"Utilisateur qui a ajouté l'élément",
                        'dateAdd'=>"Date et heure de l'ajout de l'élément",
                        'userModify'=>"Utilisateur qui a fait la dernière modification sur l'élément",
                        'dateModify'=>"Date et heure de la dernière modification sur l'élément",
                        'slug'=>"Slug URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'slug_fr'=>"Slug URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'slug_en'=>"Slug URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'slugPath'=>"Slug-chemin URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'slugPath_fr'=>"Slug-chemin URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'slugPath_en'=>"Slug-chemin URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'fragment'=>"Fragment URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'fragment_fr'=>"Fragment URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'fragment_en'=>"Fragment URL pour représenter l'élément. Vider le champ pour le regénérer automatiquement.",
                        'key'=>"Clé pour représenter l'élément.",
                        'key_fr'=>"Clé pour représenter l'élément.",
                        'key_en'=>"Clé pour représenter l'élément.",
                        'name'=>"Nom pour représenter l'élément",
                        'name_fr'=>"Nom pour représenter l'élément",
                        'name_en'=>"Nom pour représenter l'élément",
                        'title_fr'=>"Titre pour représenter l'élément",
                        'title_en'=>"Titre pour représenter l'élément",
                        'uri_fr'=>"Uri de l'élément.",
                        'uri_en'=>"Uri de l'élément.",
                        'excerpt_fr'=>"Court résumé de l'élément, environ 2-3 phrases. Si vide se génère automatiquement à partir du contenu",
                        'excerpt_en'=>"Court résumé de l'élément, environ 2-3 phrases. Si vide se génère automatiquement à partir du contenu",
                        'content_fr'=>"Contenu principal de l'élément.",
                        'content_en'=>"Contenu principal de l'élément.",
                        'metaTitle_fr'=>'Meta titre pour la page française, champ facultatif',
                        'metaTitle_en'=>'Meta titre pour la page anglaise, champ facultatif',
                        'metaImage_fr'=>'Meta image pour représenter la page française, champ facultatif',
                        'metaImage_en'=>'Meta image pour représenter la page anglaise, champ facultatif',
                        'metaSearch_fr'=>'Spécifie des termes de recherches français additionnels pour trouver cette ligne. Ce génère automatiquement.',
                        'metaSearch_en'=>'Spécifie des termes de recherches anglais additionnels pour trouver cette ligne. Ce génère automatiquement.',
                        'user_id'=>"Utilisateur en lien avec l'élément",
                        'session_id'=>"Session de l'utilisateur qui a créé l'élément. Pour administrateur",
                        'request'=>'Résumé de la requête HTTP',
                        'userCommit'=>"Utilisateur de la session de l'utilisateur.",
                        'storage'=>"Fichier à lier à l'élément.",
                        'storage_fr'=>"Fichier à lier à l'élément.",
                        'storage_en'=>"Fichier à lier à l'élément.",
                        'storages'=>"Fichiers(s) à lier à l'élément",
                        'pointer'=>'Pointeur table -> id. Ne pas modifier, pour administrateur.',
                        'email'=>"Adresse courriel de l'élément",
                        'color'=>'Spécifier un code couleur (Hex)',
                        'menu'=>"Spécifie si l'élément doit s'afficher dans le menu",
                        'route'=>'Spécifie la route à utiliser (pour administrateur)',
                        'method'=>'Spécifie la méthode à utiliser (pour administrateur)',
                        'featured'=>"Spécifie si l'élément doit être placé à la une",
                        'website'=>"Site web en lien avec l'élément, mettre l'adresse complête",
                        'author'=>"Spécifie l'auteur de l'élément",
                        'price'=>"Spécifie le prix de l'élément",
                        'percent'=>"Spécifie le pourcentage de l'élément",
                        'total'=>"Spécifie le total de l'élément",
                        'timezone'=>"Spécifie le fuseau horaire de l'élément",
                        'quantity'=>"Spécifie la quantité de l'élément",
                        'gender'=>'Spécifie le gendre',
                    ],

                    // lang
                    'lang'=>[
                        'key'=>"Clé unique de l'élément texte. Pour administrateur",
                        'type'=>"L'élément texte est accessible dans ces types. Pour administrateur"
                    ],

                    // redirection
                    'redirection'=>[
                        'key'=>'URL à rediriger',
                        'value'=>'Destination de la redirection',
                        'type'=>'La redirection est active dans ces types.'
                    ],

                    // user
                    'user'=>[
                        'role'=>"Rôle de l'utilisateur au sein du site et du CMS",
                        'username'=>'Doit être unique et composé de caractère alphanumérique',
                        'password'=>"Le mot de passe doit contenir une lettre, un chiffre et avoir une longueur d'au moins 5 caractères",
                        'passwordReset'=>'Chaîne pour la réinitialisation du mot de passe',
                        'email'=>"Courriel de l'utilisateur",
                        'dateLogin'=>'Date de la dernière connexion',
                        'firstName'=>"Prénom de l'utilisateur",
                        'lastName'=>"Nom de famille de l'utilisateur",
                        'fullName'=>"Prénom et nom de famille de l'utilisateur",
                        'timezone'=>"Fuseau horaire de l'utilisateur, laisser vide pour utiliser le fuseau horaire du serveur ([timezone])"
                    ],

                    // session
                    'session'=>[
                        'name'=>'Nom de la session et du cookie de la session',
                        'sid'=>'Id unique de la session',
                        'count'=>'Nombre de requêtes effectués avec cette session',
                        'data'=>'Données serializés de la session',
                        'ip'=>'Ip de cette session'
                    ],

                    // email
                    'email'=>[
                        'key'=>'Clé unique du modèle de courriel. Pour administrateur',
                        'type'=>"Content-Type utilisé lors de l'envoie. Pour administrateur"
                    ],

                    // log
                    'log'=>[
                        'type'=>'Type du log',
                        'json'=>'Données du log'
                    ],

                    // logSql
                    'logSql'=>[
                        'type'=>'Type de la requête',
                        'json'=>'Données SQL - pour administrateur'
                    ],

                    // logCron
                    'logCron'=>[
                        'key'=>'Clé du cron',
                        'json'=>'Données du script CRON  - pour administrateur'
                    ],

                    // logError
                    'logError'=>[
                        'type'=>"Type d'erreur",
                        'json'=>"Données et backtrace de l'erreur - pour administrateur"
                    ],

                    // logEmail
                    'logEmail'=>[
                        'status'=>"Statut de l'envoie courriel",
                        'email_id'=>'Lien vers le modèle courriel utilisé',
                        'json'=>"Données d'en-tête de l'envoie courriel",
                        'content'=>'Contenu du courriel'
                    ],

                    // contact
                    'contact'=>[
                        'message'=>'Contenu du message'
                    ]
                ]
            ],

            // panel
            'panel'=>[

                // label
                'label'=>[
                    'default'=>'Général',
                    'fr'=>'Français',
                    'en'=>'Anglais',
                    'relation'=>'Relation',
                    'media'=>'Multimédia',
                    'profile'=>'Profil',
                    'admin'=>'Administrateur',
                    'localization'=>'Localisation',
                    'contact'=>'Contact',
                    'template'=>'Mise en page',
                    'visibility'=>'Visibilité',
                    'meta'=>'Meta',
                    'param'=>'Paramètres'
                ],

                // description
                'description'=>[
                    'default'=>"Ce panneau contient les champs par défaut, qui n'ont pas de panneau spécifique attribué.",
                    'fr'=>'Ce panneau contient les champs de langue française.',
                    'en'=>'Ce panneau contient les champs de langue anglaise.',
                    'relation'=>"Ce panneau contient les champs qui entretiennent des relations avec d'autres tables.",
                    'media'=>'Ce panneau contient les champs qui contiennent des fichiers et des médias.',
                    'admin'=>'Ce panneau contient les champs avancés pour administrateur.',
                    'profile'=>"Ce panneau contient les champs en lien avec un profil d'utilisateur.",
                    'localization'=>'Ce panneau contient les champs en lien avec la géo-localisation.',
                    'contact'=>'Ce panneau contient les champs de contact.',
                    'template'=>'Ce panneau contient les champs en lien avec la mise en page.',
                    'visibility'=>"Ce panneau contient les champs en lien avec la visibilité de l'élément.",
                    'meta'=>'Ce panneau contient des champs en lien avec les méta-données de la ligne',
                    'param'=>'Ce panneau contient des champs en lien avec les paramètres de la ligne'
                ]
            ],

            // route
            'route'=>[

                // label
                'label'=>[
                    'about'=>'À propos',
                    'calendar'=>'Calendrier',
                    'download'=>'Téléchargement',
                    'email'=>'Envoyer un courriel à',
                    'export'=>'Exportation',
                    'exportDownload'=>'Exportation - Téléchargement',
                    'homeFeed'=>'Accueil - Flux',
                    'general'=>'Général',
                    'generalDelete'=>'Général - Suppression',
                    'generalEdit'=>'General - Édition rapide',
                    'generalEditSubmit'=>'General - Édition rapide - Soumettre',
                    'generalRelation'=>'Général - Relation',
                    'generalTruncate'=>'Vider la table',
                    'popupBoot'=>'Popup - Boot',
                    'popupSession'=>'Popup - Session',
                    'search'=>'Recherche',
                    'sessionRole'=>'Rôle',
                    'sessionRoleSubmit'=>'Rôle - Soumettre',
                    'specific'=>'Spécifique',
                    'specificAdd'=>'Spécifique - Ajout',
                    'specificAddSubmit'=>'Spécifique - Ajout - Soumettre',
                    'specificDelete'=>'Spécifique - Suppression',
                    'specificDispatch'=>'Spécifique - Envoi',
                    'specificDuplicate'=>'Dupliquer',
                    'specificMulti'=>'Spécifique - Multiple',
                    'specificMultiSubmit'=>'Spécifique - Multiple - Soumettre',
                    'specificRelation'=>'Spécifique - Relation',
                    'specificSubmit'=>'Spécifique - Soumettre',
                    'tableRelation'=>'Relation de table',
                    'userWelcome'=>'Bienvenue'
                ],

                // description
                'description'=>[]
            ]
        ]
    ];
}

// init
Fr::__init();
?>