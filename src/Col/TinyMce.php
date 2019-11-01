<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;

// tinyMce
// class for a column which transforms the textarea in a simple tinymce WYSIWYG editor
class TinyMce extends TextareaAlias
{
    // config
    public static $config = [
        'search'=>true,
        'tag'=>'textarea',
        'check'=>['kind'=>'text'],
        'relative'=>'app', // custom, type pour absoluteReplace, utilise ceci pour ramener les liens absoluts dans leur version relative
        'segmentRoute'=>'app', // custom, type pour segmentReplace
        'language'=>['fr'=>'fr_FR'], // tableau pour convertir un code de language quid vers tinymce
        'group'=>'tinymce',
        'tinymce'=>[ // config pour tinymce qui sera mis en attribut dans la tag textarea
            'plugins'=>'autolink code charmap fullscreen hr link lists paste print searchreplace visualblocks wordcount',
            'toolbar'=>'styleselect removeformat visualblocks | bold italic underline | bullist numlist | link charmap hr | searchreplace print code fullscreen',
            'branding'=>false,
            'add_unload_trigger'=>false,
            'cache_suffix'=>'?v=%version%',
            'content_css'=>['[public]/css/tinymce.css'],
            'convert_urls'=>false,
            'entity_encoding'=>'raw',
            'fix_list_elements'=>true,
            'language'=>null,
            'menubar'=>false,
            'paste_as_text'=>true,
            'preview_styles'=>true,
            'style_formats_autohide'=>true,
            'toolbar_drawer'=>'sliding',
            'visualblocks_default_state'=>true,
            'style_formats'=>[
                10=>['title'=>'paragraph','format'=>'p','wrapper'=>true],
                11=>['title'=>'superscript','format'=>'superscript'],
                13=>['title'=>'header2','format'=>'h2'],
                14=>['title'=>'header3','format'=>'h3'],
                15=>['title'=>'header4','format'=>'h4'],
                16=>['title'=>'header5','format'=>'h5'],
                17=>['title'=>'header6','format'=>'h6']
            ]]
    ];


    // hasFormLabelId
    // tinymce change le id, donc formLabelId doit retourner faux
    public function hasFormLabelId(?array $attr=null,bool $complex=false):bool
    {
        return false;
    }


    // tinymceData
    // retourne les données de tinymce
    public function tinymceData():array
    {
        $return = (array) $this->getAttr('tinymce');
        $boot = static::boot();
        $lang = $boot->lang();
        $currentLang = $lang->currentLang();
        $languages = $this->getAttr('language');

        if(is_array($languages) && array_key_exists($currentLang,$languages))
        $return['language'] = $languages[$currentLang];

        $return['content_css'] = (array) $return['content_css'];
        foreach ($return['content_css'] as $key => $value)
        {
            if(is_string($value))
            $return['content_css'][$key] = Base\Uri::absolute($value);

            else
            unset($return['content_css'][$key]);
        }

        if(is_string($return['cache_suffix']))
        $return['cache_suffix'] = str_replace('%version%',$boot->version(),$return['cache_suffix']);

        if(is_array($return['style_formats']))
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

        return $return;
    }


    // formComplex
    // génère le formComplex pour tinymce
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = null;
        $tag = $this->complexTag($attr);

        if(Base\Html::isFormTag($tag,true))
        $attr = Base\Attr::append(['tinymce','data'=>['tinymce'=>$this->tinymceData()]],$attr);

        else
        $attr['tag'] = 'iframe';

        $return = parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
TinyMce::__init();
?>