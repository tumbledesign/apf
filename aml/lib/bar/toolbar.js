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

define(["optional!aml", "aml/bar/bar"], 
    function(aml, Bar){

/**
 * Element displaying a bar containing buttons and other aml elements.
 * This element is usually positioned in the top of an application allowing
 * the user to choose from grouped buttons.
 * Example:
 * <code>
 *  <a:menu id="menu5">
 *      <a:item>About us</a:item>
 *      <a:item>Help</a:item>
 *  </a:menu>
 *  <a:menu id="menu6">
 *      <a:item icon="email.png">Tutorials</a:item>
 *      <a:item>Live Helps</a:item>
 *      <a:divider></a:divider>
 *      <a:item>Visit Ajax.org</a:item>
 *      <a:item>Exit</a:item>
 *  </a:menu>
 *  <a:window 
 *    id          = "winMail"
 *    contextmenu = "menu6"
 *    width       = "300"
 *    height      = "200" 
 *    visible     = "true"
 *    resizable   = "true" 
 *    title       = "Mail message"
 *    icon        = "email.png">
 *      <a:toolbar>
 *          <a:menubar>
 *              <a:button submenu="menu6">File</a:button>
 *              <a:button submenu="menu5">Edit</a:button>
 *          </a:menubar>
 *      </a:toolbar>
 *  </a:window>
 * </code>
 *
 * @constructor
 * @define toolbar
 * @addnode elements
 * @allowchild bar, menubar
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.4
 *
 * @inherits apf.Presentation
 */
var Toolbar = function (struct, tagName){
    Presentation.call(this, struct, tagName || "toolbar");
};
Toolbar.prototype = Bar.prototype;
aml && aml.setElement("toolbar",  Toolbar);

return Toolbar;

    }
);