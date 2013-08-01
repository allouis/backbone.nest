/*
 *  Copyright (c) 2013 Fabien O'Carroll
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *   
 *   The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 *   
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *   THE SOFTWARE.
 */
(function(a){_.extend(a.Model.prototype,{toJSON:function(b){var c=this.attributes,d=_.clone(c);if(b)return d[b]=d[b].toJSON(),d;for(p in c)c[p]instanceof a.Collection&&(d[p]=d[p].toJSON());return d},listenToCollection:function(b){var c=this.attributes;if(b)return this.listenTo(c[b],"change",function(){this.trigger("change change:"+b)},this);for(b in c)if(c[b]instanceof a.Collection)return this.listenTo(c[b],"change",function(){this.trigger("change change:"+b)},this)}})})(Backbone);
