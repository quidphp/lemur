<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;

// tinyMce
// class for a column which transforms the textarea in a simple tinymce WYSIWYG editor
class TinyMce extends TextareaAlias
{
    // config
    protected static array $config = [
        'search'=>true,
        'tag'=>'textarea',
        'check'=>['kind'=>'text'],
        'relative'=>'app', // custom, type pour absoluteReplace, utilise ceci pour ramener les liens absoluts dans leur version relative
        'segmentRoute'=>'app', // custom, type pour segmentReplace
        'language'=>['fr'=>'fr_FR'], // tableau pour convertir un code de language quid vers tinymce
        'group'=>'tinymce',
        'tinymce'=>[ // config pour tinymce qui sera mis en attribut dans la tag textarea
            'plugins'=>'autolink code charmap fullscreen link searchreplace visualblocks wordcount',
            'toolbar'=>'styles removeformat visualblocks | bold italic underline | link charmap | searchreplace code fullscreen',
            'toolbar_mode'=>'sliding',
            'menubar'=>false,
            'branding'=>false,
            'language'=>null,
            'content_css'=>['[public]/css/%type%-tinymce.css'],
            'cache_suffix'=>'?v=%version%',
            'convert_urls'=>false,
            'entity_encoding'=>'raw',
            'fix_list_elements'=>true,
            'style_formats_autohide'=>true,
            'preview_styles'=>'font-family font-size font-weight font-style text-decoration text-transform color background-color border border-radius outline text-shadow',
            'paste_as_text'=>true,
            'paste_block_drop'=>true,
            'visualblocks_default_state'=>true,
            'style_formats'=>[
                10=>['title'=>'paragraph','format'=>'p','wrapper'=>true]]
        ]
    ];


    // hasFormLabelId
    // tinymce change le id, donc formLabelId doit retourner faux
    final public function hasFormLabelId(?array $attr=null,bool $complex=false):bool
    {
        return false;
    }


    // tinymceData
    // retourne les données de tinymce
    final public function tinymceData(?array $option=null):array
    {
        $return = (array) $this->getAttr('tinymce');
        $boot = static::boot();
        $lang = $boot->lang();
        $currentLang = $lang->currentLang();
        $languages = $this->getAttr('language');

        if(is_array($languages) && array_key_exists($currentLang,$languages))
        $return['language'] = $languages[$currentLang];

        if(!empty($return['content_css']))
        {
            $return['content_css'] = (array) $return['content_css'];
            foreach ($return['content_css'] as $key => $value)
            {
                if(is_string($value))
                {
                    $value = str_replace('%type%',$boot->type(),$value);
                    $return['content_css'][$key] = Base\Uri::absolute($value);
                }

                else
                unset($return['content_css'][$key]);
            }
        }

        if(!empty($return['cache_suffix']) && is_string($return['cache_suffix']))
        $return['cache_suffix'] = str_replace('%version%',$boot->version(),$return['cache_suffix']);

        if(!empty($return['style_formats']) && is_array($return['style_formats']))
        {
            foreach ($return['style_formats'] as $key => $value)
            {
                if(is_array($value) && array_key_exists('title',$value))
                $return['style_formats'][$key]['title'] = $lang->def(['tinymce',$value['title']]);

                else
                unset($return['style_formats'][$key]);
            }

            ksort($return['style_formats']);
            $return['style_formats'] = array_values($return['style_formats']);
        }

        return Base\Arr::replace($return,$option);
    }


    // formComplex
    // génère le formComplex pour tinymce
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = null;
        $tag = $this->complexTag($attr);

        if(Html::isFormTag($tag,true))
        $attr = Base\Attr::append(['data'=>['tinymce'=>$this->tinymceData()]],$attr);

        else
        $attr['tag'] = 'iframe';

        $return = parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
TinyMce::__init();
?>