<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Lemur;

// _meta
// trait with methods to make a row a meta-source
trait _meta
{
    // config
    protected static array $configMeta = [
        'meta'=>[ // permet de définir les cellules pour les méta-données
            'metaTitle'=>['metaTitle_[lang]','name_[lang]'],
            'metaKeywords'=>'metaKeywords_[lang]',
            'metaDescription'=>['metaDescription_[lang]','excerpt_[lang]','content_[lang]'],
            'metaImage'=>['metaImage_[lang]'=>-1]]
    ];


    // metaTitle
    // retourne les données pour le meta title
    public function getMetaTitle($value=null)
    {
        return $this->metaLoop('metaTitle');
    }


    // metaKeywords
    // retourne les données pour le meta keywords
    public function getMetaKeywords($value=null)
    {
        return $this->metaLoop('metaKeywords');
    }


    // metaDescription
    // retourne les données pour le meta description
    public function getMetaDescription($value=null)
    {
        return $this->metaLoop('metaDescription');
    }


    // metaImage
    // retourne les données pour le meta image
    public function getMetaImage($value=null)
    {
        $return = null;
        $meta = $this->getAttr(['meta','metaImage']);

        if(is_array($meta) && !empty($meta))
        {
            foreach ($meta as $name => $version)
            {
                if(is_string($name) && $this->hasCell($name))
                {
                    if(!is_array($version))
                    $version = [$version];

                    $cell = $this->cell($name);
                    $return = $cell->file(...$version);
                    break;
                }
            }
        }

        return $return;
    }


    // metaLoop
    // loop des noms de cellules, retourne la première cellule existante et non vide
    final protected function metaLoop(string $type):?Lemur\Cell
    {
        $return = null;
        $loop = $this->getAttr(['meta',$type]);

        if(!is_array($loop))
        $loop = (array) $loop;

        foreach ($loop as $name)
        {
            if($this->hasCell($name))
            {
                $cell = $this->cell($name);
                if($cell->isNotEmpty())
                {
                    $return = $cell;
                    break;
                }
            }
        }

        return $return;
    }


    // getHtmlAttr
    // retourne les données des attributs de html
    public function getHtmlAttr($value=null):?array
    {
        return null;
    }


    // getBodyAttr
    // retourne les données des attributs de body
    public function getBodyAttr($value=null):?array
    {
        return null;
    }
}
?>