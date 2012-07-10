/*!
 * Raphael SkRotatingMenu 0.1 - Circular menu based on Raphaël
 *
 * Copyright (c) 2011 Gianni Cossu www.skipstorm.org
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
;(function ($, window, undefined) {

    /**
     * SkRotatingMenu constructor.
     *
     * @param paper Paper
     * @param cx Number
     * @param cy Number
     * @param radius Number
     * @param elements Array
     * @param opts Object
     */
    function SkRotatingMenu(paper, cx, cy, radius, elements, opts) {
        this._paper      = paper;
        this._cx         = cx;
        this._cy         = cy;
        this._radius     = radius;
        this._elements   = elements;
		
		this._menuSet = this._paper.set();
	
        var settings = $.extend(true, {
			spaceAngle			: 30, // with negative values links are placed anti-clockwise
			circDist			: this._radius * .8,
			hoverColor			: '#008e7e',
			clickColor			: '#449e7e',
			minFontSize			: 8,
			maxFontSize			: 20,
			linkPosition		: 'right',
			textStyle			: {
				'font-family':'arial',
				'font-weight':'bold', 
				//fill:'90-#1047a9-#008e7e', // ie6 doesn't like gradient fill on text
				'fill':'#1047a9',
				'cursor': 'pointer'
			},
			shadowStyle			: {
				'font-family':'arial',
				'font-weight':'bold', 
				'fill':'#aa7011',
				opacity: .7
			},
			linkFunction		: function(){return true;}
        }, opts);
		
		this._hoverColor 	= settings.hoverColor;
		this._clickColor 	= settings.clickColor;
		this._spaceAngle 	= settings.spaceAngle;
		this._circDist 		= settings.circDist;
		this._minFontSize 	= settings.minFontSize;
		this._maxFontSize 	= settings.maxFontSize;
		this._linkPosition	= settings.linkPosition;
		this._textStyle 	= settings.textStyle;
		this._shadowStyle	= settings.shadowStyle;
		this._linkFunction 	= settings.linkFunction;
		
		if(this._linkPosition == 'left'){
			this._textStyle['text-anchor'] = 'end';
			this._shadowStyle['text-anchor'] = 'end';
			this._xPos = this._cx-this._radius-this._circDist-1;
			this._circDist = this._circDist * -1;
		} else {
			this._textStyle['text-anchor'] = 'start';
			this._shadowStyle['text-anchor'] = 'start';
			this._xPos = this._cx+this._radius-this._circDist-1;
		}
		
		this.draw();
	}
	
	
	
    /**
     * Draw
     */
    SkRotatingMenu.prototype.draw = function() {
		this._textStyle['font-size'] = this._shadowStyle['font-size'] = this._radius>32? this._radius/3 : this._minFontSize;
		var angle = 0;
		var inst = this;
		var selectedLink = false;
		
		for(var i in this._elements){
			if(this._elements[i].selected) selectedLink = i;
			this._textStyle.transform = this._shadowStyle.transform = 'r'+angle+','+this._cx+','+this._cy;			
			this._elements[i].element = {id: i, shadow: false, text: false, angle: angle, selected: false};
			// Shadow
			this._elements[i].element.shadow = this._paper.text(
				this._xPos,
				this._cy+1,
				this._elements[i].name
			).attr(this._shadowStyle);
			// Link
			this._elements[i].element.text = this._paper.text(
				this._xPos,
				this._cy,
				this._elements[i].name).attr(
					this._textStyle
				).mousedown(function(i){
					this.animate({fill:'#449e7e'}, 200, '>');
					this.attr({fill:inst._clickColor});
				}).mouseup(function(){
					inst.select(this.menuId);
				}).mouseout(function(){
					if(!inst._elements[this.menuId].element.selected)
						this.attr({fill:inst._textStyle.fill});
				}).mouseover(function(){
					this.attr({fill:inst._hoverColor});
				});
			this._elements[i].element.text.menuId = i;
			angle += this._spaceAngle;
		}
		
		if(selectedLink){
			inst.rotate('<', 0, selectedLink);
		} else {
			inst.rotate('>');
		}
	}
	
	
    /**
     * Select menu element
	 *
	 * @param id Number
     */
    SkRotatingMenu.prototype.select = function(id) {
		if(this._linkFunction(this._elements[id].href, id)){
			var shift = this._elements[id].element.angle;
			if(shift == 0) return false;
			this.rotate(
				shift > 0? '<' : '>',
				500,
				Math.abs(shift)/this._spaceAngle
			);
		}
	}
	
    /**
     * Rotate menu, can handle text resizing
	 *
	 * @param direction mixed
	 * @param delay Number
	 * @param steps Number
     */
    SkRotatingMenu.prototype.rotate = function(direction, delay, steps) {
		steps = steps || 1;
		delay = delay || 0;
		direction = (direction == '<' || direction == -1)? -1 : 1;
		var newAngle, fontSize;
		
		for(var i = 0; i < this._elements.length; i++){
			newAngle = this._elements[i].element.angle + (direction * this._spaceAngle)*steps;
			fontSize = (this._maxFontSize - 3*Math.abs(newAngle/this._spaceAngle) > this._minFontSize)? this._maxFontSize - 3*Math.abs(newAngle/this._spaceAngle) : this._minFontSize;
			this._elements[i].element.angle = newAngle;
			this._elements[i].element.selected = newAngle == 0;
			this._elements[i].element.text.animate({fill: (newAngle == 0)? this._hoverColor : this._textStyle.fill,'font-size': fontSize, transform:'r'+newAngle+','+this._cx+','+this._cy}, delay, 'bounce');
			this._elements[i].element.shadow.animate({'font-size': fontSize, transform:'r'+newAngle+','+this._cx+','+this._cy}, delay, 'bounce');
		}
	}
	
    //inheritance
    $.extend(true, SkRotatingMenu, Raphael.g);

    //public
    Raphael.fn.skRotatingMenu = function(cx, cy, radius, elements, opts) {
        return new SkRotatingMenu(this, cx, cy, radius, elements, opts);
    };

})(jQuery, window);