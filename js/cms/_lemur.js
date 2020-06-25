/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// mountImmediate
// binding à faire avant le timeout de 0 pour les bindings de page
ael(document,'doc:mountImmediate',function() {
    const browscap = qs(this,"main .browscap");

    if(browscap != null)
    {
        const cookieDisabled = qs(browscap,".cookie-disabled");
        if(cookieDisabled != null)
        toggleClass(cookieDisabled,'show',!Browser.allowsCookie());
        
        const unsupportedBrowser = qs(browscap,".unsupported-browser");
        if(unsupportedBrowser != null)
        toggleClass(unsupportedBrowser,'hide',!Browser.isUnsupported());
    }
});

// initial mount
// comportements bindés une seule fois au tout début
ael(document,'doc:mountInitial',function(event,body) {
    // background
    const background = qs(body,"> .background");
    trigSetup(Component.Background.call(background));
    
    // modal
    const modal = qs(body,"> .modal");
    trigSetup(Component.Modal.call(modal));
    
    // generalComponents
    trigSetup(Component.GeneralComponents.call(this));
    
    // specificComponents
    trigSetup(Component.SpecificComponents.call(this));
});

// doc:mountCommon
// événement appelé pour faire les bindings globaux
// après le chargement d'une page ou d'un modal
ael(document,'doc:mountCommon',function(event,node) {
    
    // input
    const input = qsa(node,Dom.selectorInput(false));
    Component.Input.call(input);

    // form
    const form = qsa(node,"form");
    trigSetup(Component.Form.call(form));
    
    // select
    const select = qsa(node,"select");
    trigSetup(Component.SelectConvert.call(select));
    
    // autre
    const anchorCorner = qsa(node,"[data-anchor-corner='1']");
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder='1']");
    const aConfirm = qsa(node,"a[data-confirm]");
    const popupTrigger = qsa(node,".popup-trigger.with-popup:not(.with-ajax)");
    const popupTriggerAjax = qsa(node,".popup-trigger.with-popup.with-ajax");
    const backToTop = qs(node,"footer .back-to-top");
    const tooltip = qsa(node,"[data-tooltip]");
    const plural = qsa(node,"[data-plural]");
    
    // anchorCorner
    trigSetup(Component.AnchorCorner.call(anchorCorner));
    
    // absolutePlaceholder
    trigSetup(Component.AbsolutePlaceholder.call(absolutePlaceholder));
    
    // aConfirm
    Component.Confirm.call(aConfirm,'click');
    
    // popupTrigger
    trigSetup(Component.ClickOpenTrigger.call(popupTrigger,{trigger: ".popup-title", target: ".popup"}));
    
    // popupTriggerAjax
    trigSetup(Component.ClickOpenAjaxAnchor.call(popupTriggerAjax,{trigger: ".popup-title", target: ".popup"}));
    
    // backToTop
    trigSetup(Component.BackToTop.call(backToTop));
    
    // modalMailto
    trigSetup(Component.ModalMailto.call(node));
    
    // tooltip
    trigSetup(Component.Tooltip.call(tooltip,{target: "body > .tooltip", targetContent: ".tooltip-content", offsetTop: -8}));
    
    // externalBlank
    trigSetup(Component.ExternalBlank.call(node));
    
    // plural
    trigSetup(Component.Plural.call(plural));
});


// doc:unmountCommon
// événement appelé pour enlever des bindings globaux
ael(document,'doc:unmountCommon',function(event,node) {
    const anchorCorner = qsa(node,"[data-anchor-corner]");
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder]");
    
    trigTeardown(anchorCorner);
    trigTeardown(absolutePlaceholder);
});


// mount page
// comportements utilisés pour toutes les pages du CMS
ael(document,'doc:mountPage',function(event,node) {
    const burger = qsa(node,"header .burger-menu, .nav-fixed .nav-close");
    const com = qs(node,"main > .inner > .com");
    const subMenu = qsa(node,".with-submenu");
    const carousel = qsa(node,".with-carousel");
    const mainSearch = qs(node,"header .top form");
    
    // carousel
    trigSetup(Component.Carousel.call(carousel,{trigger: ".trigger", target: ".target", targetHeight: true, transitionTimeout: 500}));
    
    // subMenu
    trigSetup(Component.ClickOpenTrigger.call(subMenu,{trigger: ".trigger", target: ".popup", background: "submenu"}));
    
    // mainSearch
    trigSetup(Component.SearchAutoInfo.call(mainSearch,{target: ".popup"}));
    
    // com
    trigSetup(Component.Com.call(com));
    
    // burger
    trigSetup(Component.Burger.call(burger));
    const refreshHeight = function() {
        trigHdlrs(carousel,'clickOpen:refreshTargetHeight',true);
    };
    ael(burger,'resize:stop',function() {
        refreshHeight();
    });
    ael(burger,'burger:open',function() {
        refreshHeight();
    });
});


// document ajax progress
ael(document,'doc:ajaxProgress',function(event,percent,progressEvent) {
    const body = qs(this,"body");
    const progress = qs(body,".loading-progress");
    const html = (percent >= 0 && percent < 100)? Html.div(percent+"%",'percent'):"";
    setHtml(progress,html);
});

