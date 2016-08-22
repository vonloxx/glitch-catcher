"use strict";

/*
* Recursively merge properties of two objects
*/
Object.prototype.merge = function(object) {
  for (var p in object) {
    try {
      // Property in destination object set; update its value.
      if ( object[p].constructor==Object ) {
        this[p] = this.merge(object[p]); //this.merge(this[p], object[p]);
      } else {
        this[p] = object[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      this[p] = object[p];
    }
  }

  return this;
};
