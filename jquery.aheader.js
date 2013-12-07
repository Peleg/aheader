
jQuery(function() {
  var Aheader;
  Aheader = function(element, options) {
    this.$header = element;
    this.margin = options.margin;
    this.zIndex = options.zIndex || this.$header.css('zIndex');
    this.initStyles = this.$header[0].style.cssText;
    this.headerHeight = this.$header.height();
    this.insertPlaceholder();
    return this.bindScrolling();
  };
  Aheader.prototype = {
    constructor: Aheader,
    insertPlaceholder: function() {
      this.$header.wrap("<div class='aheader-placeholder' style='height: " + (this.headerHeight + 'px') + "'>");
      return this.$placeholder = $('.aheader-placeholder');
    },
    bindScrolling: function() {
      var _this = this;
      return $(window).on('scroll', function() {
        var newScroll;
        newScroll = _this.scrollPosition();
        if (newScroll < _this.lastScroll) {
          _this.scrollUp();
        } else {
          _this.scrollDown();
        }
        return _this.lastScroll = newScroll;
      });
    },
    scrollDown: function() {
      if (!this.isFixed()) {
        return;
      }
      return this.dropBelowFold();
    },
    scrollUp: function() {
      if (this.isAboveInitPos()) {
        if (this.isFixed()) {
          return this.returnToOrigin();
        }
      } else {
        if (this.isCovered()) {
          return this.dropAboveFold();
        } else if (this.isVisible()) {
          if (!this.isFixed()) {
            return this.makeFixed();
          }
        }
      }
    },
    returnToOrigin: function() {
      this.$header.attr('style', this.initStyles);
      return this.$placeholder.append(this.$header);
    },
    dropAboveFold: function() {
      return this.dropAt(this.scrollPosition() + this.margin - this.headerHeight);
    },
    dropBelowFold: function() {
      return this.dropAt(this.scrollPosition() + this.margin);
    },
    dropAt: function(offsetY) {
      return this.$header.css({
        top: offsetY,
        zIndex: this.zIndex,
        position: 'absolute',
        left: '0',
        right: '0'
      });
    },
    makeFixed: function() {
      return this.$header.css({
        top: this.margin,
        zIndex: this.zIndex,
        position: 'fixed',
        left: '0',
        right: '0'
      });
    },
    isAboveInitPos: function() {
      return this.scrollPosition() + this.margin < this.$placeholder.offset().top;
    },
    isFixed: function() {
      return this.$header.css('position') === 'fixed';
    },
    isCovered: function() {
      return this.scrollPosition() + this.margin > this.$header.offset().top + this.headerHeight;
    },
    isVisible: function() {
      return this.scrollPosition() + this.margin < this.$header.offset().top;
    },
    scrollPosition: function() {
      return $(window).scrollTop();
    }
  };
  return $.fn.aheader = function(options) {
    var defaults;
    defaults = {
      margin: 0
    };
    options = $.extend(defaults, options);
    return new Aheader(this, options);
  };
});