// nobody
// comportement pour les pages nobody, login, resetPassword et register
ael(document,'group:nobody',function(event,node) {
    const form = qs(this,"main form");
    trigHdlr(form,'form:focusFirst');
});


// changePassword
// comportement pour le popup changer mon mot de passe
ael(document,'modal:accountChangePassword',function(event,modal) {
    const form = qs(modal,"form");
    trigHdlr(form,'form:focusFirst');
});


// home
// comportement pour la page d'accueil du CMS une fois connecté
ael(document,'route:home',function(event,node) {
    
    const feed = qs(node,"main .home-feed");
    trigSetup(Component.HomeFeed.call(feed));
});


// general
// comportement pour la page de navigation
ael(document,'route:general',function(event,node) {
    
    const main = qs(node,"main");
    const search = qs(main,".left > .search");
    const pageLimit = qsa(main,"input[name='limit'],input[name='page']");
    const scroller = qs(main,".container .scroller");

    // page + limit
    Component.InputNumericHref.call(pageLimit);
    
    // search
    trigSetup(Component.SearchSlide.call(search,{trigger: "> .form input[type='text']", target: "> .in"}));

    if(scroller != null)
    {
        const table = qs(scroller,"table");
        const filter = qsa(table,"th.filterable .filter-outer");
        const colsSorter = qs(table,"th.action");
        const filesSlider = qsa(table,"td[data-group='media'] .slider");
        const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
        const highlight = qsa(table,"tr.highlight");
        const components = qsa(table,"tbody td[data-col]");
        
        // rowsChecker
        trigSetup(Component.RowsChecker.call(main));
        
        // colsSorter
        trigSetup(Component.ColsSorter.call(colsSorter));
        
        // filter
        trigSetup(Component.Filter.call(filter,{trigger: ".trigger", target: ".popup"}));
        
        // quickEdit
        trigSetup(Component.QuickEdit.call(quickEdit));
        
        // highlight 
        ael(highlight,'mouseover',function(event) {
            toggleClass(this,'highlight',false);
        });
        
        // dragScroll
        trigSetup(Component.ScrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));

        // filesSlider
        trigSetup(Component.TabsNav.call(filesSlider,{target: ".slider-element", prev: ".prev", next: ".next"}));
        
        // generalComponents
        trigHdlr(this,'generalComponents:setup',components);
        
        // unmount
        aelOnce(this,'route:general:unmount',function(event,node) {
            trigHdlrs(quickEdit,'quickEdit:revert');
            trigHdlr(this,'generalComponents:teardown',components);
        });
    }
});


// mountAll
// permet de faire tous les bindings des champs (simples et complexes)
ael(document,'specificForm:mountAll',function(event,node) {
    trigEvt(this,'specificForm:pageMount',node);
    trigEvt(this,'specificForm:tabFull',node);
});


// pageMount
// ces champs seront bindés au chargement de la page
ael(document,'specificForm:pageMount',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:setup',elements,false);
});


// tabFull
// gère l'initialisation et le opened d'un tab
ael(document,'specificForm:tabFull',function(event,node) {
    trigEvt(this,'specificForm:tabInit',node);
    trigEvt(this,'specificForm:tabOpened',node);
});


// tabInit
// binding à l'initialisation du panneau, une seule fois
ael(document,'specificForm:tabInit',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:setup',elements,true);
});


// tabOpened
// binding après l'ouverture du panneau
ael(document,'specificForm:tabOpened',function(event,node) {
    // anchorCorner
    const anchorCorner = qsa(node,"[data-anchor-corner]");
    trigHdlrs(anchorCorner,'anchorCorner:refresh');
    
    // absolutePlaceholder
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder]");
    trigHdlrs(absolutePlaceholder,'absolutePlaceholder:refresh');
});


// specificForm unmount
// permet démonter les champs du formulaire
ael(document,'specificForm:unmount',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:teardown',elements);
});


// specific
// comportement communs pour les pages spécifiques
ael(document,'group:specific',function(event,node) {
    
    const mainInner = qs(node,"main .inner");
    const nav = qs(mainInner,"> .top .nav");
    const form = qs(mainInner,"> .specific-form");
    const panel = qsa(form,".panel");
    
    // nav
    trigSetup(Component.SpecificNav.call(nav));
    
    // champs simples
    trigEvt(this,'specificForm:pageMount',form);
    
    // avec panel
    if(Arr.length(panel) > 1)
    {
        Component.SpecificPanel.call(form);
        ael(form,'specificPanel:setHash',function(event,hash) {
            trigHdlr(nav,'specificNav:setHash',hash);
        });
        trigSetup(form,true);
    }
    
    else
    trigEvt(this,'specificForm:tabFull',form);
    
    // unmount
    aelOnce(this,'group:specific:unmount',function(event,node) {
        trigEvt(this,'specificForm:unmount',form);
    });
});


// specificMulti
// comportement pour la page de modification multiple
ael(document,'route:specificMulti',function(event) {
    
    const form = qs(this,"main .inner > form.specific-form");
    trigSetup(Component.SpecificMulti.call(form));
});