/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

// #ifdef __AMLCODEEDITOR || __INC_ALL

/**
 * Element allowing the user to type code.
 * 
 * @constructor
 * @define codeeditor
 * @addnode elements
 *
 * @inherits apf.StandardBinding
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.1
 */
apf.codeeditor = function(struct, tagName){
    this.$init(tagName || "codeeditor", apf.NODE_VISIBLE, struct);
    
    this.documents = [];
    this.$cache    = {};
};

(function(){
    this.implement(
        //#ifdef __WITH_DATAACTION
        apf.DataAction
        //#endif
        //#ifdef __WITH_XFORMS
        //,apf.XForms
        //#endif
    );

    this.$focussable       = true; // This object can get the focus
    this.$childProperty    = "value";
    this.isContentEditable = true;

    //this.realtime          = false;
    this.syntax            = "text";
    this.tabsize           = 4;
    this.softtabs          = true;
    this.syntax            = "text";
    this.value             = "";
    this.overwrite         = false;
    this.multiline         = true;
    this.caching           = true;
    this.showinvisibles    = true;
    
    /**
     * @attribute {Boolean} realtime whether the value of the bound data is
     * updated as the user types it, or only when this element looses focus or
     * the user presses enter.
     */
    this.$booleanProperties["realtime"]         = true;
    this.$booleanProperties["activeline"]       = true;
    this.$booleanProperties["caching"]          = true;
    this.$booleanProperties["readonly"]         = true;
    this.$booleanProperties["showinvisibles"]   = true;
    this.$booleanProperties["showprintmargin"]  = true;
    this.$booleanProperties["overwrite"]        = true;
    this.$booleanProperties["readonly"]         = true;
    this.$booleanProperties["softtabs"]         = true;

    this.$supportedProperties.push("value", "realtime", "syntax", 
        "activeline", "selectstyle", "caching", "readonly", "showinvisibles",
        "showprintmargin", "printmargincolumn", "overwrite", "readonly", 
        "tabsize", "softtabs");

    /**
     * @attribute {String} value the text of this element
     * @todo apf3.0 check use of this.$propHandlers["value"].call
     */
    this.$propHandlers["value"] = function(value){ //@todo apf3.0 add support for the range object as a value
        var doc, key;
        if (this.caching) {
            if (typeof value == "string")
                key = this.xmlRoot 
                    ? this.xmlRoot.getAttribute(apf.xmldb.xmlIdTag)
                    : value;
            else
                key = value.getAttribute(apf.xmldb.xmlIdTag);
        }
        //Assuming document
        else if (value instanceof ace.Document){
            doc = value;
        }
        
        if (!doc && key)
            doc = this.$cache[key];
        
        if (!doc) {
            if (value.nodeType) {
                apf.xmldb.addNodeListener(value.nodeType == 1 
                    ? value : value.parentNode, this);
            }
            
            doc = new ace.Document(typeof value == "string"
              ? value
              : (value.nodeType > 1 && value.nodeType < 5 //@todo replace this by a proper function
                    ? value.nodeValue
                    : value.firstChild && value.firstChild.nodeValue || ""));
            
            var _self = this;
            doc.setUndoManager(new ace.UndoManager());
            
            if (key)
                this.$cache[key] = doc;
        }
        //@todo value can also be an xml node and should be updated in a similar fashion as above
        else if (typeof value == "string") {
            doc.setValue(value);
        }
        
        doc.setMode(this.$modes[this.syntax]);
        doc.setTabSize(parseInt(this.tabsize));
        doc.setUseSoftTabs(this.softtabs);
        
        this.$editor.setDocument(doc);
    };
    
    if (self.ace)
        this.$modes = {
            text : new ace.mode.Text(),
            xml  : new ace.mode.Xml(),
            html : new ace.mode.Html(),
            css  : new ace.mode.Css(),
            js   : new ace.mode.JavaScript()
        };
    
    this.$propHandlers["syntax"] = function(value){
        this.$editor.getDocument().setMode(this.$modes[value]);
    };
    
    this.$propHandlers["realtime"] = function(value){
        
    };
    
    this.$propHandlers["activeline"] = function(value){
        this.$editor.setHighlightActiveLine(value);
    };
    
    this.$propHandlers["selectstyle"] = function(value){
        this.$editor.setSelectionStyle(value);
    };

    this.$propHandlers["showprintmargin"] = function(value, prop, initial){
        this.$editor.setShowPrintMargin(value);
    };

    this.$propHandlers["printmargincolumn"] = function(value, prop, initial){
        this.$editor.setPrintMarginColumn(value);
    };
    
    this.$propHandlers["showinvisibles"] = function(value, prop, initial){
        this.$editor.setShowInvisibles(value);
    };
    
    this.$propHandlers["overwrite"] = function(value, prop, initial){
        this.$editor.setOverwrite(value);
    };

    this.$propHandlers["readonly"] = function(value, prop, initial){
        this.$editor.setReadOnly(value);
    };
    
    this.$propHandlers["tabsize"] = function(value, prop, initial){
        this.$editor.getDocument().setTabSize(parseInt(value));
    };
    
    this.$propHandlers["softtabs"] = function(value, prop, initial){
        this.$editor.getDocument().setUseSoftTabs(value);
    };
    
    this.addEventListener("xmlupdate", function(e){
        var id = e.xmlNode.getAttribute(apf.xmldb.xmlIdTag);
        if (this.$cache[id]) {
            //@todo Update document
        }
    });
    
    /**** Public Methods ****/

    //#ifdef __WITH_CONVENIENCE_API

    /**
     * Sets the value of this element. This should be one of the values
     * specified in the values attribute.
     * @param {String} value the new value of this element
     */
    this.setValue = function(value){
        return this.setProperty("value", value, false, true);
    };
    
    //@todo cleanup and put initial-message behaviour in one location
    this.clear = function(){
        this.$propHandlers["value"].call(this, "", null, true);
        
        this.dispatchEvent("clear");//@todo this should work via value change
    }

    /**
     * Returns the current value of this element.
     * @return {String}
     */
    this.getValue = function(){
        return this.$editor.getDocument().toString(); //@todo very inefficient
    };
    
    //#endif

    /**
     * Selects the text in this element.
     */
    this.select   = function(){ 
        
    };

    /**
     * Deselects the text in this element.
     */
    this.deselect = function(){ 
        this.$editor.clearSelection();
    };
    
    this.scrollTo = function(){
        
    }
    
    /**** Private Methods *****/

    this.$focus = function(e){
        if (!this.$ext || this.$ext.disabled)
            return;

        this.$setStyleClass(this.$ext, this.$baseCSSname + "Focus");
        
        this.$editor.focus();
    };

    this.$blur = function(e){
        if (!this.$ext)
            return;
        
        if (!this.realtime)
            this.change(this.getValue());

        this.$setStyleClass(this.$ext, "", [this.$baseCSSname + "Focus"]);
        this.$editor.blur();
    };
    
    //@todo
    this.addEventListener("keydown", function(e){
        //this.$editor.
    }, true);

    /**** Init ****/
    
    this.$isContentEditable = function(e){
        return true;
    }
    
    this.$draw = function(){
        //Build Main Skin
        this.$ext   = this.$getExternal();
        this.$input = this.$getLayoutNode("main", "content", this.$ext);
        
        this.addEventListener("resize", function(e){
            this.$editor.resize();
        });

        this.$editor = new ace.Editor(new ace.VirtualRenderer(this.$input));
        var self = this;

        this.$editor.addEventListener("gutterclick", function(e) {
            self.dispatchEvent("gutterclick", e);
        });

        this.$editor.addEventListener("gutterdblclick", function(e) {
            self.dispatchEvent("gutterdblclick", e);
        });
        
        apf.sanitizeTextbox(this.$editor.renderer.container.getElementsByTagName("textarea")[0]);        
    };

    this.$loadAml = function() {
        if (typeof this.realtime == "undefined")
            this.$setInheritedAttribute("realtime");
    }
// #ifdef __WITH_DATABINDING
}).call(apf.codeeditor.prototype = new apf.StandardBinding());
/* #else
}).call(apf.textbox.prototype = new apf.Presentation());
#endif*/

apf.config.$inheritProperties["initial-message"] = 1;
apf.config.$inheritProperties["realtime"]        = 1;

apf.aml.setElement("codeeditor", self.ace ? apf.codeeditor : apf.textbox);
// #endif
