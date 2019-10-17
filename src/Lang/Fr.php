<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Lang;
use Quid\Core;

// fr
// french language content used by this namespace
class Fr extends Core\Lang\Fr
{
    // config
    public static $config = [

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

        // cms
        '@cms'=>[
            
            // popup
            'popup'=>array(
                
                // user
                'user'=>array(
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
                    'userAgent'=>'Agent utilisateur'
                ),
                
                // boot
                'boot'=>array(
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
                    'paths'=>'Chemins',
                    'schemeHosts'=>'Domaines',
                    'memory'=>'Mémoire vive',
                    'diskSpace'=>'Espace disque',
                    'phpImportantExtension'=>'Extensions PHP importantes',
                    'phpImportantIni'=>'Ini PHP importantes'
                ),
                
                // home
                'home'=>array(
                    'dbName'=>'Base de données',
                    'driver'=>'Connecteur',
                    'serverVersion'=>'Version du connecteur',
                    'host'=>'Hôte',
                    'username'=>"Nom d'utilisateur",
                    'charset'=>'Encodage',
                    'collation'=>'Collation',
                    'connectionStatus'=>'Connexion',
                    'classFqcn'=>'Classe DB',
                    'classTables'=>'Classe Tables',
                    'importantVariables'=>'Variables importantes'
                ),
                
                // general
                'general'=>array(
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
                ),
                
                // col
                'col'=>array(
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
                )
            ),
            
            // resetPassword
            'resetPassword'=>[
                'info'=>'Entrer votre courriel pour obtenir un message indiquant la marche à suivre pour regénérer le mot de passe.'
            ],

            // accountChangePassword
            'accountChangePassword'=>[
                'link'=>'Mot de passe',
                'info'=>'Utilisez ce formulaire pour changer le mot de passe du compte courant.',
                'submit'=>'Modifier'
            ],

            // author
            'author'=>[
                'name'=>'QuidPHP',
                'uri'=>'https://quidphp.com',
                'email'=>'emondpph@gmail.com'
            ],

            // about
            'about'=>[
                'content'=>'Le gestionnaire de contenu open-source Lemur est développé sur le framework QuidPHP. La version actuelle est [version].'
            ],

            // footer
            'footer'=>[
                'copyright'=>'Version [version]'
            ],

            // home
            'home'=>[
                'searchSubmit'=>'Recherche dans toutes les tables',
                'searchIn'=>'Recherche dans',
                'note'=>'Note',
                'notFound'=>'Rien à afficher',
                'searchNote'=>'Recherche insensible à la case et aux accents, [count] caractère%s% minimum.'
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
                'encoding'=>'Choisir un encodage pour le CSV',
                'utf8'=>'UTF-8',
                'latin1'=>'Latin-1',
                'office'=>'Utilisez Latin-1 pour utilisation dans Microsoft Office sur Windows'
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
                'modifyBottom'=>'Modifier'
            ],

            // table
            'table'=>[

                // label
                'label'=>[],

                // description
                'description'=>[
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

            // col
            'col'=>[

                // label
                'label'=>[

                    // *
                    '*'=>[],

                    // lang
                    'lang'=>[
                        'type'=>'Environnement'
                    ],

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
                        'context'=>"Défini le contexte de création de l'élément, pour administrateur.",
                        'metaKeywords_fr'=>'Mots clefs séparés par des virgules, champ facultatif',
                        'metaKeywords_en'=>'Mots clefs séparés par des virgules, champ facultatif',
                        'metaDescription_fr'=>'Aucune balise HTML, champ facultatif',
                        'metaDescription_en'=>'Aucune balise HTML, champ facultatif',
                        'date'=>"Spécifie la date pour représenter l'élément",
                        'datetimeStart'=>"Spécifie la date de début de l'élément",
                        'datetimeEnd'=>"Spécifie la date de fin de l'élément",
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
                        'uri_fr'=>"Uri de l'élément. Peut être un lien relatif ou absolut",
                        'uri_en'=>"Uri de l'élément. Peut être un lien relatif ou absolut",
                        'excerpt_fr'=>"Court résumé de l'élément, environ 2-3 phrases. Si vide se génère automatiquement à partir du contenu",
                        'excerpt_en'=>"Court résumé de l'élément, environ 2-3 phrases. Si vide se génère automatiquement à partir du contenu",
                        'content_fr'=>"Contenu principal de l'élément. Possible de copier-coller à partir de Microsoft Word. Appuyer shift+enter pour faire un saut de ligne sans créer une nouvelle balise.",
                        'content_en'=>"Contenu principal de l'élément. Possible de copier-coller à partir de Microsoft Word. Appuyer shift+enter pour faire un saut de ligne sans créer une nouvelle balise.",
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
                        'total'=>"Spécifie le total de l'élément",
                        'timezone'=>"Spécifie le fuseau horaire de l'élément"
                    ],

                    // lang
                    'lang'=>[
                        'key'=>"Clé unique de l'élément texte. Pour administrateur",
                        'type'=>"L'élément texte est accessible dans ces environnements. Pour administrateur"
                    ],

                    // redirection
                    'redirection'=>[
                        'key'=>'URL à rediriger',
                        'value'=>'Destination de la redirection',
                        'type'=>'La redirection est active dans ces environnements'
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

                    // option
                    'option'=>[
                        'type'=>"Type d'option",
                        'key'=>"Clé de l'option, utilisez /",
                        'content'=>"Contenu de l'option, peut être du json"
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
                    'general'=>'Général',
                    'generalDelete'=>'Général - Suppression',
                    'generalExportDialog'=>'Exportation',
                    'generalExport'=>'Général - Exportation',
                    'generalRelation'=>'Général - Relation',
                    'generalTruncate'=>'Vider la table',
                    'homeSearch'=>'Accueil - Recherche',
                    'specific'=>'Spécifique',
                    'specificAdd'=>'Spécifique - Ajout',
                    'specificAddSubmit'=>'Spécifique - Ajout - Soumettre',
                    'specificCalendar'=>'Spécifique - Calendrier',
                    'specificDelete'=>'Spécifique - Suppression',
                    'specificDispatch'=>'Spécifique - Envoi',
                    'specificDownload'=>'Spécifique - Téléchargement',
                    'specificDuplicate'=>'Dupliquer',
                    'specificRelation'=>'Spécifique - Relation',
                    'specificSubmit'=>'Spécifique - Soumettre',
                    'specificTableRelation'=>'Spécifique - Relation de table',
                    'specificUserWelcome'=>'Bienvenue'
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